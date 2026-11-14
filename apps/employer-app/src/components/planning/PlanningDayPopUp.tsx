import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { formatDayLabel, PlanningDaySheet } from '@koudmain/ui';
import { Heading, Text } from '@koudmain/ui/gluestack';
import { colors } from '@/constants/theme';
import { PlanningEvent } from '@/types/planning';
import PlanningAnnonceCard from './PlanningAnnonceCard';

interface PlanningDayPopUpProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: string;
  events: PlanningEvent[];
  onAnnoncePress?: (event: PlanningEvent) => void;
  onWorkerPress?: (event: PlanningEvent) => void;
}

const buildSubtitle = (events: PlanningEvent[]) => {
  if (events.length === 0) return undefined;
  const withoutWorker = events.filter((event) => event.status !== 'filled').length;
  const annonces = `${events.length} annonce${events.length > 1 ? 's' : ''}`;
  return `${annonces} · ${withoutWorker} sans worker`;
};

export default function PlanningDayPopUp({
  isVisible,
  onClose,
  selectedDate,
  events,
  onAnnoncePress,
  onWorkerPress,
}: PlanningDayPopUpProps) {
  const router = useRouter();

  const handlePublish = () => {
    onClose();
    router.push('/CreatePost');
  };

  return (
    <PlanningDaySheet<PlanningEvent>
      isVisible={isVisible}
      onClose={onClose}
      selectedDate={selectedDate}
      events={events}
      subtitle={buildSubtitle(events)}
      renderEmpty={() => (
        <View className="flex-1 items-center justify-center px-6 pb-10">
          <Feather name="calendar" size={48} color={colors.secondary.DEFAULT} />
          <Heading className="text-lg font-bold text-center text-primary dark:text-white mt-4">
            Aucune annonce ce jour
          </Heading>
          <Text className="text-2xs text-gray-500 dark:text-neutral-400 text-center mt-3">
            Personne n’est prévu le {formatDayLabel(selectedDate, { withYear: false })}.{'\n'}
            Publiez une annonce pour trouver un worker.
          </Text>
          <TouchableOpacity
            onPress={handlePublish}
            activeOpacity={0.85}
            className="w-full items-center bg-secondary rounded-lg py-2 mt-3"
          >
            <Text className="text-white text-lg font-semibold">Publier une annonce</Text>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(event, index) => `${event.id}-${event.starting_date}-${index}`}
      renderCard={(event) => (
        <PlanningAnnonceCard
          event={event}
          onPress={onAnnoncePress && (() => onAnnoncePress(event))}
          onWorkerPress={onWorkerPress && event.workerId ? () => onWorkerPress(event) : undefined}
        />
      )}
    />
  );
}
