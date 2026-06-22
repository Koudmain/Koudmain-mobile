import { nativeConfig } from "@koudmain/eslint-config/native";
import { defineConfig } from "eslint/config";

/**
 * Root ESLint configuration.
 *
 * Used when ESLint runs from the repository root (e.g. the pre-commit hook,
 * which passes only the staged files). A single config here lets us lint
 * files from every workspace — apps/* and packages/* — in one pass without
 * scanning the whole repo.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.expo/**",
      "**/.turbo/**",
      // Generated gluestack-ui components.
      "**/src/components/ui/**",
      // Config-only packages have no source to lint.
      "packages/eslint-config/**",
      "packages/typescript-config/**",
    ],
  },
  ...nativeConfig,
  {
    // From the repo root the import resolver must know every workspace's
    // tsconfig so per-package path aliases (e.g. "@/...") resolve correctly.
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["apps/*/tsconfig.json", "packages/*/tsconfig.json"],
        },
      },
    },
    rules: {
      "import/no-unresolved": ["error", { ignore: ["expo-secure-store"] }],
    },
  },
]);
