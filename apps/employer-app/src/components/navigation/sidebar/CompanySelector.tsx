import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useSession } from '@/context/SessionContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { colors } from '@/app/(tabs)/CreatePost';
import { useRouter } from 'expo-router';

export function CompanySelector() {
  const { companies, activeCompanyId, changeCompany } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const selectedCompany = useMemo(() => {
    return companies?.find((c) => c.id.toString() === activeCompanyId);
  }, [companies, activeCompanyId]);

  if (!companies || companies.length === 0) return null;

  const handleSelect = (id: string) => {
    changeCompany(id);
    setIsVisible(false);
  };

  const handleAddCompany = () => {
    setIsVisible(false);
    // router.push('/(menu)/CreateCompany');
  };

  const hasCompanies = companies && companies.length > 0;

  return (
    <View className="w-full my-2 items-center">
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="flex-row items-center justify-center h-10 px-4 rounded-lg min-w-[150px]"
      >
        <Text className="text-lg font-bold text-primary dark:text-white mr-2">
          {selectedCompany ? selectedCompany.name : 'Sélectionner...'}
        </Text>
        <AntDesign
          name="down"
          size={12}
          color={isDark ? colors?.primary.content : colors?.primary.DEFAULT}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsVisible(false)}>
          <View style={styles.modalContent} className="bg-white dark:bg-neutral-900 shadow-xl">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
            <Text className="text-center font-bold text-secondary mb-4">
              {hasCompanies ? 'Choisir une entreprise' : 'Aucune entreprise'}
            </Text>

            <FlatList
              data={companies}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.id.toString())}
                  className={`p-4 rounded-xl mb-2 ${
                    item.id.toString() === activeCompanyId
                      ? 'bg-primary/10 border border-secondary'
                      : 'bg-primary-disabled dark:bg-primary-hover'
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      item.id.toString() === activeCompanyId ? 'text-secondary' : 'text-white'
                    }`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={() => (
                <TouchableOpacity
                  onPress={handleAddCompany}
                  className="p-4 rounded-xl mt-2 border-2 border-dashed border-gray-300 dark:border-neutral-700 flex-row justify-center items-center"
                >
                  <AntDesign
                    name="plus-circle"
                    size={16}
                    color={isDark ? '#fff' : colors?.primary.DEFAULT}
                  />
                  <Text className="text-center font-bold ml-2 text-primary dark:text-white">
                    Ajouter une entreprise
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
    paddingBottom: 40,
  },
});
