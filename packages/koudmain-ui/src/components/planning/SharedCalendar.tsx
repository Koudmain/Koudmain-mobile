import React, { useCallback, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Dimensions, useColorScheme, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/theme';
import CustomDay from './CustomDay';
import '../../constants/calendarLocale';

const TITLE_AND_PADDING_HEIGHT = 110;
const ESTIMATED_HEADER_HEIGHT = 85;
const CALENDAR_PADDING = 32;

const { height: screenHeight } = Dimensions.get('window');

export function getNumberOfWeeks(year: number, month: number): number {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = firstOfMonth.getDay();
  const offset = (startDay - 1 + 7) % 7;
  return Math.ceil((offset + daysInMonth) / 7);
}

interface SharedCalendarProps {
  events: any[];
  renderPopUp: (props: {
    isVisible: boolean;
    onClose: () => void;
    selectedDate: string;
    events: any[];
  }) => React.ReactNode;
  formatDayEvents: (events: any[], dateString: string) => any[];
}

export default function SharedCalendar({
  events,
  renderPopUp,
  formatDayEvents,
}: SharedCalendarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selected, setSelected] = useState('');
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [weeksInMonth, setWeeksInMonth] = useState(() =>
    getNumberOfWeeks(today.getFullYear(), today.getMonth() + 1),
  );
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetEvents, setBottomSheetEvents] = useState<any[]>([]);

  const markedDatesList = Array.from(
    new Set(
      events
        .map((item) => {
          const date = item.starting_date;
          if (!date) return '';
          return date.split('T')[0];
        })
        .filter((d) => d !== ''),
    ),
  );

  const tabBarHeight = useBottomTabBarHeight();
  const calendarHeight = screenHeight - tabBarHeight - TITLE_AND_PADDING_HEIGHT;
  const availableHeightForCells = calendarHeight - ESTIMATED_HEADER_HEIGHT - CALENDAR_PADDING;
  const cellHeight = availableHeightForCells / weeksInMonth;

  const renderDay = useCallback(
    (props: any) => <CustomDay props={props} cellHeight={cellHeight} isDark={isDark} />,
    [cellHeight, isDark],
  );

  const handleMonthChange = (nextMonth: () => void, monthDelta: number) => {
    let newMonth = currentMonth + monthDelta;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setWeeksInMonth(getNumberOfWeeks(newYear, newMonth));
    nextMonth();
  };

  return (
    <View className="flex-1">
      <Calendar
        key={isDark ? 'dark' : 'light'}
        firstDay={1}
        style={{
          height: calendarHeight,
          borderRadius: 22,
          paddingVertical: 16,
          backgroundColor: isDark ? colors.background.dark : colors.background.light,
        }}
        theme={{
          calendarBackground: isDark ? colors.background.dark : colors.background.light,
          dayTextColor: isDark ? colors.typography.white : colors.typography.black,
          monthTextColor: isDark ? colors.typography.white : colors.typography.black,
          textSectionTitleColor: isDark ? colors.typography.white : colors.typography.black,
          textDayFontSize: 18,
          textMonthFontWeight: 'bold',
          todayTextColor: colors.secondary.DEFAULT,
          arrowColor: colors.secondary.DEFAULT,
          selectedDayBackgroundColor: colors.secondary.DEFAULT,
          selectedDayTextColor: colors.typography.white,
          'stylesheet.calendar.main': {
            week: {
              marginTop: 0,
              marginBottom: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
            dayContainer: { flex: 1, alignItems: 'center' },
          },
        }}
        enableSwipeMonths={true}
        onPressArrowLeft={(subtractMonth) => handleMonthChange(subtractMonth, -1)}
        onPressArrowRight={(addMonth) => handleMonthChange(addMonth, 1)}
        onMonthChange={(month) => {
          setWeeksInMonth(getNumberOfWeeks(month.year, month.month));
          setCurrentYear(month.year);
          setCurrentMonth(month.month);
        }}
        dayComponent={renderDay}
        onDayPress={(day) => {
          setSelected(day.dateString);
          setBottomSheetVisible(true);
          setBottomSheetEvents(
            markedDatesList.includes(day.dateString) ? formatDayEvents(events, day.dateString) : [],
          );
        }}
        markedDates={{
          ...markedDatesList.reduce(
            (acc, date) => ({
              ...acc,
              [date]: { marked: true, dotColor: colors.secondary.DEFAULT },
            }),
            {},
          ),
          ...(selected
            ? { [selected]: { selected: true, disableTouchEvent: false, dotColor: 'transparent' } }
            : {}),
        }}
      />

      {renderPopUp({
        isVisible: isBottomSheetVisible,
        onClose: () => {
          setBottomSheetVisible(false);
          setSelected('');
        },
        selectedDate: selected,
        events: bottomSheetEvents,
      })}
    </View>
  );
}
