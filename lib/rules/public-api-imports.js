const {isPathRelative} = require('../helpers');

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
        }
      }
    }],
  },

  create(context) {
    const alias = context.options[0]?.alias || '';
    const CheckingLayers = {
      'entities' : 'entities',
      'features' : 'features',
      'pages' : 'pages',
      'widgets': 'widgets',
    }
    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;
        if(isPathRelative(importTo)) {
          return;
        }

        // [entities, article, model, types]
        const segments = importTo.split('/')
        const layers = segments[0]
        if (!CheckingLayers[layers]) {
          return
        }

        const isImportNotFromPublicApi = segments.length > 2;
        if (isImportNotFromPublicApi) {
          context.report(node, 'Абсолютный импорт разрешен только из Public API (index.ts)')
        }
      }
    };
  },
};
