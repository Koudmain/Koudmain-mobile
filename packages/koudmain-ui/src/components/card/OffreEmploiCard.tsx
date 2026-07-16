import { Card, Heading, Text } from '../ui';
import {
  Image,
  ScrollView,
  View,
  Pressable,
  useColorScheme,
  ImageSourcePropType,
} from 'react-native';
import CompetenceCard from './CompetenceCard';

import { LinearGradient } from 'expo-linear-gradient';

import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../constants/theme';
import { router } from 'expo-router';

type OffreEmploiCardProps = {
  id: number;
  name: string;
  imageProfile: ImageSourcePropType;
  city: string;
  zip: string;
  rate: number;
  numberRate: number;
  title: string;
  wage: number;
  date: string;
  begin: string;
  duration: string;
  competence: string[];
  wishlist: boolean;
};

export default function OffreEmploiCard({
  id,
  name,
  imageProfile,
  city,
  zip,
  rate,
  numberRate,
  title,
  wage,
  date,
  begin,
  duration,
  competence,
  wishlist,
}: OffreEmploiCardProps) {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  return (
    <Card className="w-full p-0 pt-4 pb-2 rounded-[20] mb-4 dark:bg-primary">
      <View className="flex-row px-4 justify-between items-start">
        <View className="flex-row items-center flex-1 mr-3">
          <Image source={imageProfile} className="w-14 h-14 rounded-full mr-3" />
          <View className="flex-1">
            <Heading className="text-base font-bold">{name}</Heading>
            <View className="flex-row items-center mt-1">
              <Text className="text-xs text-gray-500 dark:text-white/80">
                {city} - {zip}
              </Text>
              <View className="flex-row items-center ml-4">
                <MaterialIcons name="star" size={18} color={colors.secondary.DEFAULT} />
                <Text className="text-xs text-gray-500 dark:text-white/80 ml-1">
                  {rate} ({numberRate})
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className={`w-8 h-8 rounded-full items-center justify-center`}>
          <MaterialIcons
            name={wishlist ? 'favorite' : 'favorite-border'}
            size={24}
            color={wishlist ? colors.utils.heart : colors.primary.disabled}
          />
        </View>
      </View>

      <Pressable className="px-4" onPress={() => router.navigate(`/offer/${id}`)}>
        <Heading className="text-3xl font-bold mt-4 mb-1">{title}</Heading>

        <View className="flex-row items-center mt-2 mb-4">
          <MaterialCommunityIcons name="account-cash" size={18} color={colors.secondary.DEFAULT} />
          <Text className="text-md text-gray-500 dark:text-white/80 ml-3">{wage}€ /h</Text>
        </View>
        <View className="flex-row items-center mb-4 gap-4">
          <View className="flex-row items-center mt-2 mb-4">
            <Feather name="calendar" size={18} color={colors.secondary.DEFAULT} />
            <Text className="text-md text-gray-500 dark:text-white/80 ml-3">{date}</Text>
          </View>
          <View className="flex-row items-center mt-2 mb-4">
            <FontAwesome5 name="hourglass-half" size={18} color={colors.secondary.DEFAULT} />
            <Text className="text-md text-gray-500 dark:text-white/80 ml-3">{begin}</Text>
          </View>
          <View className="flex-row items-center mt-2 mb-4">
            <AntDesign name="clock-circle" size={18} color={colors.secondary.DEFAULT} />
            <Text className="text-md text-gray-500 dark:text-white/80 ml-3">{duration}</Text>
          </View>
        </View>
      </Pressable>

      <View className="relative">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20, paddingLeft: 8 }}
        >
          <View className="flex-row items-center">
            {competence.map((comp, index) => (
              <CompetenceCard key={`${comp}-${index}`} comp={comp} size="lg" />
            ))}
          </View>
        </ScrollView>

        <LinearGradient
          colors={
            isDark
              ? ['rgba(49, 49, 49, 0)', 'rgba(49, 49, 49, 1)']
              : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 15,
            zIndex: 100,
          }}
        />
        <LinearGradient
          colors={
            isDark
              ? ['rgba(49, 49, 49, 1)', 'rgba(49, 49, 49, 0)']
              : ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 15,
            zIndex: 100,
          }}
        />
      </View>
    </Card>
  );
}
