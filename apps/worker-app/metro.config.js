const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

module.exports = (() => {
  const projectRoot = __dirname;
  const monorepoRoot = path.resolve(projectRoot, '../..');

  const config = getDefaultConfig(projectRoot);

  const { transformer, resolver } = config;

  config.watchFolders = [monorepoRoot];

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };

  config.resolver = {
    ...resolver,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return withNativeWind(config, { input: './src/global.css' });
})();
