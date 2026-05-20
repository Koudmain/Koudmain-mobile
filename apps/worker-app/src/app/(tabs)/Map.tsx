import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { DynamicMarker } from '@/svg/DynamicMarker';
import { useSession } from '@/context/SessionContext';
import { apiFetch } from '@/utils/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 10;

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

  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchAddresses = useCallback(
    async (currentRegion: Region) => {
      const min_lat = currentRegion.latitude - currentRegion.latitudeDelta / 2;
      const max_lat = currentRegion.latitude + currentRegion.latitudeDelta / 2;
      const min_lng = currentRegion.longitude - currentRegion.longitudeDelta / 2;
      const max_lng = currentRegion.longitude + currentRegion.longitudeDelta / 2;

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
    fetchAddresses(BELLECOUR_REGION);
  }, [fetchAddresses]);

  const handleRegionChangeComplete = (region: Region) => {
    fetchAddresses(region);
  };

  const centerMapOnMarker = (lat: number, lng: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      600,
    );
  };

  const onScroll = (event: any) => {
    if (publications.length === 0) return;

    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
    const pub = publications[index];
    if (pub && pub.id !== selectedId) {
      setSelectedId(pub.id);
      centerMapOnMarker(pub.latitude, pub.longitude);
    }
  };

  const handleMarkerPress = (pub: Publication, index: number) => {
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
        style={styles.map}
        initialRegion={BELLECOUR_REGION}
        showsPointsOfInterest={false}
        onRegionChangeComplete={handleRegionChangeComplete} // Déclenche l'API au mouvement
      >
        {publications.map((pub, index) => (
          <Marker
            key={pub.id}
            coordinate={{ latitude: pub.latitude, longitude: pub.longitude }}
            onPress={() => handleMarkerPress(pub, index)}
            tracksViewChanges={false}
          >
            <DynamicMarker
              multiple={false}
              isSelected={selectedId === pub.id}
              width={40}
              height={40}
            />
          </Marker>
        ))}
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
