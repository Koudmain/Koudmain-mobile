import { Card, Heading, Text } from '@koudmain/ui/gluestack';
import { View, TouchableOpacity, Alert } from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import CompetenceCard from '@/components/Competences';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { colors } from '@/constants/theme';

interface Competence {
  name1: string;
  name2: string;
}

type PublicationProps = {
  title: string;
  date: string;
  description: string;
  time: string;
  views: number;
  clicks: number;
  competence: Competence;
};

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + 80 }],
  }));

  return (
    <Reanimated.View style={[{ width: 80, marginTop: 8 }, animatedStyle]}>
      <TouchableOpacity
        onPress={() => Alert.alert('Supprimer', 'Confirmer la suppression ?')}
        style={{
          flex: 1,
          backgroundColor: '#ef4444',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    </Reanimated.View>
  );
}

export default function PubliCards({ data }: { data: PublicationProps }) {
  return (
    <Swipeable
      containerStyle={{ overflow: 'visible' }}
      renderRightActions={RightAction}
      overshootRight={false}
      rightThreshold={40}
    >
      <Shadow startColor={colors.shadow.light} offset={[0, 2]} style={{ borderRadius: 20 }}>
        <Card className="w-96 p-4 rounded-[18]  mt-2 bg-white">
          <View className="mb flex-row justify-between items-center">
            <Heading className="text-lg font-bold">{data.title}</Heading>
            <MaterialIcons name="edit" size={18} color="black" />
          </View>
          <View className="flex-row items-center mt-2 mb-2">
            <Feather name="calendar" size={18} color="#D84A22" />
            <Text className="text-sm text-gray-500 ml-3">{data.date}</Text>
          </View>
          <View className="flex-row items-center mb-4">
            <MaterialCommunityIcons name="clock" size={18} color="#D84A22" />
            <Text className="text-sm text-gray-500 ml-3">{data.time}</Text>
          </View>
          <Text className="text-sm text-gray-500">{data.description}</Text>
          <View className="mt-4 flex-row justify-between items-center">
            <View className="flex-row ">
              <View className="flex-row items-center">
                <Entypo name="eye" size={14} color="grey" />
                <Text className="text-2xs text-gray-500 ml-1">{data.views}</Text>
              </View>
              <View className="flex-row items-center ml-2">
                <MaterialCommunityIcons name="cursor-default" size={14} color="grey" />
                <Text className="text-2xs text-gray-500 ml-1">{data.clicks}</Text>
              </View>
            </View>
            <View className="flex-row">
              {CompetenceCard({ comp: data.competence.name1 })}
              {CompetenceCard({ comp: data.competence.name2 })}
            </View>
          </View>
        </Card>
      </Shadow>
    </Swipeable>
  );
}
