/**
 * @fileoverview feature sliced relative path checker
 * @author Igor
 */
"use strict";

const path = require('path');
const { getProjectPath } = require('../helpers/getProjectPath');
const {isPathRelative} = require('../helpers/isPathRelative');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, 
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, 
    },
    fixable: 'code', 
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
    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        // example C:\Users\Public.KOMPUTER\plugins
        const projectPath = getProjectPath(context)
        if (shouldBeRelative(projectPath, importTo)) {
          context.report({
            node, 
            message: 'В рамках одного слайса все пути должны быть относительными',
            fix: (fixer => {
              const projectPathWithoutFile = projectPath.split('/').slice(0,-1).join('/');
              let relativePath = path.relative(projectPathWithoutFile, `/${importTo}`)
              .replace(/[\\]+/g, "/")
              if(!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }
              return fixer.replaceText(node.source, `'${relativePath}'`)
            })
          })
        }
      }
    };
  },
};

const layers = {
  'entities' : 'entities',
  'features' : 'features',
  'shared' : 'shared',
  'pages' : 'pages',
  'widgets': 'widgets',
}

function shouldBeRelative(projectPath, to) {
  if(isPathRelative(to)) {
    return false;
  }

  // example entities/Article
  const toArray = to.split('/')
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article
  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const fromArray = projectPath.split('/'); // [ '', 'entities', 'Article' ]
  const fromLayer = fromArray[1]; // entities
  const fromSlice = fromArray[2]; // Article
if (!fromLayer || !fromSlice || !layers[fromLayer]) {
  return false;
}

return fromSlice === toSlice && toLayer === fromLayer;
}