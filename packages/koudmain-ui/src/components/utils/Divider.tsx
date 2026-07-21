import { colors } from '../../constants/theme';
import { cnFusion } from '../../utils/cnFusion';
import { Text, View, StyleSheet } from 'react-native';

interface DividerProps {
  text?: string;
  color?: string;
  thickness?: number;
  className?: string;
}

/**
 *
 * @param text Le texte à afficher au centre du diviseur. Si non fourni, le diviseur sera une ligne continue.
 * @param color La couleur de la ligne du diviseur. Par défaut: #000 (noir).
 * @param thickness L'épaisseur de la ligne du diviseur en pixels. Par défaut: 1px.
 * @param className Classes supplémentaires pour le conteneur principal du diviseur.
 * @returns Un composant Divider qui affiche une ligne horizontale avec un texte optionnel au centre.
 */
export default function Divider({ text, color, thickness, className }: DividerProps) {
  const lineColor = color || colors.primary.DEFAULT;
  const lineThickness = thickness || 1;

  const styles = StyleSheet.create({
    line: {
      backgroundColor: lineColor,
      height: lineThickness,
    },
    text: {
      marginHorizontal: 12,
    },
  });

  if (!text) {
    return <View style={styles.line} className={cnFusion('w-full', className)} />;
  }

  return (
    <View className={cnFusion('w-full flex-row items-center', className)}>
      <View style={styles.line} className="flex-1" />
      <View>
        <Text style={styles.text} className="text-center text-primary dark:text-white">
          {text}
        </Text>
      </View>
      <View style={styles.line} className="flex-1" />
    </View>
  );
}
