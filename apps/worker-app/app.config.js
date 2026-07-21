const appJson = require('./app.json');

const googleMapsApiKey = process.env.GOOGLE_MAP_API_KEY;

module.exports = ({ config }) => ({
  ...appJson.expo,
  ...config,
  ios: {
    ...appJson.expo.ios,
    ...config?.ios,
    config: {
      ...appJson.expo.ios?.config,
      ...config?.ios?.config,
      googleMapsApiKey,
    },
  },
  android: {
    ...appJson.expo.android,
    ...config?.android,
    config: {
      ...appJson.expo.android?.config,
      ...config?.android?.config,
      googleMaps: {
        ...appJson.expo.android?.config?.googleMaps,
        ...config?.android?.config?.googleMaps,
        apiKey: googleMapsApiKey,
      },
    },
  },
});
