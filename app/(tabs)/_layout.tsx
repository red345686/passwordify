import { Tabs, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { PasswordProvider } from './PasswordContext';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Ensure this path is correct
import AuthScreen from './AuthScreen'; // Import your AuthScreen
import BiometricAuth from './BiometricAuth';

const Colors = {
  light: {
    tint: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
    tabBar: '#FFFFFF',
    tabBarInactive: '#8E8E93',
  },
  dark: {
    tint: '#0A84FF',
    background: '#000000',
    text: '#FFFFFF',
    tabBar: '#1C1C1E',
    tabBarInactive: '#8E8E93',
  },
};

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <PasswordProvider>
      {!user ? (
        <AuthScreen /> // Show AuthScreen if not authenticated
      ) : (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: theme.tint,
            tabBarInactiveTintColor: theme.tabBarInactive,
            tabBarStyle: {
              backgroundColor: theme.tabBar,
              borderTopWidth: 1,
              borderTopColor: colorScheme === 'dark' ? '#38383A' : '#D1D1D6',
            },
            headerStyle: {
              backgroundColor: theme.background,
            },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              headerTitle: 'Password Manager',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? 'home' : 'home-outline'}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Generator',
              headerTitle: 'Password Generator',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? 'key' : 'key-outline'}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="stytchAPI"
            options={{
              title: 'Checker',
              headerTitle: 'Password Strength',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="biometrics"
            options={{
              title: 'Biometrics',
              headerTitle: 'Biometrics',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? 'finger-print' : 'finger-print-outline'}
                  color={color}
                />
              ),
            }}
          />

        </Tabs>
      )}
    </PasswordProvider>
  );
}
