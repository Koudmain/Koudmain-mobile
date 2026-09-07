import React from 'react';
import { View } from 'react-native';
import BasicDay, { BasicDayProps } from 'react-native-calendars/src/calendar/day/basic';
import { DateData } from 'react-native-calendars';
import { colors } from '../../constants/theme';

export interface CalendarDayProps extends Omit<BasicDayProps, 'date'> {
  date?: DateData;
}

interface CustomDayProps {
  props: CalendarDayProps;
  cellHeight: number;
  isDark: boolean;
}

export default function CustomDay({ props, cellHeight, isDark }: CustomDayProps) {
  const { ...rest } = props;

  if (!props.date) return null;

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
