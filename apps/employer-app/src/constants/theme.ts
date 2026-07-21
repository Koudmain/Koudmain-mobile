import tailwindConfig from '../../../../packages/koudmain-ui/tailwind.config';

export const colors = (tailwindConfig?.theme?.extend?.colors || {}) as Record<
  string,
  string | Record<string, string>
>;
