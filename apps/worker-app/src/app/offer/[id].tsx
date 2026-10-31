import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '@/constants/theme';
import { useGetPublicationById } from '@/hooks/useGetPublicationById';
import { useCheckEligibility } from '@/hooks/useCheckEligibility';
import { mapPublicationToOfferDetail } from '@/utils/offerMapper';

// Components
import { OfferHeader } from '@/components/offer/OfferHeader';
import { OfferTitle } from '@/components/offer/OfferTitle';
import { OfferInfoList } from '@/components/offer/OfferInfoList';
import { OfferDescription } from '@/components/offer/OfferDescription';
import { OfferGallery } from '@/components/offer/OfferGallery';
import { OfferSkills } from '@/components/offer/OfferSkills';
import { OfferRequirements } from '@/components/offer/OfferRequirements';
import { EligibilityPopup } from '@/components/offer/EligibilityPopup';

export default function OfferDetailsPage() {
  const { id } = useLocalSearchParams();
  const numericId = Number(id);
  const { fetchPublication, publication, isLoadingPublication, errorPublication } =
    useGetPublicationById();
  const { checkEligibility, eligibility, isCheckingEligibility, errorEligibility } =
    useCheckEligibility();
  const [showEligibilityPopup, setShowEligibilityPopup] = useState(false);

  useEffect(() => {
    if (Number.isFinite(numericId)) {
      void fetchPublication(numericId);
    }
  }, [numericId, fetchPublication]);

  const offer = useMemo(
    () => (publication ? mapPublicationToOfferDetail(publication) : null),
    [publication],
  );

  if (isLoadingPublication && !offer) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-primary">
        <ActivityIndicator color={colors.secondary.DEFAULT} size="large" />
      </View>
    );
  }

  if ((errorPublication || !offer) && !isLoadingPublication) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-primary px-6">
        <Text className="text-base text-gray-500 dark:text-white/80 text-center mb-4">
          {errorPublication || 'Impossible de charger les détails de cette offre.'}
        </Text>
        <Pressable className="bg-secondary px-6 py-3 rounded-xl" onPress={() => router.back()}>
          <Text className="text-secondary-content font-bold">Retour</Text>
        </Pressable>
      </View>
    );
  }

  if (!offer) return null;

  const handleApplyPress = async () => {
    if (!offer.isAvailable || isCheckingEligibility) return;
    const result = await checkEligibility(offer.id);
    if (!result || !result.canApply) {
      setShowEligibilityPopup(true);
      return;
    }
    // TODO: Open application message bottom sheet when canApply === true
  };

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <EligibilityPopup
        visible={showEligibilityPopup}
        eligibility={eligibility}
        errorMessage={errorEligibility}
        onClose={() => setShowEligibilityPopup(false)}
        onCompleteProfile={() => {
          setShowEligibilityPopup(false);
          // TODO: Redirect to the administrative documents section instead of the profile page once it is ready
          router.push('/my-profile');
        }}
      />

      <ScrollView
        className="flex-1 bg-white dark:bg-primary mb-6"
        bounces={true}
        showsVerticalScrollIndicator={false}
      >
        <OfferHeader
          title={offer.restaurantName}
          imageSource={offer.bannerImage}
          logoSource={offer.logoImage}
          companyId={offer.companyId}
        />

        <OfferTitle title={offer.title} status={offer.status} isAvailable={offer.isAvailable} />

        <OfferInfoList items={offer.infoItems} />

        <OfferDescription description={offer.description} />

        {/* TODO: Add database support for mission gallery images so they can be uploaded and displayed here */}
        <OfferGallery images={offer.gallery} />

        <OfferSkills skills={offer.skills} />

        <OfferRequirements requirements={offer.requirements} />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-10 bg-white dark:bg-primary">
        <Pressable
          disabled={!offer.isAvailable || isCheckingEligibility}
          className={`w-full h-12 rounded-xl items-center justify-center flex-row ${
            offer.isAvailable ? 'bg-secondary active:bg-secondary-active' : 'bg-secondary-disabled'
          }`}
          onPress={handleApplyPress}
        >
          {isCheckingEligibility ? (
            <ActivityIndicator color={colors.secondary.content} size="small" />
          ) : (
            <Text className="text-secondary-content font-bold text-xl">Postuler</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
