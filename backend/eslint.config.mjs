import js from "@eslint/js";
import { fileURLToPath } from "node:url";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const ROOT_DIR = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig([
  globalIgnores(["dist/**", "coverage/**", "node_modules/**", "**/*.d.ts"]),
  {
    files: ["src/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        tsconfigRootDir: ROOT_DIR,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "TSAsExpression[typeAnnotation.type!='TSConstKeyword'][typeAnnotation.typeName.name!='const']",
          message:
            "Type assertion with 'as' is forbidden. Use explicit typing or runtime validation. If absolutely necessary, disable per line: eslint-disable-next-line no-restricted-syntax.",
        },
      ],
    },
  },
]);
