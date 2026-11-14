import { View } from 'react-native';
import {
  PlanningCardBase,
  PlanningProfileRow,
  PlanningStatusTag,
  PlanningStatusTone,
} from '@koudmain/ui';
import { Text } from '@koudmain/ui/gluestack';
import { PlanningEvent, PlanningStatus } from '@/types/planning';

const STATUS_TAG: Record<PlanningStatus, { label: string; tone: PlanningStatusTone }> = {
  filled: { label: 'Pourvue', tone: 'success' },
  open: { label: 'À pourvoir', tone: 'secondary' },
  no_candidate: { label: 'Sans candidat', tone: 'muted' },
};

function ApplicationsSummary({ event }: { event: PlanningEvent }) {
  const hasPending = event.pending_applications > 0;
  const pluralSuffix = event.pending_applications > 1 ? 's' : '';

  return (
    <View className="mt-4">
      <View className="flex-row items-center">
        <View
          className={`w-1.5 h-1.5 rounded-full mr-2 ${
            hasPending ? 'bg-secondary' : 'border border-primary dark:border-primary-200'
          }`}
        />
        <Text className="text-base font-bold text-primary dark:text-primary-200">
          {hasPending
            ? `${event.pending_applications} candidature${pluralSuffix} en attente`
            : 'Aucune candidature'}
        </Text>
      </View>
      <Text className="text-2xs font-medium text-primary-400/60 mt-1">
        {hasPending ? 'Aucun worker validé pour le moment' : 'Personne n’est prévu sur ce créneau'}
      </Text>
    </View>
  );
}

interface PlanningAnnonceCardProps {
  event: PlanningEvent;
  onPress?: () => void;
  onWorkerPress?: () => void;
}

export default function PlanningAnnonceCard({
  event,
  onPress,
  onWorkerPress,
}: PlanningAnnonceCardProps) {
  const workerName = event.name ?? 'Travailleur';

  return (
    <PlanningCardBase
      title={event.title}
      wage={event.wage}
      start={event.time}
      end={event.end}
      onPress={onPress}
      accessibilityLabel={`Voir l’annonce ${event.title}`}
      headerRight={<PlanningStatusTag {...STATUS_TAG[event.status]} />}
    >
      {event.status === 'filled' ? (
        <View className="mt-4">
          <PlanningProfileRow
            name={workerName}
            imageUri={event.image_profile}
            rating={event.rate}
            ratingCount={event.number_rate}
            onPress={onWorkerPress}
            accessibilityLabel={`Voir le profil de ${workerName}`}
          />
        </View>
      ) : (
        <ApplicationsSummary event={event} />
      )}
    </PlanningCardBase>
  );
}
