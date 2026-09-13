import React from 'react';
import { ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';

type Props = ScrollViewProps & {
  extraBottomSpace?: number;
};

export function AppScrollView({
  children,
  contentContainerStyle,
  extraBottomSpace = 16,
  ...props
}: Props) {
  const tabBarHeight = useBottomTabBarHeight();

  const mergedStyle: StyleProp<ViewStyle> = [
    { paddingBottom: tabBarHeight + extraBottomSpace },
    contentContainerStyle as StyleProp<ViewStyle>,
  ];

  return (
    <ScrollView {...props} contentContainerStyle={mergedStyle}>
      {children}
    </ScrollView>
  );
}
