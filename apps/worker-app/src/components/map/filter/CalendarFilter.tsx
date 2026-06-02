import { Pressable, Text, View } from 'react-native';
import CalendarSelector from '@/components/utils/CalendarSelector';

export interface FCalendarSelector {
  startDate: string | null;
  endDate: string | null;
  active: boolean;
}

export const defaultFCalendarSelector: FCalendarSelector = {
  startDate: null,
  endDate: null,
  active: false,
};

interface CalendarFilterProps {
  calendar: FCalendarSelector;
  setCalendar: (calendar: FCalendarSelector) => void;
}

export default function CalendarFilter({ calendar, setCalendar }: CalendarFilterProps) {
  const handleRangeChange = (startDate: string | null, endDate: string | null) => {
    setCalendar({
      ...calendar,
      startDate,
      endDate,
      active: Boolean(startDate || endDate),
    });
  };

  const handleResetCalendar = () => {
    setCalendar({
      ...calendar,
      startDate: null,
      endDate: null,
      active: false,
    });
  };

  return (
    <View className="space-y-4">
      <CalendarSelector
        startDate={calendar.startDate}
        endDate={calendar.endDate}
        onRangeChange={handleRangeChange}
      />

      <Pressable
        onPress={handleResetCalendar}
        className="mt-4 self-center rounded-full px-4 py-2 bg-primary border-secondary border"
      >
        <Text className="text-sm font-semibold text-secondary">Réinitialiser la plage</Text>
      </Pressable>
    </View>
  );
}
