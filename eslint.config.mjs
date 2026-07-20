import { nativeConfig } from '@koudmain/eslint-config/native';
import { defineConfig } from 'eslint/config';

/**
 * Root ESLint configuration.
 *
 * Used when ESLint runs from the repository root (e.g. the pre-commit hook,
 * which passes only the staged files). A single config here lets us lint
 * files from every workspace - apps/* and packages/* - in one pass without
 * scanning the whole repo.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.expo/**',
      '**/.turbo/**',
      '**/src/components/ui/**',
      'packages/eslint-config/**',
      'packages/typescript-config/**',
      // Auto-generated declaration files — must not be edited
      '**/*.d.ts',
    ],
  },
  ...nativeConfig,
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['apps/*/tsconfig.json', 'packages/*/tsconfig.json'],
        },
      },
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['expo-secure-store'] }],
    },
  },
]);
