import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import";
import pluginHooks from "eslint-plugin-react-hooks";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Globally ignore some directories
  {
    ignores: [
      "**/.turbo/**",
      "**/.wrangler/**",
      "**/dist/**",
      "**/bin/**",
      "**/.store/**",
      "**/.vite-cache/**",
      "**/.yarn/**",
    ],
  },

  // Add all of the recommended configurations
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  ...tseslint.configs.recommended,

  // Customizations
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          // Use the TypeScript configuration file
          project: "packages/*/tsconfig.json",
          alwaysTryTypes: true,
        },
        node: {
          // Allow resolving node modules
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    plugins: {
      "react-hooks": pluginHooks,
    },
    rules: {
      ...pluginHooks.configs.recommended.rules,
      "react/prop-types": 0,
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "import/order": [
        1,
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "sibling",
            "parent",
            "index",
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              group: "external",
              pattern: "react",
              position: "before",
            },
            {
              group: "external",
              pattern: "@buttery/**",
              position: "after",
            },
          ],
        },
      ],
    },
  },

  // Don't require the display name in any of the files that are pure examples
  {
    files: [
      "**/*.example.ts",
      "**/*.example.tsx",
      "**/*.code.ts",
      "**/*.code.tsx",
    ],
    rules: {
      "react/display-name": 0,
    },
  },
];
