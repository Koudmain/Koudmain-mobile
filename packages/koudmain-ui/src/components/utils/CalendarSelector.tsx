import React from 'react';
import { colors } from '../../constants/theme';
import { View, useColorScheme } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

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
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

interface CalendarSelectorProps {
  startDate: string | null;
  endDate: string | null;
  onRangeChange: (startDate: string | null, endDate: string | null) => void;
}

/**
 * Un composant de sélecteur de calendrier qui permet à l'utilisateur de sélectionner une plage de dates
 * @param startDate La date de début sélectionnée (format 'YYYY-MM-DD' ou null si aucune date sélectionnée)
 * @param endDate La date de fin sélectionnée (format 'YYYY-MM-DD' ou null si aucune date sélectionnée)
 * @param onRangeChange Une fonction de rappel qui est appelée lorsque la plage de dates change, avec les nouvelles dates de début et de fin en paramètres
 * @returns Un composant CalendarSelector qui affiche un calendrier et permet de sélectionner une plage de dates, avec des styles adaptés au thème sombre ou clair
 */
export default function CalendarSelector({
  startDate,
  endDate,
  onRangeChange,
}: CalendarSelectorProps) {
  const today = new Date().toISOString().split('T')[0];

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleDayPress = (day: { dateString: string }) => {
    const dateString = day.dateString;

    if (!startDate || (startDate && endDate)) {
      onRangeChange(dateString, null);
    } else if (startDate && !endDate) {
      if (dateString < startDate) {
        onRangeChange(dateString, null);
      } else {
        onRangeChange(startDate, dateString);
      }
    }
  };

  interface CalendarMarking {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  }

  const getMarkedDates = () => {
    const marked: Record<string, CalendarMarking> = {};

    if (startDate) {
      marked[startDate] = {
        startingDay: true,
        color: colors.secondary.DEFAULT,
        textColor: 'white',
      };
    }

    if (endDate) {
      marked[endDate] = {
        endingDay: true,
        color: colors.secondary.DEFAULT,
        textColor: 'white',
      };

      const start = new Date(startDate!);
      const end = new Date(endDate);

      while (start < end) {
        start.setDate(start.getDate() + 1);
        const year = start.getFullYear();
        const month = String(start.getMonth() + 1).padStart(2, '0');
        const day = String(start.getDate()).padStart(2, '0');
        const currentString = `${year}-${month}-${day}`;

        if (currentString !== endDate) {
          marked[currentString] = {
            color: isDark ? colors.secondary[300] : colors.secondary[50],
            textColor: isDark ? colors.primary.content : colors.secondary.DEFAULT,
          };
        }
      }
    }

    return marked;
  };

  return (
    <View className="space-y-6">
      <View className="border border-gray-200 rounded-[20] overflow-hidden bg-white shadow-lg">
        <Calendar
          markingType={'period'}
          markedDates={getMarkedDates()}
          onDayPress={handleDayPress}
          minDate={today}
          theme={{
            calendarBackground: isDark ? colors.primary.DEFAULT : colors.white,
            textSectionTitleColor: colors.neutral[400],
            todayTextColor: colors.secondary.DEFAULT,
            dayTextColor: isDark ? colors.neutral[400] : colors.neutral[700],
            arrowColor: colors.secondary.DEFAULT,
            monthTextColor: isDark ? colors.neutral[400] : colors.neutral[700],
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
          }}
        />
      </View>
    </View>
  );
}
