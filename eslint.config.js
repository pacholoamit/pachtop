// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";
// import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import unusedImports from "eslint-plugin-unused-imports";
// import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

export default [
  // { languageOptions: { globals: globals.browser } },
  // pluginJs.configs.recommended,
  // ...tseslint.configs.recommended,
  // pluginReactConfig,
  {
    plugins: {
      // "unused-imports": unusedImports,
      // "no-relative-import-paths": noRelativeImportPaths, // TODO: FIX THIS
    },

    rules: {
      // "no-relative-import-paths/no-relative-import-paths": ["warn", { allowSameFolder: true, prefix: "@" }],
      // "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      // "unused-imports/no-unused-imports": "error",
      // "unused-imports/no-unused-vars": [
      //   "warn",
      //   {
      //     vars: "all",
      //     varsIgnorePattern: "^_",
      //     args: "after-used",
      //     argsIgnorePattern: "^_",
      //   },
      // ],
    },
  },
];
