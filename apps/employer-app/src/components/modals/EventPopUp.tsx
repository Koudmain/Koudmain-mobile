import { ScrollView } from 'react-native';
import { CalendarBottomSheet } from '@koudmain/ui';
import PlanningCard from '@/components/card/PlanningCard';
import { Shadow } from 'react-native-shadow-2';
import { colors } from '@/constants/theme';
import { PlanningEvent } from '@/types/planning';

interface EventPopUpProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: string;
  events: PlanningEvent[];
}

export default function EventPopUp({ isVisible, onClose, selectedDate, events }: EventPopUpProps) {
  return (
    <CalendarBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      selectedDate={selectedDate}
      events={events}
      renderContent={(items: PlanningEvent[], isDark: boolean) => (
        <ScrollView
          className="p-6 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {items.map((event, index) => (
            <Shadow
              key={`${event.id}-${event.starting_date}-${index}`}
              startColor={isDark ? '#FFFFFF10' : '#00000010'}
              style={{
                borderRadius: 22,
                width: '100%',
                marginBottom: 16,
                backgroundColor: isDark ? colors.background.dark : colors.background.light,
              }}
            >
              <PlanningCard
                id={event.id}
                name={event.name}
                image_profile={event.image_profile}
                rate={event.rate}
                number_rate={event.number_rate}
                title={event.title}
                wage={event.wage}
                begin={event.time}
                end={event.end}
              />
            </Shadow>
          ))}
        </ScrollView>
      )}
    />
  );
}
