import { useState } from 'react';
import { Alert, Image, View, TouchableOpacity, Text, Pressable, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

export type ImportImageProps = {
  titleText?: string;
  insideText?: string;
};

export default function KoudmainImagePicker({ titleText, insideText }: ImportImageProps) {
  const [image, setImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const takePhoto = async () => {
    const CamerapermissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!CamerapermissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const ImagepermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!ImagepermissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="w-full pt-4">
      <Text className="text-primary font-inter font-bold text-xl">
        {titleText || 'Ajouter une image'}
      </Text>
      <TouchableOpacity
        className="w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mt-3 px-6"
        onPress={() => setOpen(!open)}
      >
        {image || <FontAwesome name="plus" size={24} color="gray" />}
        {image || <Text className="text-gray-400 mt-2">{insideText || 'Ajouter une image'}</Text>}
        {image && <Image source={{ uri: image }} className="w-full h-full" />}
      </TouchableOpacity>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-center items-center bg-black/70">
          <Pressable
            className="absolute top-0 bottom-0 left-0 right-0"
            onPress={() => setOpen(false)}
          />
          <View className="w-11/12 shadow-2xl shadow-black z-10">
            <View className="bg-white dark:bg-primary w-full rounded-xl overflow-hidden">
              <View className="flex-col">
                <Pressable
                  onPress={takePhoto}
                  className="flex-row justify-center items-center py-4 px-6 active:bg-gray-50"
                >
                  <FontAwesome name="camera" size={24} color="black" />
                  <Text className="text-primary dark:text-white font-medium text-base text-center pl-2">
                    Prendre une photo
                  </Text>
                </Pressable>
                <View className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

                <Pressable
                  onPress={pickImage}
                  className="flex-row justify-center items-center py-4 px-6 active:bg-gray-50"
                >
                  <FontAwesome name="image" size={24} color="black" />
                  <Text className="text-primary dark:text-white font-medium text-base text-center pl-2">
                    Choisir depuis la galerie
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
