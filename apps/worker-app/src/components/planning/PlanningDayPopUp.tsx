import { PlanningDaySheet } from '@koudmain/ui';
import { PlanningEvent } from '@/types/planning';
import PlanningMissionCard from './PlanningMissionCard';

interface PlanningDayPopUpProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: string;
  events: PlanningEvent[];
  onMissionPress?: (event: PlanningEvent) => void;
  onCompanyPress?: (event: PlanningEvent) => void;
}

const buildSubtitle = (events: PlanningEvent[]) =>
  events.length > 0 ? `${events.length} mission${events.length > 1 ? 's' : ''}` : undefined;

export default function PlanningDayPopUp({
  isVisible,
  onClose,
  selectedDate,
  events,
  onMissionPress,
  onCompanyPress,
}: PlanningDayPopUpProps) {
  return (
    <PlanningDaySheet<PlanningEvent>
      isVisible={isVisible}
      onClose={onClose}
      selectedDate={selectedDate}
      events={events}
      subtitle={buildSubtitle(events)}
      keyExtractor={(event, index) => `${event.id}-${event.starting_date}-${index}`}
      renderCard={(event) => (
        <PlanningMissionCard
          event={event}
          onPress={onMissionPress && (() => onMissionPress(event))}
          onCompanyPress={
            onCompanyPress && event.companyId ? () => onCompanyPress(event) : undefined
          }
        />
      )}
    />
  );
}
