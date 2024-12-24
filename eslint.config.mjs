import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "prettier/prettier": [
                "warn",
                {
                    trailingComma: "es5",
                    tabWidth: 4,
                    semi: true,
                    singleQuote: false,
                    printWidth: 80,
                    bracketSpacing: true,
                },
            ],
        },
        ignores: ["**/node_modules/", "**/dist/"],
    },
];
