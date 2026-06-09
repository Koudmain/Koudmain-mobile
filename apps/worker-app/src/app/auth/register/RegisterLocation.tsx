import {
  View,
  Text,
  Pressable,
  Keyboard,
  TextInput,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { VStack, FormControl, Button } from '@koudmain/ui/components/ui/index';
import { AuthTop } from '@koudmain/ui/components/auth/AuthTop';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { darkMapStyle, lightMapStyle } from '@/constants/styleMap';

import { AddressAutocomplete, AddressData } from '@koudmain/ui/components/form/AddressAutocomplete';
import { colors } from '@koudmain/ui/constants/theme';

export default function RegisterLocation() {
  const params = useLocalSearchParams<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    selectedJobs?: string;
    bio?: string;
  }>();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentMapStyle = isDark ? darkMapStyle : lightMapStyle;

  const secondaryBase = colors.secondary.DEFAULT;
  const circleFillColor = secondaryBase.replace('hsl', 'hsla').replace(')', ', 0.4)');
  const circleStrokeColor = secondaryBase.replace('hsl', 'hsla').replace(')', ', 0.6)');

  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [radius, setRadius] = useState(10);
  // Paris coordinates by default
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const { register, isLoading } = useSession();
  const [registerFailed, setRegisterFailed] = useState(false);

  const isFormValid = addressData !== null;

  const handleRegister = async () => {
    try {
      // NOTE: We call the normal register function for now.
      // Depending on backend support, you can adapt this to pass `workerProfile`
      // which includes the selected jobs, bio, and location.
      const didRegister = await register({
        email: params.email || '',
        password: params.password || '',
        firstName: params.firstName || '',
        lastName: params.lastName || '',
        isWorkerActive: true,
      });

      if (didRegister) {
        router.replace('/auth/SignIn');
        return;
      }
      setRegisterFailed(true);
    } catch (error) {
      console.error('Registration failed:', error);
      setRegisterFailed(true);
    }
  };

  // Adjust zoom level dynamically based on radius
  // roughly: 1km -> 0.01 delta
  const computedDelta = Math.max(0.01, radius * 0.02);

  return (
    <View className="flex-1 bg-white dark:bg-primary h-full">
      <AuthTop title="Inscription" />
      <Pressable onPress={Keyboard.dismiss} className="flex-1">
        <FormControl className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <VStack className="flex flex-col justify-between h-full pb-10 px-3">
              <View className="mt-8">
                <Text className="text-primary dark:text-white text-3xl font-bold mt-4 ">
                  Ou souhaitez vous travailler ?
                </Text>
              </View>
              <View className="px-3">
                <AddressAutocomplete
                  onSelect={(addr) => {
                    setAddressData(addr);
                    setRegion({
                      ...region,
                      latitude: addr.latitude,
                      longitude: addr.longitude,
                    });
                  }}
                />

                <View className="mt-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-primary dark:text-white font-semibold">
                      Rayon de déplacement :
                    </Text>
                    <Text className="text-secondary-500 font-bold">{radius} km</Text>
                  </View>
                </View>

                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  value={radius}
                  onValueChange={setRadius}
                  minimumTrackTintColor={colors.secondary.DEFAULT}
                  maximumTrackTintColor={isDark ? colors.primary[600] : colors.neutral[200]}
                  thumbTintColor={colors.secondary.DEFAULT}
                />

                <View className="flex-row items-center justify-between mt-1 mb-6">
                  <Text className="text-primary dark:text-white font-semibold">1 km</Text>
                  <Text className="text-primary dark:text-white font-semibold">25 km</Text>
                  <Text className="text-primary dark:text-white font-semibold">50 km</Text>
                </View>

                <View
                  className="mt-4 border border-gray-200 dark:border-gray-700"
                  style={{ height: 350, borderRadius: 16, overflow: 'hidden' }}
                >
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    customMapStyle={currentMapStyle}
                    style={{ flex: 1 }}
                    region={{
                      ...region,
                      latitudeDelta: computedDelta,
                      longitudeDelta: computedDelta,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Marker coordinate={region} />
                    <Circle
                      center={region}
                      radius={radius * 1000}
                      fillColor={circleFillColor}
                      strokeColor={circleStrokeColor}
                    />
                  </MapView>
                </View>
              </View>

              <View className="mt-10">
                <Button
                  label={isLoading ? 'Inscription...' : 'Terminer'}
                  variant={isFormValid && !isLoading ? 'primary' : 'muted'}
                  className="mx-2"
                  disabled={!isFormValid || isLoading}
                  onPress={handleRegister}
                />
                {registerFailed && (
                  <Text className="text-red-500 text-center mt-4 mx-2">
                    Échec de l'inscription. Merci de réessayer.
                  </Text>
                )}
              </View>
            </VStack>
          </ScrollView>
        </FormControl>
      </Pressable>
    </View>
  );
}
