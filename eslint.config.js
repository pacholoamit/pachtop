import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactCompilerPlugin from "eslint-plugin-react-compiler";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(eslint.configs.recommended, {
  plugins: { "eslint-plugin-react-compiler": reactCompilerPlugin, "unused-imports": unusedImports },
  rules: {
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "eslint-plugin-react-compiler/react-compiler": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
});
