import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { DynamicMarker } from '@/svg/DynamicMarker';
import ListPublication from '@/components/map/ListPublication';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 10;

interface Publication {
  id: string;
  title: string;
  lat: number;
  lng: number;
  description: string;
  jobCount: number;
}

const BELLECOUR_REGION = {
  latitude: 45.7578,
  longitude: 4.8321,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

const generateFakeData = (): Publication[] => {
  const names = ['Bouchon', 'Bistro', 'Brasserie', 'Café', 'Resto', "L'Atelier", 'Chez'];
  const suffixes = ['des Gones', 'du Rhône', 'de Lyon', 'Bellecour', 'Lumière', 'Vieux Lyon'];

  return Array.from({ length: 20 }).map((_, i) => {
    const randomLat = 45.7578 + (Math.random() - 0.5) * 0.012;
    const randomLng = 4.8321 + (Math.random() - 0.5) * 0.012;
    const randomCount = Math.floor(Math.random() * 8) + 1;

    return {
      id: String(i + 1),
      title: `${names[i % names.length]} ${suffixes[i % suffixes.length]} #${i + 1}`,
      lat: randomLat,
      lng: randomLng,
      description: `Besoin de ${randomCount} personne(s) pour un service.`,
      jobCount: randomCount,
    };
  });
};

const FAKE_PUBLICATIONS = generateFakeData();

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);
  const [selectedId, setSelectedId] = useState<string | null>(FAKE_PUBLICATIONS[0].id);

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
    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
    const pub = FAKE_PUBLICATIONS[index];
    if (pub && pub.id !== selectedId) {
      setSelectedId(pub.id);
      centerMapOnMarker(pub.lat, pub.lng);
    }
  };

  const handleMarkerPress = (pub: Publication, index: number) => {
    setSelectedId(pub.id);
    centerMapOnMarker(pub.lat, pub.lng);
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
      >
        {FAKE_PUBLICATIONS.map((pub, index) => (
          <Marker
            key={pub.id}
            coordinate={{ latitude: pub.lat, longitude: pub.lng }}
            onPress={() => handleMarkerPress(pub, index)}
            tracksViewChanges={false}
          >
            <DynamicMarker
              multiple={pub.jobCount > 1}
              isSelected={selectedId === pub.id}
              width={40}
              height={40}
            />
          </Marker>
        ))}
      </MapView>

      <ListPublication
        flatListRef={flatListRef}
        publications={FAKE_PUBLICATIONS}
        selectedId={selectedId}
        cardWidth={CARD_WIDTH}
        spacing={SPACING}
        onScroll={onScroll}
        className="absolute bottom-[70]"
      />
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
