import React from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';

interface TabBarHitBoxProps {
  props?: {
    children?: React.ReactNode;
    onPress?: ((e: GestureResponderEvent) => void) | undefined;
  };
  size: string;
}

export function TabBarHitBox({ props, size }: TabBarHitBoxProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <View className={`items-center justify-center ${size}`}>
        {props?.children}
        <Pressable
          onPress={props?.onPress}
          className={`${size} rounded-full absolute overflow-hidden`}
        />
      </View>
    </View>
  );
}
