const baseConfig = require('../../packages/koudmain-ui/tailwind.config.js');

const appThemeExtend = {
  colors: {},
};

module.exports = {
  ...baseConfig,
  presets: [require('nativewind/preset'), baseConfig],
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/koudmain-ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
      ...appThemeExtend,
      colors: {
        ...baseConfig.theme?.extend?.colors,
        ...appThemeExtend.colors,
      },
    },
  },
  plugins: [...(baseConfig.plugins || [])],
};
