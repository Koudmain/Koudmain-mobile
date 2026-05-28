import { cnFusion } from '@/utils/cnFusion';
import { Text, View, StyleSheet } from 'react-native';

interface DividerProps {
  text?: string;
  colors?: string;
  thickness?: number;
  className?: string;
}

/**
 *
 * @param text Le texte à afficher au centre du diviseur. Si non fourni, le diviseur sera une ligne continue.
 * @param colors La couleur de la ligne du diviseur. Par défaut: #000 (noir).
 * @param thickness L'épaisseur de la ligne du diviseur en pixels. Par défaut: 1px.
 * @param className Classes supplémentaires pour le conteneur principal du diviseur.
 * @returns Un composant Divider qui affiche une ligne horizontale avec un texte optionnel au centre.
 */
export default function Divider({ text, colors, thickness, className }: DividerProps) {
  const styles = StyleSheet.create({
    line: {
      borderColor: colors || '#000',
      borderWidth: thickness || 1,
    },
    soloLine: {
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'center',
    },
    text: {
      marginHorizontal: 12,
    },
  });

  return (
    <View className={cnFusion('w-full flex-row items-center, justify-center', className)}>
      <View
        style={styles.line}
        className={cnFusion(
          `flex-grow flex-shrink basis-0 min-w-0`,
          text ? null : `w-full flex-grow-0 self-center`,
        )}
      />
      {text && (
        <View>
          <Text style={styles.text} className="text-center text-primary dark:text-white">
            {text}
          </Text>
        </View>
      )}
      {text ? <View style={styles.line} className="flex-grow flex-shrink basis-0 min-w-0" /> : null}
    </View>
  );
}
