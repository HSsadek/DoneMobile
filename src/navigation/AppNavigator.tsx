import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/auth/LoginScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // TODO: Implement authentication state management
  const isAuthenticated = true; // Temporarily set to true for testing

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isAuthenticated ? "Main" : "Login"}
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 