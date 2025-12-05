import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../App'; // Import useAuth from the main App.js file

// Import Screens (to be implemented)
import LoginScreen from '../screens/LoginScreen';
import GalaxyListScreen from '../screens/GalaxyListScreen';
import ProblemScreen from '../screens/ProblemScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* LoginScreen will handle both login and registration */}
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1e293b', // Tailwind slate-800
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name="GalaxyList"
      component={GalaxyListScreen}
      options={{ title: 'StormBrainer Galaxies 🌌' }}
    />
    <Stack.Screen
      name="Problem"
      component={ProblemScreen}
      options={({ route }) => ({ title: route.params.problemTitle || 'Problem Planet' })}
    />
    {/* Future screens like Profile, Create Galaxy, etc., would go here */}
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { user } = useAuth(); // Get user state from the AuthContext in App.js

  return (
    <NavigationContainer>
      {/* If user exists, show the main app stack, otherwise show the auth stack */}
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}