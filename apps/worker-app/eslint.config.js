import { nextJsConfig } from "@koudmain/eslint-config/next-js";
import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  ...nextJsConfig,
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*', 'node_modules/*'],
  },
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'import/no-unresolved': ['error', { ignore: ['expo-secure-store'] }],
    },
  },
]);
