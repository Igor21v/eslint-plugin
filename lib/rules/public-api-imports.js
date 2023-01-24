/**
 * @fileoverview plugin for eslint
 * @author Igor
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "plugin for eslint",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options[0]?.alias || '';
    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        // example C:\Users\Public.KOMPUTER\plugins
        const fromFilename = context.getFilename();
        
        if (shouldBeRelative(fromFilename, importTo)) {
          context.report(node, 'В рамках одного слайса все пути должны быть относительными')
        }
      }
    };
  },
};
