import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedScheme = 'light' | 'dark';

interface ThemeContextValue {
  /** The resolved color scheme after applying system preference */
  colorScheme: ResolvedScheme;
  /** The user's explicit preference (or 'system') */
  themePreference: ThemePreference;
  /** Toggle between light and dark (never sets 'system') */
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  themePreference: 'system',
  toggleTheme: () => {},
  isDark: false,
});

const STORAGE_KEY = '@medmate_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme() ?? 'light';
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(val => {
        if (val === 'light' || val === 'dark') setThemePreference(val);
      })
      .finally(() => setLoaded(true));
  }, []);

  const colorScheme: ResolvedScheme =
    themePreference === 'system' ? systemScheme : themePreference;
  const isDark = colorScheme === 'dark';

  function toggleTheme() {
    const next: ThemePreference = isDark ? 'light' : 'dark';
    setThemePreference(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  // Avoid rendering with stale preference before AsyncStorage loads
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ colorScheme, themePreference, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
