import globals from "globals";
import pluginJs from "@eslint/js";
import * as tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier"; 

/** @type {import('eslint').Linter.Config[]} */
const config = [
    {
        files: ["**/*.{js,cjs,ts}"],
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }] ,
             '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    prettierConfig,
];

export default config; 
