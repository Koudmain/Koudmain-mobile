import * as ImagePicker from 'expo-image-picker';

export const pickImage = async (aspect: [number, number]) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });

    return result.canceled ? null : result.assets[0].uri;
  } catch (error) {
    console.error(error);
    alert("Impossible d'ouvrir votre galerie photo.");
    return null;
  }
};
