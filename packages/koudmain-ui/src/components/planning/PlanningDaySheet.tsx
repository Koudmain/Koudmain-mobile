import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import CalendarBottomSheet from './CalendarBottomSheet';
import { colors } from '../../constants/theme';
import { formatDayLabel } from '../../utils/planningDate';

export interface PlanningDaySheetProps<TEvent> {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: string;
  events: TEvent[];
  renderCard: (event: TEvent) => ReactNode;
  keyExtractor: (event: TEvent, index: number) => string;
  subtitle?: string;
  renderEmpty?: () => ReactNode;
}

export default function PlanningDaySheet<TEvent>({
  isVisible,
  onClose,
  selectedDate,
  events,
  renderCard,
  keyExtractor,
  subtitle,
  renderEmpty,
}: PlanningDaySheetProps<TEvent>) {
  return (
    <CalendarBottomSheet<TEvent>
      isVisible={isVisible}
      onClose={onClose}
      selectedDate={selectedDate}
      events={events}
      title={formatDayLabel(selectedDate, { capitalizeMonth: true })}
      subtitle={subtitle}
      renderEmpty={renderEmpty}
      renderContent={(items, isDark) => (
        <ScrollView
          className="p-6 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {items.map((event, index) => (
            <Shadow
              key={keyExtractor(event, index)}
              startColor={isDark ? colors.shadow.dark : colors.shadow.light}
              style={{
                borderRadius: 22,
                width: '100%',
                marginBottom: 16,
                backgroundColor: isDark ? colors.background.dark : colors.background.light,
              }}
            >
              {renderCard(event)}
            </Shadow>
          ))}
        </ScrollView>
      )}
    />
  );
}
