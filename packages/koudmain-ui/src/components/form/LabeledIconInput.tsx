import { Text, TextInput, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { cnFusion } from '../../utils/cnFusion';

type LabeledIconInputProps = {
  iconName: React.ComponentProps<typeof FontAwesome5>['name'];
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  suffix?: string;
  iconSize?: number;
  iconColor?: string;
  keyboardType?: 'default' | 'number-pad' | 'numeric' | 'email-address' | 'phone-pad';
  placeholder?: string;
};

/**
 *
 * @param iconName - Le nom de l'icône à afficher à gauche du champ de saisie, provenant de la bibliothèque FontAwesome5.
 * @param label - Le texte du label affiché au-dessus du champ de saisie. Ce paramètre est optionnel.
 * @param value - La valeur actuelle du champ de saisie, contrôlée par le composant parent.
 * @param onChangeText - Une fonction de rappel qui est appelée lorsque le texte du champ de saisie change. Elle reçoit le nouveau texte en argument.
 * @param className - Classes supplémentaires pour le conteneur global du composant.
 * @param inputClassName - Classes supplémentaires pour le champ de saisie lui-même.
 * @param labelClassName - Classes supplémentaires pour le label du champ de saisie.
 * @param suffix - Un texte optionnel à afficher à droite du champ de saisie, souvent utilisé pour indiquer une unité (par exemple, "km" ou "€").
 * @param iconSize - La taille de l'icône. Par défaut, elle est définie sur 18.
 * @param iconColor - La couleur de l'icône. Par défaut, elle est définie sur '#6B7280' (gris).
 * @param keyboardType - Le type de clavier à afficher lorsque le champ de saisie est focalisé. Par défaut, il est défini sur 'default'.
 * @param placeholder - Le texte d'espace réservé à afficher lorsque le champ de saisie est vide.
 * @returns Un composant de champ de saisie stylisé avec une icône à gauche, un label au-dessus, et un suffixe optionnel à droite. Le champ de saisie est contrôlé par le composant parent via les props `value` et `onChangeText`.
 */
export default function LabeledIconInput({
  iconName,
  label,
  value,
  onChangeText,
  className,
  inputClassName,
  labelClassName,
  suffix,
  iconSize = 18,
  iconColor = '#6B7280',
  keyboardType = 'default',
  placeholder,
}: LabeledIconInputProps) {
  return (
    <View className={cnFusion('space-y-2', className)}>
      {label && (
        <Text
          className={cnFusion('text-sm font-semibold text-primary dark:text-white', labelClassName)}
        >
          {label}
        </Text>
      )}

      <View className="flex-row items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 dark:border-primary-600 dark:bg-primary-700">
        <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className={cnFusion(
            'mx-2 flex-1 text-right text-primary dark:text-white',
            inputClassName,
          )}
        />
        {suffix ? <Text className="font-bold text-gray-400">{suffix}</Text> : null}
      </View>
    </View>
  );
}
