import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { PlanningStatusTag, PlanningStatusTone } from '@koudmain/ui';
import { ApplicationStatus } from '@/types/planning';

const STATUS: Record<ApplicationStatus, { label: string; tone: PlanningStatusTone }> = {
  accepted: { label: 'Candidature acceptée', tone: 'success' },
  pending: { label: 'Candidature en attente', tone: 'secondary' },
};

export default function ApplicationStatusIcon({ status }: { status: ApplicationStatus }) {
  return (
    <PlanningStatusTag
      {...STATUS[status]}
      renderIcon={(color) =>
        status === 'accepted' ? (
          <Feather name="check" size={16} color={color} />
        ) : (
          <FontAwesome5 name="hourglass-half" size={12} color={color} />
        )
      }
    />
  );
}
