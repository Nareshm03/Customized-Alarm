import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme colors
const lightTheme = {
  background: '#f8f9fa',
  cardBackground: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  inputBackground: '#f3f4f6',
  switchTrack: '#e5e7eb',
  switchThumb: '#f4f3f4',
};

const darkTheme = {
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#374151',
  inputBackground: '#374151',
  switchTrack: '#4b5563',
  switchThumb: '#d1d5db',
};

type Theme = typeof lightTheme;

interface ThemeContextType {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  
  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // Use system preference if no saved preference
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, [systemColorScheme]);
  
  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      theme: isDark ? darkTheme : lightTheme,
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};