// import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
// import { View, StyleSheet, Image, Text } from 'react-native';
// import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import MapView from 'react-native-map-clustering';
// import { apiFetch } from '@/utils/api';
// import { useSession } from '@/context/SessionContext';
// import MapMarker from '@/components/map/MapMarker';
// const customMarkerImage = require('@/assets/images/google_maps_pin.png');

// // 1. On isole UNIQUEMENT le rendu graphique de l'image pour bloquer les fuites mémoire d'iOS
// // On nomme clairement la fonction interne (ici MarkerImageComponent)
// const StaticMarkerImage = React.memo(function MarkerImageComponent() {
//   return (
//     <Image source={customMarkerImage} style={{ width: 32, height: 32 }} resizeMode="contain" />
//   );
// });

// const BELLECOUR_REGION = {
//   latitude: 45.7578,
//   longitude: 4.8321,
//   latitudeDelta: 0.015,
//   longitudeDelta: 0.015,
// };

// export default function MapScreen() {
//   const mapRef = useRef(null);
//   const lastRegionRef = useRef(BELLECOUR_REGION);
//   const debounceTimer = useRef<NodeJS.Timeout | null>(null);
//   const { session } = useSession();
//   const [addresses, setAddresses] = useState<any[]>([]);

//   useEffect(() => {
//     return () => {
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     };
//   }, []);

//   const fetchAddresses = useCallback(
//     async (region: any) => {
//       const min_lat = region.latitude - region.latitudeDelta / 2;
//       const max_lat = region.latitude + region.latitudeDelta / 2;
//       const min_lng = region.longitude - region.longitudeDelta / 2;
//       const max_lng = region.longitude + region.longitudeDelta / 2;

//       try {
//         const data = await apiFetch<any[]>(
//           `/address/map?min_lat=${min_lat}&max_lat=${max_lat}&min_lng=${min_lng}&max_lng=${max_lng}`,
//           { method: 'GET', token: session },
//         );
//         setAddresses(data ?? []);
//       } catch (e) {
//         console.error(e);
//       }
//     },
//     [session],
//   );

//   const handleRegionChangeComplete = useCallback(
//     (region: any) => {
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);
//       debounceTimer.current = setTimeout(() => {
//         const prev = lastRegionRef.current;
//         const positionChanged =
//           Math.abs(prev.latitude - region.latitude) > prev.latitudeDelta * 0.2 ||
//           Math.abs(prev.longitude - region.longitude) > prev.longitudeDelta * 0.2;
//         const zoomChanged =
//           Math.abs(prev.latitudeDelta - region.latitudeDelta) > prev.latitudeDelta * 0.2;

//         if (positionChanged || zoomChanged) {
//           lastRegionRef.current = region;
//           fetchAddresses(region);
//         }
//       }, 400);
//     },
//     [fetchAddresses],
//   );

//   const markers = useMemo(
//     () =>
//       addresses.map((addr) => (
//         <Marker
//           key={addr.id}
//           identifier={String(addr.id)}
//           coordinate={{
//             latitude: Number(addr.latitude),
//             longitude: Number(addr.longitude),
//           }}
//           // Indispensable pour éviter que Google Maps iOS passe son temps à redessiner les pins stables
//           tracksViewChanges={false}
//         >
//           <StaticMarkerImage />
//         </Marker>
//       )),
//     [addresses],
//   );

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={BELLECOUR_REGION}
//         onRegionChangeComplete={handleRegionChangeComplete}
//         rotateEnabled={false}
//         pitchEnabled={false}
//         preserveClusterPressBehavior={true}
//         tracksViewChanges={false}
//         removeClippedSubviews={false} // SURTOUT PAS à true sur iOS avec Google Maps
//         renderCluster={(cluster) => {
//           // Si tu veux customiser ou forcer le rafraîchissement des clusters natifs
//           const { id, pointCount, coordinate } = cluster;
//           return (
//             <Marker
//               key={`cluster-${id}`}
//               coordinate={coordinate}
//               identifier={`cluster-${id}`}
//               tracksViewChanges={false}
//             >
//               <View style={styles.clusterView}>
//                 <Text style={styles.clusterText}>{pointCount}</Text>
//               </View>
//             </Marker>
//           );
//         }}
//         // react-native-map-clustering gère le clustering automatiquement
//         clusterColor="#007AFF"
//         clusterTextColor="#ffffff"
//         radius={50}
//         extent={512}
//         animationEnabled={false} // évite les animations qui consomment de la mémoire
//       >
//         {markers}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { ...StyleSheet.absoluteFillObject },
//   clusterView: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   clusterText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
// });

import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ClusterMarker from '@/components/map/ClusterMarker';
import { getCluster } from '@/components/map/clustersUtils';
import { useSession } from '@/context/SessionContext';
import { apiFetch } from '@/utils/api';

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
});

const BELLECOUR_REGION = {
  latitude: 45.7578,
  longitude: 4.8321,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export default function MapScreen() {
  const [region, setRegion] = useState(BELLECOUR_REGION);

  const [addresses, setAddresses] = useState<any[]>([]); // <--- State pour stocker les adresses de l'API
  const { session } = useSession(); // À remplacer par ton vrai hook de session (ex: useSession())

  // Ta fonction de fetch adaptée
  const fetchAddresses = useCallback(
    async (currentRegion: typeof BELLECOUR_REGION) => {
      const min_lat = currentRegion.latitude - currentRegion.latitudeDelta / 2;
      const max_lat = currentRegion.latitude + currentRegion.latitudeDelta / 2;
      const min_lng = currentRegion.longitude - currentRegion.longitudeDelta / 2;
      const max_lng = currentRegion.longitude + currentRegion.longitudeDelta / 2;

      try {
        // Remplacer apiFetch par ta vraie fonction d'appel API
        const data = await apiFetch<any[]>(
          `/address/map?min_lat=${min_lat}&max_lat=${max_lat}&min_lng=${min_lng}&max_lng=${max_lng}`,
          { method: 'GET', token: session },
        );
        setAddresses(data ?? []);
      } catch (e) {
        console.error('Erreur lors de la récupération des adresses :', e);
      }
    },
    [session],
  );

  const handleRegionChangeComplete = (newRegion: typeof BELLECOUR_REGION) => {
    setRegion(newRegion); // Met à jour la région pour le supercluster
    fetchAddresses(newRegion); // Déclenche l'appel API pour la nouvelle zone
  };

  const renderMarker = (marker, index) => {
    const key = index + marker.geometry.coordinates[0];

    // If a cluster
    if (marker.properties) {
      return (
        <Marker
          key={key}
          coordinate={{
            latitude: marker.geometry.coordinates[1],
            longitude: marker.geometry.coordinates[0],
          }}
        >
          <ClusterMarker count={marker.properties.point_count} />
        </Marker>
      );
    }
    // If a single marker
    return (
      <Marker
        key={key}
        coordinate={{
          latitude: marker.geometry.coordinates[1],
          longitude: marker.geometry.coordinates[0],
        }}
      />
    );
  };

  const allCoords = addresses.map((c) => ({
    geometry: {
      coordinates: [c.longitude, c.latitude],
    },
  }));

  const cluster = getCluster(allCoords, region);

  return (
    <View style={Style.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={Style.map}
        loadingIndicatorColor={'#ffbbbb'}
        loadingBackgroundColor={'#ffbbbb'}
        // CORRECTION ICI : On utilise initialRegion au lieu de region
        initialRegion={BELLECOUR_REGION}
        // onRegionChangeComplete met à jour l'état pour recalculer supercluster,
        // mais ne force plus graphiquement la carte à bouger
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {cluster.markers.map((marker, index) => renderMarker(marker, index))}
      </MapView>
    </View>
  );
}
