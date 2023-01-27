const { isPathRelative } = require('../helpers/isPathRelative');
const micromatch = require("micromatch");
const { getProjectPath } = require('../helpers/getProjectPath');

const PUBLIC_ERROR = "PUBLIC_ERROR";
const TESTING_PUBLIC_ERROR = "TESTING_PUBLIC_ERROR";

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced api imports checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    messages: {
      [PUBLIC_ERROR]: 'Абсолютный импорт разрешен только из Public API (index.ts, testing.ts)',
      [TESTING_PUBLIC_ERROR]: 'Тестовые данные могут быть импортированы только в файлы указанные в опции линтера testFilesPatterns',
    },
    schema: [{
      type: 'object',
      properties: {
        alias: {
          type: 'string'
        },
        testFilesPatterns: {
          type: 'array'
        }
      }
    }],
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};
    const CheckingLayers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets',
    }
    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;
        if (isPathRelative(importTo)) {
          return;
        }

        // [entities, article, model, types]
        const segments = importTo.split('/')
        const layer = segments[0]
        const slice = segments[1]
        if (!CheckingLayers[layer]) {
          return
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4
        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            messageId: PUBLIC_ERROR,
            fix: (fixer) => {
              return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
            }
          });
        }
        if (isTestingPublicApi) {
          const projectPath = getProjectPath(context)
          const isCurrentFileTesting = testFilesPatterns.some(
            pattert => micromatch.isMatch(projectPath, pattert)
          )
          if (!isCurrentFileTesting) {
            context.report({
              node,
              messageId: TESTING_PUBLIC_ERROR,
            });
          }
        }

      }
    };
  },
};
