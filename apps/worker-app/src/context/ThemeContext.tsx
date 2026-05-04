import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorMode = 'light' | 'dark';

interface ThemeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  isManualControl: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();

  const [colorMode, setColorMode] = useState<ColorMode>(systemColorScheme || 'light');
  const [isManualControl, setIsManualControl] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@user_theme');
        if (savedTheme) {
          setColorMode(savedTheme as ColorMode);
          setIsManualControl(true);
        } else if (systemColorScheme) {
          setColorMode(systemColorScheme);
        }
      } catch (err) {
        console.error('Erreur au chargement du thème via AsyncStorage', err);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isManualControl && systemColorScheme) {
      setColorMode(systemColorScheme);
    }
  }, [systemColorScheme, isManualControl]);

  const toggleColorMode = async () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light';

    setColorMode(newMode);
    setIsManualControl(true);

    try {
      await AsyncStorage.setItem('@user_theme', newMode);
    } catch (err) {
      console.error('Erreur à la sauvegarde du thème', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode, isManualControl }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
};
