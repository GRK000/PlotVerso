import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { darkColors, lightColors, type AppColors } from './colors';
import type { ThemePreference } from '@/shared/types/domain';

type ThemeContextValue = {
  colors: AppColors;
  preference: ThemePreference;
  resolved: Exclude<ColorSchemeName, null>;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = 'plotverso.theme';

export function ThemeProvider({ children }: PropsWithChildren) {
  const scheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((value) => {
      if (value === 'light' || value === 'dark' || value === 'system') setPreferenceState(value);
    });
  }, []);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    void AsyncStorage.setItem(storageKey, next);
  };

  const resolved = preference === 'system' ? (scheme ?? 'light') : preference;
  const colors = resolved === 'dark' ? darkColors : lightColors;
  const value = useMemo(
    () => ({ colors, preference, resolved, setPreference }),
    [colors, preference, resolved]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
