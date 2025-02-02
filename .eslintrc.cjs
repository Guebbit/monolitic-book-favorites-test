/* eslint-env node */
// eslint-disable-next-line filenames/match-regex
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
    "root": true,
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "@typescript-eslint/parser",
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript",
        "@vue/eslint-config-prettier/skip-formatting"
    ],
    "plugins": [
        "@typescript-eslint",
        "filenames",
        "html"
    ],
    "rules": {
        "no-console": "warn",
        "no-debugger":"warn",
        "vue/script-indent": "off",
        "vue/multi-word-component-names": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "vue/require-default-prop": "off",
        "vue/no-v-html": "off",
        "no-nested-ternary": "off",
        "@typescript-eslint/naming-convention": [
            "error",
            {
                "selector": "default",
                "format": ["camelCase", "PascalCase"],
                "leadingUnderscore": "allow",
                "trailingUnderscore": "allow"
            },
            {
                "selector": "variable",
                "format": ["camelCase", "UPPER_CASE"],
                "leadingUnderscore": "allow",
                "trailingUnderscore": "allow"
            },
            {
                "selector": ["class", "typeLike", "typeParameter", "enum"],
                "format": ["PascalCase"]
            },
            {
                "selector": ["function"],
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "interface",
                "format": ["PascalCase"],
                "custom": {
                    "regex": "^I[A-Z]",
                    "match": true
                }
            },
            {
                "selector": "enum",
                "format": ["PascalCase"],
                "custom": {
                    "regex": "^E[A-Z]",
                    "match": true
                }
            },
            {
                "selector": ["memberLike", "enumMember"],
                "format": ["camelCase", "PascalCase", "UPPER_CASE", "snake_case"],
                "leadingUnderscore": "allow",
                "trailingUnderscore": "allow"
            }
        ],
        "filenames/match-regex": [
            "error",
            "^_?[a-z]+([A-Z][a-z]+)*_?$",
            true
        ]
    },
    "overrides": [
        {
            "files": ["*.d.ts", "*.spec.ts", "*.cy.ts", "*.config.ts", "*.conf.ts", "*.test.ts", "src/components/**/*.ts"],
            "rules": {
                "filenames/match-regex": "off",
                "@typescript-eslint/naming-convention": "off"
            }
        },
        {
            "files": [
                "*.vue",
                "*.tsx"
            ],
            "rules": {
                "filenames/match-regex": [
                    "error",
                    "^[A-Z][a-z]+([A-Z][a-z]+)*$",
                    true
                ]
            }
        },
        {
            "files": ["tests/**/*"],
            "env": {
                "jest": true
            }
        }
    ]
}
