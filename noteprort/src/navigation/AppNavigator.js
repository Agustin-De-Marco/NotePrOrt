import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import NotesScreen from '../screens/NotesScreen';
import ClipboardScreen from '../screens/ClipboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NotesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Notas"
      component={NotesScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F3F3F4',
  },
};

const AppNavigator = () => (
  <NavigationContainer theme={AppTheme}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Inicio: 'grid-outline',
            Portapapeles: 'clipboard-outline',
          };
          const name = iconMap[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0B6E4F',
        tabBarInactiveTintColor: '#92A1B0',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={NotesStack} />
      <Tab.Screen name="Portapapeles" component={ClipboardScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
