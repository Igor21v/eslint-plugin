/**
 * @fileoverview feature sliced relative path checker
 * @author Igor
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: 'C:\\Users\\Public\\Desktop\\javascript\\production_project\\src\\entities\\Article\\index.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\Public\\Desktop\\javascript\\production_project\\src\\entities\\Article\\index.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
      options: [
        {
          alias: '@'
        }
      ],
      output: "import { addCommentFormActions, addCommentFormReducer } from './model/slices/addCommentFormSlice'",
    },
    {
      filename: 'C:\\Users\\Public\\Desktop\\javascript\\production_project\\src\\entities\\Article\\index.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
      output: "import { addCommentFormActions, addCommentFormReducer } from './model/slices/addCommentFormSlice'",
    },
  ],
});
