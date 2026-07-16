import React from 'react';
import { View } from 'react-native';
import BasicDay from 'react-native-calendars/src/calendar/day/basic';
import { DateData } from 'react-native-calendars';
import { colors } from '../../constants/theme';

export interface CalendarDayProps {
  date: DateData;
  state?: 'selected' | 'disabled' | 'today' | '';
  marking?: {
    selected?: boolean;
    marked?: boolean;
    disabled?: boolean;
    disableTouchEvent?: boolean;
    textColor?: string;
    dotColor?: string;
    color?: string;
  };
  theme?: Record<string, unknown>;
  onPress?: (date?: DateData) => void;
  onLongPress?: (date?: DateData) => void;
}

interface CustomDayProps {
  props: CalendarDayProps;
  cellHeight: number;
  isDark: boolean;
}

export default function CustomDay({ props, cellHeight, isDark }: CustomDayProps) {
  const { ...rest } = props;

  const dateObj = new Date(props.date.dateString);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

  return (
    <View
      className={`w-full ${isWeekend ? 'bg-background-50' : 'bg-background-light dark:bg-background-dark'} justify-center items-center`}
      style={{ height: cellHeight }}
    >
      <BasicDay
        {...rest}
        date={props.date.dateString}
        state={props.state ?? ''}
        marking={props.marking ?? {}}
        onPress={props.onPress ?? (() => {})}
        onLongPress={props.onLongPress ?? (() => {})}
        theme={{
          ...rest.theme,
          dayTextColor: isDark ? colors.typography.white : colors.typography.black,
          textDisabledColor: isDark ? colors.typography.darkGray : colors.typography.gray,
        }}
      />
    </View>
  );
}
