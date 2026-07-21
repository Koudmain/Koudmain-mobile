import { View, TouchableOpacity } from 'react-native';
import Reanimated, { SharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { IConversation } from '@/types/conversation';

const ButtonRightAction = ({
  prog,
  conversation,
  onMore,
  onPin,
  onArchive,
  closeSwipe,
  isDark,
}: {
  prog: SharedValue<number>;
  conversation: IConversation;
  onMore?: (id: number) => void;
  onPin?: (id: number) => void;
  onArchive?: (id: number) => void;
  closeSwipe: () => void;
  isDark: boolean;
}) => {
  const totalWidth = 225;

  const stylePlus = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(prog.value, [0, 1], [totalWidth, 0]) }],
  }));

  const stylePin = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(prog.value, [0, 1], [totalWidth / 1.5, 0]) }],
  }));

  const styleArchive = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(prog.value, [0, 1], [totalWidth / 3, 0]) }],
  }));

  return (
    <View className="flex-row overflow-hidden" style={{ width: totalWidth }}>
      <Reanimated.View style={[{ width: 75 }, stylePlus]}>
        <TouchableOpacity
          className="flex-1 bg-neutral-200 dark:bg-neutral-800 items-center justify-center"
          onPress={() => {
            onMore?.(conversation.id);
            closeSwipe();
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={isDark ? '#999' : '#666'} />
        </TouchableOpacity>
      </Reanimated.View>

      <Reanimated.View style={[{ width: 75 }, stylePin]}>
        <TouchableOpacity
          className="flex-1 bg-blue-500 items-center justify-center"
          onPress={() => {
            onPin?.(conversation.id);
            closeSwipe();
          }}
        >
          <Octicons
            name={conversation.settings.is_pinned ? 'pin-slash' : 'pin'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </Reanimated.View>

      <Reanimated.View style={[{ width: 75 }, styleArchive]}>
        <TouchableOpacity
          className="flex-1 bg-secondary items-center justify-center"
          onPress={() => {
            onArchive?.(conversation.id);
            closeSwipe();
          }}
        >
          <Ionicons name="archive" size={24} color="white" />
        </TouchableOpacity>
      </Reanimated.View>
    </View>
  );
};

export default ButtonRightAction;
