import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactCompilerPlugin from "eslint-plugin-react-compiler";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  plugins: { "eslint-plugin-react-compiler": reactCompilerPlugin },
  rules: {
    "eslint-plugin-react-compiler/react-compiler": "error",
  },
});
