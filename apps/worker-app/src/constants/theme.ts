import tailwindConfig from '@/tailwind.config';

export const colors = (tailwindConfig?.theme?.extend?.colors || {}) as Record<
  string,
  string | Record<string, string>
>;
