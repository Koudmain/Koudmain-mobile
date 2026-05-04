import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const TabBarGradient = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const baseColor = isDark ? '49, 49, 49' : '255, 255, 255';

  return (
    <LinearGradient
      colors={[
        `rgba(${baseColor}, 0.00)`,
        `rgba(${baseColor}, 0.20)`,
        `rgba(${baseColor}, 0.50)`,
        `rgba(${baseColor}, 0.70)`,
        `rgba(${baseColor}, 0.90)`,
        `rgba(${baseColor}, 1.00)`,
        `rgba(${baseColor}, 1.00)`,
      ]}
      locations={[0, 0.05, 0.15, 0.2, 0.3, 0.5, 1]}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
  );
};
