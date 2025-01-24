// useTheme.ts

import { useState, useEffect } from 'react';

export type ThemeType = 'light' | 'dark' | 'custom';

const defaultTheme: ThemeType = 'light';

export const useTheme = () => {
  // Load the initial theme from local storage or fall back to the default
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('draftEaseTheme');
    return savedTheme ? (savedTheme as ThemeType) : defaultTheme;
  });

  // Persist the theme to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('draftEaseTheme', theme);
  }, [theme]);

  //function to toggle between light and dark themes
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Function to reset the theme to the default
  const resetToDefaultTheme = () => {
    setTheme(defaultTheme);
  };

  return {
    theme,
    setTheme,
    resetToDefaultTheme,
    toggleTheme
  };
};
