import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginUnicorn from 'eslint-plugin-unicorn';
import { config as baseConfig } from './base.js';

/**
 * Shared ESLint configuration for React Native / Expo packages
 * (apps and shared UI library). Used as the single source of truth
 * so the same rules apply everywhere, whether run per-package or from
 * the repository root.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nativeConfig = defineConfig([
  ...baseConfig,
  expoConfig,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    plugins: { unicorn: pluginUnicorn },
    rules: {
      'unicorn/filename-case': ['warn', { case: 'camelCase' }],
    },
  },
  {
    files: ['**/*.tsx'],
    plugins: { unicorn: pluginUnicorn },
    rules: {
      'unicorn/filename-case': [
        'warn',
        {
          case: 'pascalCase',
          ignore: ['^_layout\\.tsx$', '^\\[.*\\]\\.tsx$', '^index\\.tsx$'],
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/**', '.expo/**', 'node_modules/**', '**/src/components/ui/**'],
  },
]);
