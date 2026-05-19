import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const customMarkerImage = require('@/assets/images/google_maps_pin.png');

interface MapMarkerProps {
  addr: {
    id: number | string;
    latitude: number | string;
    longitude: number | string;
  };
}

function MapMarker({ addr }: MapMarkerProps) {
  const [trackChanges, setTrackChanges] = useState(true);

  useEffect(() => {
    // On laisse le marqueur se dessiner pendant 200ms, puis on fige son rendu
    const timer = setTimeout(() => {
      setTrackChanges(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      identifier={String(addr.id)}
      coordinate={{
        latitude: Number(addr.latitude),
        longitude: Number(addr.longitude),
      }}
      // tracksViewChanges={false} est vital, mais parfois buggé si l'image est chargée via la prop image.
      // Avec un enfant <Image>, il fonctionne à 100%.
      tracksViewChanges={trackChanges}
    >
      <Image source={customMarkerImage} style={styles.markerImage} resizeMode="contain" />
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerImage: {
    width: 32, // Ajuste selon la taille de ton image
    height: 32, // Ajuste selon la taille de ton image
  },
});

export default MapMarker;
