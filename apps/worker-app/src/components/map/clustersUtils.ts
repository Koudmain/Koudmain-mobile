import { Dimensions } from 'react-native';
// 1. On change le nom de l'import pour utiliser la majuscule conventionnelle
import Supercluster from 'supercluster';

function getZoomLevel(longitudeDelta: number) {
  const angle = longitudeDelta;
  return Math.round(Math.log(360 / angle) / Math.LN2);
}

export function getCluster(places: any[], region: any) {
  // 2. CORRECTION : On ajoute impérativement le mot-clé "new" ici
  const cluster = new Supercluster({
    radius: 40,
    maxZoom: 16,
  });

  let markers = [];

  try {
    const padding = 0;

    cluster.load(places);

    markers = cluster.getClusters(
      [
        region.longitude - region.longitudeDelta * (0.5 + padding),
        region.latitude - region.latitudeDelta * (0.5 + padding),
        region.longitude + region.longitudeDelta * (0.5 + padding),
        region.latitude + region.latitudeDelta * (0.5 + padding),
      ],
      getZoomLevel(region.longitudeDelta),
    );
  } catch (e) {
    console.debug('failed to create cluster', e);
  }

  return {
    markers,
    cluster,
  };
}