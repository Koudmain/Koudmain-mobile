import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';
type ColorMode = 'light' | 'dark';

interface ThemeContextType {
  themePreference: ThemePreference;
  colorMode: ColorMode;
  setThemePreference: (pref: ThemePreference) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);

  const [osColorScheme, setOsColorScheme] = useState<ColorMode>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );

  const themePreferenceRef = useRef<ThemePreference>('system');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themePreferenceRef.current === 'system') {
        setOsColorScheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedPref = await AsyncStorage.getItem('@user_theme_pref');
        if (savedPref) {
          const pref = savedPref as ThemePreference;
          themePreferenceRef.current = pref;
          setThemePreferenceState(pref);
        }
      } catch (err) {
        console.error('Erreur au chargement du thème', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const colorMode: ColorMode = themePreference === 'system' ? osColorScheme : themePreference;

  const setThemePreference = async (newPref: ThemePreference) => {
    themePreferenceRef.current = newPref;
    setThemePreferenceState(newPref);
    try {
      await AsyncStorage.setItem('@user_theme_pref', newPref);
    } catch (err) {
      console.error('Erreur à la sauvegarde du thème', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ themePreference, colorMode, setThemePreference, isLoading }}>
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
