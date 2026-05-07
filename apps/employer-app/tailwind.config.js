const baseConfig = require('../../packages/koudmain-ui/tailwind.config.js');

module.exports = {
  presets: [require('nativewind/preset'), baseConfig],
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/koudmain-ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
