import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("next/core-web-vitals", "next/typescript", "standard", "prettier"),

    rules: {
        "no-undef": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "react-hooks/exhaustive-deps": "off",
        "react-hooks/rules-of-hooks": "off",
    },
}]);