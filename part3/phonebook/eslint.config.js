import globals from 'globals';
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
            globals: globals.node,
        },
        plugins: {
            '@stylistic/js': stylisticJs,
        },
        rules: {
            '@stylistic/js/linebreak-style': ['error', 'unix'],
            '@stylistic/js/quotes': ['error', 'single'],
            'no-trailing-spaces': 'error',
            'arrow-spacing': ['error', {before: true, after: true}],
            eqeqeq: 'error',
        },
    },
    {
        ignores: ['dist/**'],
    },
];

// import js from "@eslint/js";
// import globals from "globals";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
//   { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
// ]);
