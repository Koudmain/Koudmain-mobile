import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Keyboard, PanResponder } from 'react-native';

const DISMISS_DISTANCE_THRESHOLD = 100;
const DISMISS_VELOCITY_THRESHOLD = 0.65;
const MIN_FLICK_DISTANCE = 24;
const MAX_UPWARD_RUBBER_BAND = 22;

interface UseBottomSheetDragOptions {
  visible: boolean;
  onClose: () => void;
}

export function useBottomSheetDrag({ visible, onClose }: UseBottomSheetDragOptions) {
  const [isMounted, setIsMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (visible) {
      dragY.setValue(0);
      setIsMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          dragY.setValue(0);
          setIsMounted(false);
        }
      });
    }
  }, [visible, progress, dragY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 3,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy >= 0) {
            dragY.setValue(gestureState.dy);
          } else {
            // Soft upward rubber-band resistance without resizing the sheet
            const dampedUpwardOffset =
              -MAX_UPWARD_RUBBER_BAND * (1 - Math.exp(gestureState.dy / 120));
            dragY.setValue(dampedUpwardOffset);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldDismiss =
            gestureState.dy > DISMISS_DISTANCE_THRESHOLD ||
            (gestureState.vy > DISMISS_VELOCITY_THRESHOLD && gestureState.dy > MIN_FLICK_DISTANCE);

          if (shouldDismiss) {
            Keyboard.dismiss();
            onCloseRef.current();
            return;
          }

          Animated.spring(dragY, {
            toValue: 0,
            damping: 22,
            stiffness: 280,
            mass: 0.8,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(dragY, {
            toValue: 0,
            damping: 22,
            stiffness: 280,
            mass: 0.8,
            useNativeDriver: true,
          }).start();
        },
      }),
    [dragY],
  );

  const screenHeight = Dimensions.get('window').height;

  const openTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const translateY = Animated.add(openTranslateY, dragY);

  const dragBackdropOpacity = dragY.interpolate({
    inputRange: [0, screenHeight * 0.45],
    outputRange: [1, 0.25],
    extrapolate: 'clamp',
  });

  const backdropOpacity = Animated.multiply(progress, dragBackdropOpacity);

  return {
    isMounted,
    translateY,
    backdropOpacity,
    panHandlers: panResponder.panHandlers,
  };
}
