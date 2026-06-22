import { nativeConfig } from '@koudmain/eslint-config/native';
import { defineConfig } from 'eslint/config';

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  ...nativeConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    rules: {
      'import/no-unresolved': ['error', { ignore: ['expo-secure-store'] }],
    },
  },
]);
