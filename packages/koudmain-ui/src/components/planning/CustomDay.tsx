import React from 'react';
import { Pressable, View } from 'react-native';
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

  const date = props.date;
  const dateObj = new Date(date.dateString);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
  const touchDisabled = props.marking?.disableTouchEvent === true;

  return (
    <Pressable
      className={`w-full ${isWeekend ? 'bg-background-50' : 'bg-background-light dark:bg-primary'} justify-center items-center`}
      style={{ height: cellHeight }}
      disabled={touchDisabled}
      onPress={() => props.onPress?.(date)}
      onLongPress={() => props.onLongPress?.(date)}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
    >
      <View pointerEvents="none">
        <BasicDay
          {...rest}
          date={props.date.dateString}
          state={props.state ?? ''}
          marking={props.marking ?? {}}
          onPress={props.onPress ?? (() => {})}
          onLongPress={props.onLongPress ?? (() => {})}
          theme={{
            ...rest.theme,
            dayTextColor: isDark ? colors.primary[200] : colors.typography.black,
            textDisabledColor: isDark ? colors.typography.darkGray : colors.typography.gray,
          }}
        />
      </View>
    </Pressable>
  );
}
