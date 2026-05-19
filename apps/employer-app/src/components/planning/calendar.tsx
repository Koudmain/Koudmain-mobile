import React, { useCallback, useState } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { colors } from '@/constants/theme';
import { Dimensions, useColorScheme, View } from 'react-native';
import CustomDay from './CustomDay';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import EventPopUp from './EventPopUp';
import { useSession } from '@/context/SessionContext';
import { getNumberOfWeeks, formatDayEvents } from './calendarUtils';
import { useCalendarEvents } from './useCalendarEvents';

const TITLE_AND_PADDING_HEIGHT = 110;
const ESTIMATED_HEADER_HEIGHT = 85;
const CALENDAR_PADDING = 32;

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['D', 'L', 'M', 'ME', 'J', 'V', 'S'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

const { height: screenHeight } = Dimensions.get('window');

export default function CalendarComponent() {
  const { session, activeCompanyId } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selected, setSelected] = useState('');
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [weeksInMonth, setWeeksInMonth] = useState(() =>
    getNumberOfWeeks(currentYear, currentMonth),
  );
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetEvents, setBottomSheetEvents] = useState<any[]>([]);

  const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const { events } = useCalendarEvents(session, currentMonthStr, activeCompanyId);

  const markedDatesList = Array.from(
    new Set(
      events
        .map((item) => {
          if (!item.startingDate) return '';
          return item.startingDate.split('T')[0];
        })
        .filter((d) => d !== ''),
    ),
  );

  const tabBarHeight = useBottomTabBarHeight();
  const calendarHeight = screenHeight - tabBarHeight - TITLE_AND_PADDING_HEIGHT;
  const availableHeightForCells = calendarHeight - ESTIMATED_HEADER_HEIGHT - CALENDAR_PADDING;
  const cellHeight = availableHeightForCells / weeksInMonth;

  const renderDay = useCallback(
    (props: any) => {
      return <CustomDay props={props} cellHeight={cellHeight} isDark={isDark} />;
    },
    [cellHeight, isDark],
  );

  const setNextMonth = (nextMonth: () => void, monthDelta: number) => {
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
            dayContainer: {
              flex: 1,
              alignItems: 'center',
            },
          },
        }}
        enableSwipeMonths={true}
        onPressArrowLeft={(subtractMonth) => {
          setNextMonth(subtractMonth, -1);
        }}
        onPressArrowRight={(addMonth) => {
          setNextMonth(addMonth, 1);
        }}
        onMonthChange={(month) => {
          setWeeksInMonth(getNumberOfWeeks(month.year, month.month));
          setCurrentYear(month.year);
          setCurrentMonth(month.month);
        }}
        dayComponent={renderDay}
        onDayPress={(day) => {
          setSelected(day.dateString);
          setBottomSheetVisible(true);

          if (markedDatesList.includes(day.dateString)) {
            setBottomSheetEvents(formatDayEvents(events, day.dateString));
          } else {
            setBottomSheetEvents([]);
          }
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
            ? {
                [selected]: {
                  selected: true,
                  disableTouchEvent: false,
                  dotColor: 'transparent',
                },
              }
            : {}),
        }}
      />

      <EventPopUp
        isVisible={isBottomSheetVisible}
        onClose={() => {
          setBottomSheetVisible(false);
          setSelected('');
        }}
        selectedDate={selected}
        events={bottomSheetEvents}
      />
    </View>
  );
}
