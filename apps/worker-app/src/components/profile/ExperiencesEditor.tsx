import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { colors } from '@/constants/theme';

export interface ExperienceDraft {
  title: string;
  /** Chiffres uniquement, vide si non renseignée */
  durationMonths: string;
}

interface ExperiencesEditorProps {
  experiences: ExperienceDraft[];
  onChange: (experiences: ExperienceDraft[]) => void;
}

export function ExperiencesEditor({ experiences, onChange }: ExperiencesEditorProps) {
  const update = (index: number, patch: Partial<ExperienceDraft>) =>
    onChange(experiences.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <View>
      {experiences.map((experience, index) => (
        <View
          key={index}
          className="mb-4 p-4 rounded-[16] bg-white dark:bg-primary-700 shadow-md"
          style={{ elevation: 4 }}
        >
          <View className="flex-row items-start">
            <LabeledUnderlinedInput
              label="Intitulé"
              placeholder="Serveur en brasserie"
              value={experience.title}
              onChangeText={(title) => update(index, { title })}
              containerClassName="flex-1"
            />
            <TouchableOpacity
              onPress={() => onChange(experiences.filter((_, i) => i !== index))}
              accessibilityLabel="Supprimer cette expérience"
              className="ml-3 mt-1"
            >
              <MaterialIcons name="delete-outline" size={26} color={colors.error.DEFAULT} />
            </TouchableOpacity>
          </View>
          <LabeledUnderlinedInput
            label="Durée (mois)"
            placeholder="12"
            keyboardType="number-pad"
            value={experience.durationMonths}
            onChangeText={(value) => update(index, { durationMonths: value.replace(/\D/g, '') })}
            containerClassName="mt-4"
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() => onChange([...experiences, { title: '', durationMonths: '' }])}
        className="flex-row items-center py-2"
      >
        <MaterialIcons name="add-circle-outline" size={24} color={colors.secondary.DEFAULT} />
        <Text className="ml-2 text-base font-semibold text-secondary">Ajouter une expérience</Text>
      </TouchableOpacity>
    </View>
  );
}
