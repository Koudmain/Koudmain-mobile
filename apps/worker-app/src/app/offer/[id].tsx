import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MOCK_OFFER_DATA } from '@/constants/fakeData';

// Components
import { OfferHeader } from '@/components/offer/OfferHeader';
import { OfferTitle } from '@/components/offer/OfferTitle';
import { OfferInfoList } from '@/components/offer/OfferInfoList';
import { OfferDescription } from '@/components/offer/OfferDescription';
import { OfferGallery } from '@/components/offer/OfferGallery';
import { OfferSkills } from '@/components/offer/OfferSkills';
import { OfferRequirements } from '@/components/offer/OfferRequirements';

export default function OfferDetailsPage() {
  const { id } = useLocalSearchParams();
  const numericId = Number(id);
  const offer = MOCK_OFFER_DATA[numericId] || MOCK_OFFER_DATA[0];

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <ScrollView
        className="flex-1 bg-white dark:bg-primary mb-6"
        bounces={true}
        showsVerticalScrollIndicator={false}
      >
        <OfferHeader
          title={offer.restaurantName || 'Restaurant'}
          imageSource={offer.bannerImage}
          logoSource={offer.logoImage}
        />

        <OfferTitle title={offer.title} isAvailable={offer.isAvailable} />

        <OfferInfoList items={offer.infoItems} />

        <OfferDescription description={offer.description} />

        <OfferGallery images={offer.gallery} />

        <OfferSkills skills={offer.skills} />

        <OfferRequirements requirements={offer.requirements} />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-8 bg-white dark:bg-primary">
        <Pressable
          className="w-full bg-[#D84A22] h-14 rounded-lg items-center justify-center flex-row"
          onPress={() => console.log('Postuler clicked')}
        >
          <Text className="text-white font-bold text-xl">Postuler</Text>
        </Pressable>
      </View>
    </View>
  );
}
