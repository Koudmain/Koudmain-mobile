import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { WorkerFormationType } from '@koudmain/ui/types';
import { cnFusion } from '@koudmain/ui/utils';
import { colors } from '@/constants/theme';

export interface FormationDraft {
  title: string;
  institution: string;
  type: WorkerFormationType | null;
  year: string;
  savedDate?: string | null;
}

const FORMATION_TYPES: { value: WorkerFormationType; label: string }[] = [
  { value: 'FORMATION', label: 'Formation' },
  { value: 'DIPLOMA', label: 'Diplôme' },
  { value: 'PERMIT', label: 'Permis' },
];

interface FormationsEditorProps {
  formations: FormationDraft[];
  onChange: (formations: FormationDraft[]) => void;
}

export function FormationsEditor({ formations, onChange }: FormationsEditorProps) {
  const update = (index: number, patch: Partial<FormationDraft>) =>
    onChange(formations.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <View>
      {formations.map((formation, index) => (
        <View
          key={index}
          className="mb-4 p-4 rounded-[16] bg-white dark:bg-primary-700 shadow-md"
          style={{ elevation: 4 }}
        >
          <View className="flex-row mb-4">
            {FORMATION_TYPES.map((type) => {
              const isActive = formation.type === type.value;
              return (
                <TouchableOpacity
                  key={type.value}
                  activeOpacity={0.7}
                  onPress={() => update(index, { type: type.value })}
                  className={cnFusion(
                    'mr-2 px-4 py-1 rounded-full border-2 border-secondary',
                    isActive && 'bg-secondary',
                  )}
                >
                  <Text
                    className={cnFusion(
                      'text-sm font-bold',
                      isActive ? 'text-white' : 'text-secondary',
                    )}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => onChange(formations.filter((_, i) => i !== index))}
              accessibilityLabel="Supprimer cette formation"
              className="ml-auto"
            >
              <MaterialIcons name="delete-outline" size={26} color={colors.error.DEFAULT} />
            </TouchableOpacity>
          </View>
          <LabeledUnderlinedInput
            label="Intitulé"
            placeholder="CAP Cuisine"
            value={formation.title}
            onChangeText={(title) => update(index, { title })}
          />
          <LabeledUnderlinedInput
            label="Organisme"
            placeholder="Lycée hôtelier de Lyon"
            value={formation.institution}
            onChangeText={(institution) => update(index, { institution })}
            containerClassName="mt-4"
          />
          <LabeledUnderlinedInput
            label="Année d'obtention"
            placeholder="2022"
            keyboardType="number-pad"
            maxLength={4}
            value={formation.year}
            onChangeText={(value) => update(index, { year: value.replace(/\D/g, '') })}
            containerClassName="mt-4"
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() =>
          onChange([...formations, { title: '', institution: '', type: 'FORMATION', year: '' }])
        }
        className="flex-row items-center py-2"
      >
        <MaterialIcons name="add-circle-outline" size={24} color={colors.secondary.DEFAULT} />
        <Text className="ml-2 text-base font-semibold text-secondary">Ajouter une formation</Text>
      </TouchableOpacity>
    </View>
  );
}
