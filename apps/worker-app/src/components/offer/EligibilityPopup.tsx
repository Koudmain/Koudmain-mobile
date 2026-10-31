import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import {
  CheckEligibilityResponseDto,
  EligibilityReason,
  KycDocumentType,
} from '@/types/application';
import { colors } from '@/constants/theme';

interface AutoDismissTimerBarProps {
  durationMs?: number;
  onExpire: () => void;
}

export function AutoDismissTimerBar({ durationMs = 5000, onExpire }: AutoDismissTimerBarProps) {
  const progress = useSharedValue(0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(100, {
      duration: durationMs,
      easing: Easing.linear,
    });

    const timer = setTimeout(() => {
      onExpireRef.current();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-400/30 dark:bg-primary-600">
      <Animated.View style={barStyle} className="h-full bg-secondary" />
    </View>
  );
}

interface EligibilityPopupProps {
  visible: boolean;
  eligibility: CheckEligibilityResponseDto | null;
  errorMessage?: string | null;
  onClose: () => void;
  onCompleteProfile: () => void;
}

const KYC_DOCUMENT_LABELS: Record<KycDocumentType, string> = {
  IDENTITY: "Carte d'identité",
  RIB: 'RIB',
  PROOF_OF_ADDRESS: 'Justificatif de domicile',
  NIR: 'Carte Vitale (NIR)',
  DIPLOMA: 'Diplôme',
};

const REASON_FALLBACK_MESSAGES: Partial<Record<EligibilityReason, string>> = {
  ALREADY_APPLIED: 'Vous avez déjà postulé à cette offre.',
  OFFER_EXPIRED: 'Cette offre a expiré et ne prend plus de candidatures.',
  PUBLICATION_NOT_FOUND: 'Cette offre est introuvable.',
  WORKER_PROFILE_NOT_FOUND: 'Profil travailleur introuvable.',
  NOT_AUTHORIZED: "Vous n'êtes pas autorisé à postuler à cette offre.",
};

export function EligibilityPopup({
  visible,
  eligibility,
  errorMessage,
  onClose,
  onCompleteProfile,
}: EligibilityPopupProps) {
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.cubic) });
      opacity.value = withTiming(1, { duration: 250 });
    } else {
      translateY.value = withTiming(-120, { duration: 220 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const isKycIncomplete =
    eligibility?.reason === 'KYC_REQUIRED' ||
    (eligibility?.missingDocuments && eligibility.missingDocuments.length > 0);

  const percentage = Math.min(100, Math.max(0, eligibility?.completionPercentage ?? 0));
  const missingDocs = eligibility?.missingDocuments ?? [];

  const displayErrorMessage =
    errorMessage ||
    eligibility?.message ||
    (eligibility?.reason ? REASON_FALLBACK_MESSAGES[eligibility.reason] : null) ||
    'Impossible de postuler à cette offre pour le moment.';

  return (
    <View className="absolute inset-0 z-50" pointerEvents="box-none">
      {/* Transparent backdrop to dismiss the popup when tapping outside */}
      <Pressable className="absolute inset-0" onPress={onClose} />

      <Animated.View
        style={animatedStyle}
        className="mx-4 mt-4 bg-neutral-300 dark:bg-primary-hover rounded-[20] p-4 shadow-lg overflow-hidden"
      >
        {isKycIncomplete ? (
          <>
            <Text className="text-xl font-extrabold text-primary dark:text-primary-content">
              Profil à {percentage} % complété
            </Text>

            {/* Progress bar */}
            <View className="w-full h-2.5 bg-neutral-400/40 dark:bg-primary-600 rounded-full mt-2.5 mb-3 overflow-hidden">
              <View
                className="h-full bg-secondary rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </View>

            <View className="flex-row items-end justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm text-primary-700 dark:text-primary-200 mb-0.5">
                  Manque :
                </Text>
                {missingDocs.length > 0 ? (
                  missingDocs.map((doc) => (
                    <Text
                      key={doc}
                      className="text-sm text-primary-700 dark:text-primary-200 leading-5 pl-1"
                    >
                      • {KYC_DOCUMENT_LABELS[doc] ?? doc}
                    </Text>
                  ))
                ) : (
                  <Text className="text-sm text-primary-700 dark:text-primary-200 leading-5 pl-1">
                    • Documents requis non validés
                  </Text>
                )}
              </View>

              {/* TODO: Once the administrative section for uploading KYC documents is ready,
                  this button should redirect there instead of the general profile page. */}
              <Pressable
                onPress={onCompleteProfile}
                className="bg-secondary active:bg-secondary-active px-4 py-2 rounded-xl flex-row items-center"
              >
                <Text className="text-secondary-content font-bold text-sm mr-1">Compléter</Text>
                <Feather name="chevron-right" size={16} color={colors.secondary.content} />
              </Pressable>
            </View>
          </>
        ) : (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-lg font-extrabold text-primary dark:text-primary-content mb-1">
                Candidature impossible
              </Text>
              <Text className="text-sm text-primary-700 dark:text-primary-200 leading-5">
                {displayErrorMessage}
              </Text>
            </View>
          </View>
        )}

        {/* Comment out the line below to disable the auto-dismiss timer and bottom progress bar (e.g. for debugging) */}
        <AutoDismissTimerBar durationMs={5000} onExpire={onClose} />
      </Animated.View>
    </View>
  );
}
