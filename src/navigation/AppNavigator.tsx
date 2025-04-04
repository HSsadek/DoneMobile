import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated } from 'react-native';
import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/auth/LoginScreen';
import { RootStackParamList } from './types';

type StackAnimationContext = {
  current: {
    progress: Animated.AnimatedInterpolation<number>;
  };
  layouts: {
    screen: {
      width: number;
    };
  };
};

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
          animation: 'slide_from_right',
          animationDuration: 200,
          presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({ current, layouts }: StackAnimationContext) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          }),
          gestureResponseDistance: 100,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="Main" 
          component={DrawerNavigator}
          options={{
            gestureEnabled: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 