import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSession } from '../../context/SessionContext';
import { useGetCompanyProfile } from '../../hooks/useGetCompanyProfile';
import ProfileEmptyMessage from '../../components/profile/ProfileEmptyMessage';
import ProfileLoadState from '../../components/profile/ProfileLoadState';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ReviewsSection from '../../components/profile/reviews/ReviewsSection';
import { CompanyProfileHeader } from '../../components/profile/company/CompanyProfileHeader';
import { CompanyAboutTab } from '../../components/profile/company/CompanyAboutTab';
import { CompanyMissionCard } from '../../components/profile/company/CompanyMissionCard';

type CompanyTab = 'about' | 'missions' | 'reviews';

const TABS: { key: CompanyTab; label: string }[] = [
  { key: 'about', label: 'À propos' },
  { key: 'missions', label: 'Missions' },
  { key: 'reviews', label: 'Avis' },
];

interface CompanyProfileScreenProps {
  companyId: number;
  onEdit?: () => void;
  onMissionPress?: (publicationId: number) => void;
  onReviewAuthorPress?: (workerId: number) => void;
}

export function CompanyProfileScreen({
  companyId,
  onEdit,
  onMissionPress,
  onReviewAuthorPress,
}: CompanyProfileScreenProps) {
  const { session } = useSession();
  const [activeTab, setActiveTab] = useState<CompanyTab>('about');
  const { companyProfile, errorCompanyProfile, refetchCompanyProfile } = useGetCompanyProfile(
    session,
    companyId,
  );

  if (!companyProfile) {
    return <ProfileLoadState error={errorCompanyProfile} onRetry={refetchCompanyProfile} />;
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-primary"
      contentContainerClassName="pb-10"
      showsVerticalScrollIndicator={false}
    >
      <CompanyProfileHeader company={companyProfile} onEdit={onEdit} />

      {!!errorCompanyProfile && (
        <TouchableOpacity
          onPress={refetchCompanyProfile}
          activeOpacity={0.8}
          className="mx-6 mt-4 p-3 rounded-lg border border-error"
        >
          <Text className="text-sm text-error">
            Le profil n&apos;a pas pu être actualisé. Touchez pour réessayer.
          </Text>
        </TouchableOpacity>
      )}

      <ProfileTabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mx-4 mt-6"
      />

      <View className="px-6">
        {activeTab === 'about' && <CompanyAboutTab company={companyProfile} />}

        {activeTab === 'missions' &&
          (companyProfile.openPublications.length > 0 ? (
            companyProfile.openPublications.map((publication) => (
              <CompanyMissionCard
                key={publication.id}
                publication={publication}
                onPress={onMissionPress && (() => onMissionPress(publication.id))}
              />
            ))
          ) : (
            <ProfileEmptyMessage
              className="mt-6"
              message="Cet établissement n'a aucune mission ouverte pour le moment."
            />
          ))}

        {activeTab === 'reviews' && (
          <ReviewsSection
            rating={companyProfile.rating}
            reviews={companyProfile.reviews}
            emptyMessage="Cet établissement n'a pas encore reçu d'avis de travailleurs."
            onAuthorPress={onReviewAuthorPress}
          />
        )}
      </View>
    </ScrollView>
  );
}
