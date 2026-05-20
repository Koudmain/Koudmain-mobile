import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, useColorScheme, Image } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { DynamicMarker } from '@/svg/DynamicMarker';
import { useSession } from '@/context/SessionContext';
import { apiFetch } from '@/utils/api';
import { darkMapStyle, lightMapStyle } from '@/constants/styleMap';

import markerLight from '@/assets/images/map/pin_black.png';
import markerDark from '@/assets/images/map/pin_white.png';
import markerSelected from '@/assets/images/map/pin_green.png';

interface Publication {
  id: number;
  latitude: number;
  longitude: number;
}

const BELLECOUR_REGION = {
  latitude: 45.7578,
  longitude: 4.8321,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);
  const { session } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentMapStyle = isDark ? darkMapStyle : lightMapStyle;

  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tracksView, setTracksView] = useState(true);
  const isClickingMarkerRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAddresses = useCallback(
    async (options: {
      region?: Region;
      boundaries?: { min_lat: number; max_lat: number; min_lng: number; max_lng: number };
    }) => {
      let min_lat, max_lat, min_lng, max_lng;

      if (options.boundaries) {
        ({ min_lat, max_lat, min_lng, max_lng } = options.boundaries);
      } else if (options.region) {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = options.region;
        min_lat = latitude - latitudeDelta / 2;
        max_lat = latitude + latitudeDelta / 2;
        min_lng = longitude - longitudeDelta / 2;
        max_lng = longitude + longitudeDelta / 2;
      } else {
        return;
      }

      try {
        const data = await apiFetch<Publication[]>(
          `/address/map?min_lat=${min_lat}&max_lat=${max_lat}&min_lng=${min_lng}&max_lng=${max_lng}`,
          { method: 'GET', token: session },
        );

        const fetchedPubs = data ?? [];
        setPublications(fetchedPubs);

        if (fetchedPubs.length > 0 && !selectedId) {
          setSelectedId(fetchedPubs[0].id);
        }
      } catch (e) {
        console.error('Erreur lors de la récupération des adresses :', e);
      }
    },
    [session, selectedId],
  );

  useEffect(() => {
    fetchAddresses({ region: BELLECOUR_REGION });

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [fetchAddresses]);

  useEffect(() => {
    if (publications.length > 0) {
      setTracksView(true);

      const timer = setTimeout(() => {
        setTracksView(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [publications]);

  const handleRegionChangeComplete = async (region: Region) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (isClickingMarkerRef.current) {
      isClickingMarkerRef.current = false;
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (!mapRef.current) return;

      try {
        const boundaries = await mapRef.current.getMapBoundaries();

        const min_lat = boundaries.southWest.latitude;
        const max_lat = boundaries.northEast.latitude;
        const min_lng = boundaries.southWest.longitude;
        const max_lng = boundaries.northEast.longitude;

        await fetchAddresses({ boundaries: { min_lat, max_lat, min_lng, max_lng } });
      } catch (error) {
        console.error('Impossible de récupérer les limites de la carte :', error);
      }
    }, 800);
  };

  const centerMapOnMarker = async (lat: number, lng: number) => {
    if (!mapRef.current) return;

    try {
      const boundaries = await mapRef.current.getMapBoundaries();

      const currentLatDelta = Math.abs(
        boundaries.northEast.latitude - boundaries.southWest.latitude,
      );
      const currentLngDelta = Math.abs(
        boundaries.northEast.longitude - boundaries.southWest.longitude,
      );

      const IDEAL_DELTA = 0.005;

      const finalLatDelta = currentLatDelta < IDEAL_DELTA ? currentLatDelta : IDEAL_DELTA;
      const finalLngDelta = currentLngDelta < IDEAL_DELTA ? currentLngDelta : IDEAL_DELTA;

      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: finalLatDelta,
          longitudeDelta: finalLngDelta,
        },
        350,
      );
    } catch (error) {
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        350,
      );
    }
  };

  const handleMarkerPress = (pub: Publication, index: number) => {
    isClickingMarkerRef.current = true;

    setSelectedId(pub.id);
    centerMapOnMarker(pub.latitude, pub.longitude);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={BELLECOUR_REGION}
        showsPointsOfInterest={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        customMapStyle={currentMapStyle}
      >
        {publications.map((pub, index) => {
          const isSelected = selectedId === pub.id;

          let markerImage = isDark ? markerDark : markerLight;
          if (isSelected) {
            markerImage = markerSelected;
          }
          return (
            <Marker
              key={pub.id}
              coordinate={{ latitude: pub.latitude, longitude: pub.longitude }}
              onPress={() => handleMarkerPress(pub, index)}
            >
              <Image source={markerImage} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
600;
