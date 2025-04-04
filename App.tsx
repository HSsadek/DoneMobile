import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { lightTheme, darkTheme } from './src/theme';
import { MD3Theme } from 'react-native-paper/lib/typescript/types';
import { ProjectProvider } from './src/context/ProjectContext';

export type ThemeType = 'light' | 'dark';

export const ThemeContext = React.createContext({
  theme: 'light' as ThemeType,
  toggleTheme: () => {},
});

export default function App() {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <PaperProvider theme={theme === 'light' ? lightTheme as MD3Theme : darkTheme as MD3Theme}>
        <ProjectProvider>
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </ProjectProvider>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}