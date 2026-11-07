import React, { useState, useRef, useCallback } from 'react';
import { View, useColorScheme } from 'react-native';
import { mapService } from '@/api/map.api';
import { PublicationMap } from '@/types/publication';
import { useSession } from '@koudmain/ui/context/SessionContext';

import { MapFilterButton } from '@/components/map/filter/MapFilterButton';
import { FMapModal, defaultFMapModal } from '@/components/map/filter/FilterMapModal';
import { LeafletMapView, LeafletMapViewRef } from '@/components/map/LeafletMapView';

const BELLECOUR_REGION = {
  latitude: 45.7578,
  longitude: 4.8321,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export default function MapScreen() {
  const mapRef = useRef<LeafletMapViewRef>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [publications, setPublications] = useState<PublicationMap[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FMapModal>(defaultFMapModal);

  const { session } = useSession();

  const fetchAddresses = useCallback(
    async (boundaries: { minLat: number; maxLat: number; minLng: number; maxLng: number }) => {
      try {
        const data = await mapService.fetchPublicationsInBounds(
          session,
          boundaries.minLat,
          boundaries.maxLat,
          boundaries.minLng,
          boundaries.maxLng,
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

  const handleMarkerPress = (pub: PublicationMap) => {
    setSelectedId(pub.id);
    mapRef.current?.centerOnMarker(pub.latitude, pub.longitude);
  };

  return (
    <View className="flex-1">
      <LeafletMapView
        ref={mapRef}
        initialRegion={BELLECOUR_REGION}
        publications={publications}
        selectedId={selectedId}
        isDark={isDark}
        onRegionChangeComplete={fetchAddresses}
        onMarkerPress={handleMarkerPress}
      />
      <MapFilterButton filters={filters} setFilters={setFilters} isDark={isDark} />
    </View>
  );
}
