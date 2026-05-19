import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { View, Pressable, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from '@/constants/theme';

type PlanningCardProps = {
  id: number;
  name: string | null;
  image_profile: any;
  rate: number;
  number_rate: number;
  title: string;
  wage: number;
  begin: string;
  end: string;
};

export default function PlanningCard({
  name,
  image_profile,
  rate,
  number_rate,
  title,
  wage,
  begin,
  end,
}: PlanningCardProps) {
  return (
    <Pressable>
      <Card className="w-full pt-4 px-4 rounded-[20] bg-background-light dark:bg-background-dark">
        <View className="flex-row items-center flex-1 mr-3">
          {image_profile ? (
            <Image source={{ uri: image_profile }} className="w-14 h-14 rounded-full mr-3" />
          ) : (
            <View className="w-14 h-14 rounded-full mr-3 bg-gray-300 items-center justify-center">
              <FontAwesome5 name="user" size={30} color={colors.typography.white} />
            </View>
          )}
          <View className="flex-1">
            <Heading
              className="text-base font-bold text-typography-black dark:text-typography-white"
              numberOfLines={1}
            >
              {name ?? 'Travailleur'}
            </Heading>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="star" size={18} color={colors.secondary.DEFAULT} />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {rate} ({number_rate})
              </Text>
            </View>
          </View>
        </View>

        <Heading
          className="text-3xl font-bold flex-1 mr-2 mt-4 mb-3 text-typography-black dark:text-typography-white"
          numberOfLines={1}
        >
          {title}
        </Heading>

        <View className="flex-row items-center mt-2 mb-2">
          <FontAwesome6 name="money-bill-1-wave" size={24} color={colors.primary.disabled} />
          <Text className="text-md ml-3 text-gray-500 dark:text-gray-400">{wage}€ /h</Text>
        </View>

        <View className="flex-row items-center mt-2 mb-2">
          <MaterialCommunityIcons name="clock" size={24} color={colors.secondary.DEFAULT} />
          <Text className="text-md ml-3 text-gray-500 dark:text-gray-400">
            {begin} - {end}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
