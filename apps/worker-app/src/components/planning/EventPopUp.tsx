import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import PlanningCard from '@/components/card/PlanningCard';
import { Shadow } from 'react-native-shadow-2';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

const { height: screenHeight } = Dimensions.get('window');

interface EventPopUpProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: string;
  events: any[];
}

export default function EventPopUp({ isVisible, onClose, selectedDate, events }: EventPopUpProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [shouldRenderModal, setShouldRenderModal] = useState(isVisible);
  const isFocused = useIsFocused();

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const bottomSheetHeight = screenHeight * 0.6;

  const overlayOpacity = translateY.interpolate({
    inputRange: [screenHeight - bottomSheetHeight, screenHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (isVisible && isFocused) {
      setShouldRenderModal(true);
      Animated.spring(translateY, {
        toValue: screenHeight - bottomSheetHeight,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (!isVisible || !isFocused) {
          setShouldRenderModal(false);
        }
      });
    }
  }, [isVisible, isFocused, translateY, bottomSheetHeight]);

  const dragHandleHeight = 548;
  const isDragHandleGesture = (evt: any, gestureState: any, requireMovement = false) => {
    const sheetTop = screenHeight - bottomSheetHeight;
    const touchStartsInHandle = evt.nativeEvent.pageY <= sheetTop + dragHandleHeight;
    const isPredominantlyVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    const hasEnoughMovement = Math.abs(gestureState.dy) > 5;
    if (!touchStartsInHandle) {
      return false;
    }
    return requireMovement ? isPredominantlyVertical && hasEnoughMovement : true;
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => isDragHandleGesture(evt, gestureState),
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        isDragHandleGesture(evt, gestureState, true),
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(screenHeight - bottomSheetHeight + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: screenHeight - bottomSheetHeight,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      transparent={true}
      visible={shouldRenderModal}
      animationType="none"
      onRequestClose={() => {
        translateY.setValue(screenHeight);
        onClose();
      }}
    >
      <View className="absolute inset-0" pointerEvents="box-none">
        <Animated.View
          className="absolute inset-0 bg-black/40 z-10"
          style={{
            opacity: overlayOpacity,
          }}
        >
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => {
              translateY.setValue(screenHeight);
              onClose();
            }}
          />
        </Animated.View>

        <Animated.View
          className="absolute left-0 right-0 top-0 rounded-t-[30px] z-20 shadow-lg bg-background-light dark:bg-background-dark"
          style={[
            {
              height: bottomSheetHeight,
              transform: [{ translateY: translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View className="w-full items-center py-3">
            <View className="w-11 h-1.5 bg-typography-gray rounded-full" />
          </View>

          <View className="flex-1">
            <Text className="text-xl font-bold text-primary dark:text-typography-white px-6 pb-2">
              Événements du {selectedDate}
            </Text>

            <View className="flex-1 relative">
              {events.length > 0 ? (
                <>
                  <ScrollView
                    className="p-6 pt-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                  >
                    {events.map((event) => (
                      <Shadow
                        key={`${event.id}-${event.startingDate}`}
                        startColor={isDark ? '#FFFFFF10' : '#00000010'}
                        style={{
                          borderRadius: 22,
                          width: '100%',
                          marginBottom: 16,
                          backgroundColor: isDark
                            ? colors?.background.dark
                            : colors?.background.light,
                        }}
                      >
                        <PlanningCard
                          key={`${event.id}-${event.startingDate}`}
                          id={event.id}
                          name={event.name || 'Entreprise'}
                          image_profile={event.image_profile || null}
                          city={event.city || ''}
                          zip={event.zip || ''}
                          rate={event.rate || 0}
                          number_rate={event.number_rate || 0}
                          title={event.title || 'Mission'}
                          wage={event.wage || 0}
                          begin={event.time || '00h00'}
                          end={event.end || '00h00'}
                          status={event.status || 'pending'}
                        />
                      </Shadow>
                    ))}
                  </ScrollView>

                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(49, 49, 49, 1)', 'rgba(49, 49, 49, 0)']
                        : ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']
                    }
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 30,
                      zIndex: 10,
                    }}
                    pointerEvents="none"
                  />

                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(49, 49, 49, 0)', 'rgba(49, 49, 49, 1)']
                        : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']
                    }
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 40,
                      zIndex: 10,
                    }}
                    pointerEvents="none"
                  />
                </>
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-center text-primary-disabled italic text-lg">
                    Aucun événement pour cette date.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
