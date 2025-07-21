import js from "@eslint/js";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
    {
        // needs to be in its own object to act as global ignore
        ignores: ["dist"],
    },
]);
