import { Text } from '@koudmain/ui/gluestack';
import { View, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';

type CompetenceCardProps = {
  comp: string;
  backgroundColor?: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  deletable?: boolean;
  onDelete?: () => void;
};

const SIZE_STYLES = {
  sm: { paddingHorizontal: 8, paddingVertical: 2, fontSize: 10 },
  md: { paddingHorizontal: 12, paddingVertical: 3, fontSize: 11 },
  lg: { paddingHorizontal: 16, paddingVertical: 4, fontSize: 13 },
  xl: { paddingHorizontal: 20, paddingVertical: 6, fontSize: 15 },
};

export default function CompetenceCard({
  comp,
  backgroundColor = '#F5D2C8',
  accentColor = '#D84A22',
  size = 'md',
  deletable = false,
  onDelete,
}: CompetenceCardProps) {
  const sizeStyle = SIZE_STYLES[size];

  return (
    <View className="flex-row">
      <View
        className="rounded-full m-1 flex-row items-center justify-center"
        style={{
          backgroundColor,
          borderColor: accentColor,
          borderWidth: 1,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
        }}
      >
        <Text style={{ color: accentColor, fontSize: sizeStyle.fontSize }}>{comp}</Text>
        {deletable && (
          <TouchableOpacity onPress={onDelete} style={{ marginLeft: 8 }}>
            <FontAwesomeIcon name="times" size={sizeStyle.fontSize} color={accentColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
