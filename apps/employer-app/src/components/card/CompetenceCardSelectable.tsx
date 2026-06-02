import { Text } from '@koudmain/ui/gluestack';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/theme';

type CompetenceCardSelectableProps = {
  comp: string;
  textColor?: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onChange?: (selected: boolean) => void;
};

const SIZE_STYLES = {
  sm: { paddingHorizontal: 8, paddingVertical: 2, fontSize: 10 },
  md: { paddingHorizontal: 12, paddingVertical: 3, fontSize: 11 },
  lg: { paddingHorizontal: 16, paddingVertical: 4, fontSize: 13 },
  xl: { paddingHorizontal: 20, paddingVertical: 6, fontSize: 15 },
};

export default function CompetenceCardSelectable({
  comp,
  textColor = 'black',
  accentColor = colors.secondary.DEFAULT,
  size = 'md',
  onChange,
}: CompetenceCardSelectableProps) {
  const sizeStyle = SIZE_STYLES[size];
  const [isSelected, setIsSelected] = useState(false);

  return (
    <View className="flex-row">
      <View
        className="rounded-full m-1 border"
        style={{
          borderColor: accentColor,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
          backgroundColor: isSelected ? accentColor : 'transparent',
        }}
      >
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => {
            const newValue = !isSelected;
            setIsSelected(newValue);
            if (onChange) {
              onChange(newValue);
            }
          }}
        >
          <Text style={{ color: isSelected ? 'white' : textColor, fontSize: sizeStyle.fontSize }}>
            {comp}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
