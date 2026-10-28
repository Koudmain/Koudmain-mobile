import { Pressable, Text, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { differenceInMinutes, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CompetenceCard from '../../card/CompetenceCard';
import { ICompanyProfilePublication } from '../../../types/profile';
import { colors } from '../../../constants/theme';

interface CompanyMissionCardProps {
  publication: ICompanyProfilePublication;
  onPress?: () => void;
}

const formatHour = (date: Date) => format(date, "HH'h'mm");

export function CompanyMissionCard({ publication, onPress }: CompanyMissionCardProps) {
  const start = new Date(publication.starting_date);
  const end = new Date(publication.ending_date);
  const durationMinutes = differenceInMinutes(end, start);
  const duration = `${Math.floor(durationMinutes / 60)}h${
    durationMinutes % 60 ? String(durationMinutes % 60).padStart(2, '0') : ''
  }`;
  const date = format(start, 'EEE d MMMM yyyy', { locale: fr });

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="mt-6 p-5 rounded-[16] bg-white dark:bg-primary-700 shadow-md"
      style={{ elevation: 4 }}
    >
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 mr-3 text-xl font-bold text-primary dark:text-white">
          {publication.title}
        </Text>
        <Text className="text-lg font-bold text-secondary">
          {Number(publication.hourly_rate).toString().replace('.', ',')}€/h
        </Text>
      </View>

      <View className="flex-row items-center mt-3">
        <Feather name="calendar" size={16} color={colors.secondary.DEFAULT} />
        <Text className="ml-3 text-sm font-medium text-primary-600 dark:text-primary-300">
          {date.charAt(0).toUpperCase() + date.slice(1)}
        </Text>
      </View>
      <View className="flex-row items-center mt-2">
        <MaterialIcons name="schedule" size={16} color={colors.secondary.DEFAULT} />
        <Text className="ml-3 text-sm font-medium text-primary-600 dark:text-primary-300">
          {formatHour(start)} - {formatHour(end)} ({duration})
        </Text>
      </View>

      {publication.skills.length > 0 && (
        <View className="flex-row flex-wrap mt-3 -ml-1">
          {publication.skills.map((skill) => (
            <CompetenceCard key={skill.id} comp={skill.name} size="md" />
          ))}
        </View>
      )}
    </Pressable>
  );
}
