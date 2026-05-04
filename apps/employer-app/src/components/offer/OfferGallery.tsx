import React from 'react';
import { View, ScrollView, Image } from 'react-native';

interface OfferGalleryProps {
  images: any[];
}

export function OfferGallery({ images }: OfferGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <View className="mb-8">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-6 gap-4"
      >
        {images.map((img, index) => (
          <Image key={index} source={img} className="w-32 h-32" resizeMode="cover" />
        ))}
      </ScrollView>
    </View>
  );
}
