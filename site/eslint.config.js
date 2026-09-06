import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx,vue}'],
        extends: [js.configs.recommended, tseslint.configs.recommended, pluginVue.configs['flat/recommended']],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            // Force 1 attribute per line for both singleline and multiline tags
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: { max: 1 },
                    multiline: { max: 1 },
                },
            ],
            'vue/multi-word-component-names': 'off',
        },
    },
]);
