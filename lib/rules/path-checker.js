/**
 * @fileoverview feature sliced relative path checker
 * @author Igor
 */
"use strict";

const path = require('path')

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {


    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const importTo = node.source.value

        // example C:\Users\Public.KOMPUTER\plugins
        const fromFilename = context.getFilename();
        
        if (shouldBeRelative(fromFilename, importTo)) {
          context.report(node, 'В рамках одного модуля все пути должны быть относителными')
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

function isPathRelative(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

function shouldBeRelative(from, to) {
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

  const fromNormalizedPath = path.toNamespacedPath(from);
  const isWindowsOS = fromNormalizedPath.includes('\\');
  const fromPath = fromNormalizedPath.split('src')[1];
  const fromArray = fromPath.split(isWindowsOS ? '\\' : '/'); // [ '', 'entities', 'Article' ]
  const fromLayer = fromArray[1]; // entities
  const fromSlice = fromArray[2]; // Article
if (!fromLayer || !fromSlice || !layers[fromLayer]) {
  return false;
}

return fromSlice === toSlice && toLayer === fromLayer;
}