# `@koudmain/eslint-config`

Collection of internal ESLint configurations for the Koudmain Turborepo workspace.

## Separation of Concerns

This package categorizes and exports modular ESLint configurations. This allows applications and packages within the monorepo to extend only the rules they strictly need, preventing unnecessary dependencies (e.g., avoiding React rules in a plain TypeScript server package).

### Available Configurations

- **`@koudmain/eslint-config/base`**
  The core foundational setup. It includes JavaScript rules, TypeScript integration (`typescript-eslint`), Prettier formatting, and Turbo plugin rules.
  _Ideal for: Node.js scripts, backend services, and pure TypeScript libraries._

- **`@koudmain/eslint-config/react-internal`**
  Extends the base configuration with React and React Hooks plugins (`eslint-plugin-react`, `eslint-plugin-react-hooks`).
  _Ideal for: Shared React components or React Native applications._

- **`@koudmain/eslint-config/next-js`**
  Extends the base configuration with Next.js defaults (`@next/eslint-plugin-next`).
  _Ideal for: Next.js web applications._

## Usage

To use a configuration, extend it within the `eslint.config.js` (or `eslint.config.mjs`) of the target app or package:

```js
import baseConfig from '@koudmain/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...baseConfig,
  // Add app-specific rules or overrides here
];
```
