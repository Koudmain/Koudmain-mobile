import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSession } from '../../context/SessionContext';
import { useGetWorkerProfile } from '../../hooks/useGetWorkerProfile';
import ProfileLoadState from '../../components/profile/ProfileLoadState';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ReviewsSection from '../../components/profile/reviews/ReviewsSection';
import { WorkerProfileHeader } from '../../components/profile/worker/WorkerProfileHeader';
import { WorkerAboutTab } from '../../components/profile/worker/WorkerAboutTab';

type WorkerTab = 'about' | 'reviews';

interface WorkerProfileScreenProps {
  workerId: number | 'me';
  onEdit?: () => void;
  onReviewAuthorPress?: (companyId: number) => void;
}

export function WorkerProfileScreen({
  workerId,
  onEdit,
  onReviewAuthorPress,
}: WorkerProfileScreenProps) {
  const { session } = useSession();
  const [activeTab, setActiveTab] = useState<WorkerTab>('about');
  const { workerProfile, errorWorkerProfile, refetchWorkerProfile } = useGetWorkerProfile(
    session,
    workerId,
  );

  if (!workerProfile) {
    return <ProfileLoadState error={errorWorkerProfile} onRetry={refetchWorkerProfile} />;
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-primary"
      contentContainerClassName="pb-10"
      showsVerticalScrollIndicator={false}
    >
      <WorkerProfileHeader worker={workerProfile} onEdit={onEdit} />

      {!!errorWorkerProfile && (
        <TouchableOpacity
          onPress={refetchWorkerProfile}
          activeOpacity={0.8}
          className="mx-6 mt-4 p-3 rounded-lg border border-error"
        >
          <Text className="text-sm text-error">
            Le profil n&apos;a pas pu être actualisé. Touchez pour réessayer.
          </Text>
        </TouchableOpacity>
      )}

      <ProfileTabs
        tabs={[
          { key: 'about', label: 'À propos' },
          { key: 'reviews', label: `Avis (${workerProfile.rating.count})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mx-4 mt-6"
      />

      <View className="px-6">
        {activeTab === 'about' ? (
          <WorkerAboutTab worker={workerProfile} isOwnProfile={workerId === 'me'} />
        ) : (
          <ReviewsSection
            rating={workerProfile.rating}
            reviews={workerProfile.reviews}
            emptyMessage="Ce profil est récent et n'a pas encore reçu d'avis d'établissement."
            onAuthorPress={onReviewAuthorPress}
          />
        )}
      </View>
    </ScrollView>
  );
}
