import { TouchableOpacity, View } from 'react-native';
import { Text, HStack } from '@koudmain/ui/gluestack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const AnimatedHStack = Animated.createAnimatedComponent(HStack);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedProfileButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  setIsEditing: (value: boolean) => void;
}

export default function AnimatedProfileButtons({
  onSave,
  onCancel,
  setIsEditing,
}: AnimatedProfileButtonsProps) {
  const animationProgress = useSharedValue(0);

  const splitStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: withSpring(animationProgress.value) }],
      opacity: withTiming(animationProgress.value, { duration: 200 }),
    };
  });

  const modifierStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1 - animationProgress.value, { duration: 150 }),
      transform: [{ scale: withTiming(1 - animationProgress.value * 0.1, { duration: 200 }) }],
      display: animationProgress.value > 0.9 ? 'none' : 'flex',
    };
  });

  const handleStartEdit = () => {
    setIsEditing(true);
    animationProgress.value = 1;
  };

  const handleEndEdit = (callback?: () => void) => {
    animationProgress.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setIsEditing)(false);
      if (callback) runOnJS(callback)();
    });
  };

  return (
    <View className="relative mt-2 h-16 justify-center">
      <AnimatedTouchableOpacity
        style={[modifierStyle]}
        className="absolute w-full bg-secondary py-4 rounded-[10] items-center shadow-md z-10"
        onPress={handleStartEdit}
      >
        <Text className="text-white font-bold text-lg">Modifier mon profil</Text>
      </AnimatedTouchableOpacity>

      <AnimatedHStack
        style={[splitStyle]}
        space="md"
        className="w-full justify-center items-center"
      >
        <TouchableOpacity
          className="flex-1 bg-secondary py-4 rounded-[10] items-center shadow-md"
          onPress={() => handleEndEdit(onSave)}
        >
          <Text className="text-white font-bold">Enregistrer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-primary-disabled py-4 rounded-[10] items-center"
          onPress={() => handleEndEdit(onCancel)}
        >
          <Text className="text-white font-bold">Annuler</Text>
        </TouchableOpacity>
      </AnimatedHStack>
    </View>
  );
}
