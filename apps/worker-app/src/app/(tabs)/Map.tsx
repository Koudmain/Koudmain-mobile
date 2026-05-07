import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MapIcon } from '@/svg/MapIcon';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 10;

interface Publication {
  id: string;
  title: string;
  lat: number;
  lng: number;
  description: string;
}

const BELLECOUR_REGION = {
  latitude: 45.7578,
  longitude: 4.8321,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

const FAKE_PUBLICATIONS: Publication[] = [
  {
    id: '1',
    title: 'Le Petit Bouchon',
    lat: 45.7585,
    lng: 4.834,
    description: 'Extra en cuisine !',
  },
  {
    id: '2',
    title: 'Brasserie Bellecour',
    lat: 45.756,
    lng: 4.83,
    description: 'Cherche serveur.',
  },
  {
    id: '3',
    title: 'Café des Artistes',
    lat: 45.76,
    lng: 4.828,
    description: 'Aide cuisine 12h-15h.',
  },
  { id: '4', title: 'L’Atelier du Quai', lat: 45.755, lng: 4.835, description: 'Plongeur urgent.' },
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={BELLECOUR_REGION}>
        {FAKE_PUBLICATIONS.map((pub) => (
          <Marker
            key={pub.id}
            coordinate={{ latitude: pub.lat, longitude: pub.lng }}
            onPress={() => {
              setSelectedId(pub.id);
              centerMapOnMarker(pub.lat, pub.lng);
            }}
            tracksViewChanges={false}
          >
            <MapIcon
              width={40}
              height={40}
              pinStrokeColor={selectedId === pub.id ? '#2ecc71' : '#FF5A5F'}
              mapStrokeColor="#333"
            />
          </Marker>
        ))}
      </MapView>

      <FlatList
        data={FAKE_PUBLICATIONS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        onMomentumScrollEnd={onScroll}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.card,
              selectedId === item.id && { borderColor: '#2ecc71', borderWidth: 2 },
            ]}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        )}
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
  list: {
    position: 'absolute',
    bottom: 100,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: SPACING,
    // Ombre iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Ombre Android
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#666',
  },
});
