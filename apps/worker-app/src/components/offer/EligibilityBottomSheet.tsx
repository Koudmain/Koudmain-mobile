import React from 'react';
import { Animated, Modal, Pressable, Text, View, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  CheckEligibilityResponseDto,
  EligibilityReason,
  KycDocumentType,
} from '@/types/application';
import { colors } from '@/constants/theme';
import { useBottomSheetDrag } from '@/hooks/useBottomSheetDrag';

interface EligibilityBottomSheetProps {
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

export function EligibilityBottomSheet({
  visible,
  eligibility,
  errorMessage,
  onClose,
  onCompleteProfile,
}: EligibilityBottomSheetProps) {
  const isDark = useColorScheme() === 'dark';
  const { isMounted, translateY, backdropOpacity, panHandlers } = useBottomSheetDrag({
    visible,
    onClose,
  });

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

  const iconColor = isDark ? colors.primary.content : colors.primary.DEFAULT;
  const accentIconColor = isDark ? colors.secondary[400] : colors.secondary.DEFAULT;

  return (
    <Modal animationType="none" transparent visible={isMounted} onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        {/* Dimmed backdrop, tapping it closes the sheet */}
        <Animated.View
          className="absolute inset-0 bg-black/40"
          style={{ opacity: backdropOpacity }}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          className="px-5 pb-20 -mb-10 rounded-t-3xl border-t border-primary-100 dark:border-primary-700 bg-white dark:bg-primary"
          style={{ transform: [{ translateY }] }}
        >
          {/* Interactive drag handle area */}
          <View {...panHandlers} className="pt-3 pb-4 -mx-5 px-5 items-center">
            <View className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-primary-600" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-primary dark:text-primary-content">
              {isKycIncomplete ? 'Profil incomplet' : 'Candidature impossible'}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              className="w-9 h-9 rounded-full items-center justify-center bg-primary-50 dark:bg-primary-active"
            >
              <Feather name="x" size={20} color={iconColor} />
            </Pressable>
          </View>

          {isKycIncomplete ? (
            <>
              {/* Completion summary card */}
              <View className="rounded-2xl border border-primary-100 dark:border-primary-700 bg-white dark:bg-primary-active px-4 py-4 mb-5">
                <View className="flex-row items-center">
                  <View className="w-11 h-11 rounded-full bg-secondary-50 dark:bg-secondary-20 items-center justify-center mr-3">
                    <Feather name="alert-circle" size={22} color={accentIconColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-primary dark:text-primary-content">
                      Profil à{' '}
                      <Text className="text-secondary dark:text-secondary-400">{percentage} %</Text>{' '}
                      complété
                    </Text>
                    <Text className="text-sm text-primary-600 dark:text-primary-200 mt-0.5 leading-5">
                      Complétez vos documents pour pouvoir postuler à cette mission.
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View className="w-full h-2.5 bg-secondary-50 dark:bg-primary rounded-full mt-3.5 overflow-hidden">
                  <View
                    className="h-full bg-secondary dark:bg-secondary-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </View>
              </View>

              {/* Missing documents list */}
              <Text className="text-base font-bold text-primary dark:text-primary-content mb-2.5">
                Documents manquants
              </Text>
              <View className="gap-2 mb-6">
                {missingDocs.length > 0 ? (
                  missingDocs.map((doc) => (
                    <View
                      key={doc}
                      className="flex-row items-center rounded-xl border border-secondary-200 dark:border-secondary-400/50 bg-secondary-50/60 dark:bg-primary-active px-3.5 py-3"
                    >
                      <Feather name="file-text" size={16} color={accentIconColor} />
                      <Text className="flex-1 text-sm font-semibold text-primary dark:text-primary-content ml-2.5">
                        {KYC_DOCUMENT_LABELS[doc] ?? doc}
                      </Text>
                      <Text className="text-xs font-bold text-secondary dark:text-secondary-400">
                        Requis
                      </Text>
                    </View>
                  ))
                ) : (
                  <View className="flex-row items-center rounded-xl border border-secondary-200 dark:border-secondary-400/50 bg-secondary-50/60 dark:bg-primary-active px-3.5 py-3">
                    <Feather name="file-text" size={16} color={accentIconColor} />
                    <Text className="flex-1 text-sm font-semibold text-primary dark:text-primary-content ml-2.5">
                      Documents requis non validés
                    </Text>
                  </View>
                )}
              </View>

              {/* TODO: Once the dedicated administrative documents upload screen is ready,
                  redirect there instead of the profile edit page. */}
              <Pressable
                onPress={onCompleteProfile}
                className="w-full h-14 rounded-2xl bg-secondary active:bg-secondary-active flex-row items-center justify-center"
              >
                <Text className="text-secondary-content font-bold text-lg mr-1.5">
                  Compléter mes documents
                </Text>
                <Feather name="chevron-right" size={20} color={colors.secondary.content} />
              </Pressable>
            </>
          ) : (
            <>
              <View className="rounded-2xl border border-primary-100 dark:border-primary-700 bg-white dark:bg-primary-active px-4 py-4 mb-6 flex-row items-center">
                <View className="w-11 h-11 rounded-full bg-secondary-50 dark:bg-secondary-20 items-center justify-center mr-3.5">
                  <Feather name="alert-circle" size={22} color={accentIconColor} />
                </View>
                <Text className="flex-1 text-base leading-6 text-primary dark:text-primary-50">
                  {displayErrorMessage}
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                className="w-full h-14 rounded-2xl bg-secondary active:bg-secondary-active items-center justify-center"
              >
                <Text className="text-secondary-content font-bold text-lg">Compris</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
