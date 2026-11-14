import { PlanningCardBase, PlanningProfileRow } from '@koudmain/ui';
import { PlanningEvent } from '@/types/planning';
import ApplicationStatusIcon from './ApplicationStatusIcon';

interface PlanningMissionCardProps {
  event: PlanningEvent;
  onPress?: () => void;
  onCompanyPress?: () => void;
}

export default function PlanningMissionCard({
  event,
  onPress,
  onCompanyPress,
}: PlanningMissionCardProps) {
  return (
    <PlanningCardBase
      title={event.title}
      wage={event.wage}
      start={event.time}
      end={event.end}
      onPress={onPress}
      accessibilityLabel={`Voir l’offre ${event.title}`}
      header={
        <PlanningProfileRow
          name={event.name}
          imageUri={event.image_profile}
          rating={event.rate}
          ratingCount={event.number_rate}
          fallbackIcon="store"
          caption={`${event.city} (${event.zip})`}
          onPress={onCompanyPress}
          accessibilityLabel={`Voir le profil de ${event.name}`}
          right={<ApplicationStatusIcon status={event.status} />}
        />
      }
    />
  );
}
