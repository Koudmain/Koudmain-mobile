import { Publication } from '@/types/publication';
import { colors } from '@/constants/theme';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { cnFusion } from '@/utils/cnFusion';

interface ListPublicationMapProps {
  flatListRef: React.RefObject<any>;
  publications: Publication[];
  selectedId: string | null;
  cardWidth: number;
  spacing: number;
  className?: string;
  onPressItem?: (index: number) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

function ListPublicationMap({
  flatListRef,
  publications,
  selectedId,
  cardWidth,
  spacing,
  className,
  onPressItem,
  onScroll,
}: ListPublicationMapProps) {
  const styles = StyleSheet.create({
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    card: {
      width: cardWidth,
      marginRight: spacing,
      shadowColor: colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  });

  return (
    <FlatList
      ref={flatListRef}
      data={publications}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      snapToInterval={cardWidth + spacing}
      decelerationRate="fast"
      onMomentumScrollEnd={onScroll}
      contentContainerStyle={styles.listContent}
      getItemLayout={(_, index) => ({
        length: cardWidth + spacing,
        offset: (cardWidth + spacing) * index,
        index,
      })}
      className={cnFusion('flex', className)}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.card,
            selectedId === item.id && { borderColor: colors.map.selected, borderWidth: 2.5 },
          ]}
          className="bg-white dark:bg-primary rounded-[15] p-[16]"
        >
          <View className="bg-primary-light self-start px-3 py-1 rounded-lg mb-8">
            <Text className="text-sm font-bold text-primary">
              {item.jobCount} poste{item.jobCount > 1 ? 's' : ''}
            </Text>
          </View>
          <Text className="text-lg font-bold text-primary dark:text-primary-content">
            {item.title}
          </Text>
          <Text className="text-base text-gray-600 dark:text-primary-light">
            {item.description}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

export default ListPublicationMap;
