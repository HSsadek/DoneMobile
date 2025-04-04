import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { MD3Theme } from 'react-native-paper/lib/typescript/types';

export interface CustomTheme extends MD3Theme {
  dark: boolean;
  colors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    tertiary: string;
    tertiaryContainer: string;
    surface: string;
    surfaceVariant: string;
    surfaceDisabled: string;
    background: string;
    error: string;
    errorContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    onTertiary: string;
    onTertiaryContainer: string;
    onSurface: string;
    onSurfaceVariant: string;
    onSurfaceDisabled: string;
    onError: string;
    onErrorContainer: string;
    onBackground: string;
    outline: string;
    outlineVariant: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    shadow: string;
    scrim: string;
    backdrop: string;
    elevation: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      level5: string;
    };
    text: string;
    border: string;
  };
}

export const lightTheme: CustomTheme = {
  ...MD3LightTheme,
  dark: false,
  roundness: 4,
  animation: {
    scale: 1.0,
  },
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6A1B9A', // Ana mor renk
    primaryContainer: '#9C27B0', // Daha açık mor
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#FFFFFF',
    secondary: '#8E24AA',
    secondaryContainer: '#AB47BC',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#FFFFFF',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    border: '#E0E0E0',
    error: '#B00020',
    elevation: {
      level0: 'transparent',
      level1: '#F5F5F5',
      level2: '#EEEEEE',
      level3: '#E0E0E0',
      level4: '#BDBDBD',
      level5: '#9E9E9E',
    },
  },
};

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 4,
  animation: {
    scale: 1.0,
  },
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#9C27B0', // Ana mor renk
    primaryContainer: '#6A1B9A', // Daha koyu mor
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#FFFFFF',
    secondary: '#AB47BC',
    secondaryContainer: '#8E24AA',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#FFFFFF',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2C2C2C',
    error: '#CF6679',
    elevation: {
      level0: '#121212',
      level1: '#1E1E1E',
      level2: '#222222',
      level3: '#242424',
      level4: '#272727',
      level5: '#2C2C2C',
    },
  },
};