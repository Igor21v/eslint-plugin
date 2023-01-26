const { isPathRelative } = require('../helpers/isPathRelative');
const micromatch = require("micromatch");
const { getProjectPath } = require('../helpers/getProjectPath');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced api imports checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
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
        const layers = segments[0]
        if (!CheckingLayers[layers]) {
          return
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4
        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report(node, 'Абсолютный импорт разрешен только из Public API (index.ts)')
        }
        if (isTestingPublicApi) {
          const projectPath = getProjectPath(context)
          const isCurrentFileTesting = testFilesPatterns.some(
            pattert => micromatch.isMatch(projectPath, pattert)
          )
          if (!isCurrentFileTesting) {
            context.report(node, 'Тестовые данные необходимо импортировать из publicApi/testing.ts')
          }
        }

      }
    };
  },
};
