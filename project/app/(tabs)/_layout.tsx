import React from 'react';
import { Tabs } from 'expo-router';
import { Bell, Clock, CirclePlus as PlusCircle, Settings, Chrome as Home } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@expo-google-fonts/inter').Inter_400Regular,
    'Inter-Bold': require('@expo-google-fonts/inter').Inter_700Bold,
  });

  // Prevent splash screen from auto-hiding
  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#7B2CBF',
          tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
          tabBarStyle: {
            backgroundColor: isDark ? '#1f2937' : '#fff',
            borderTopColor: isDark ? '#374151' : '#e5e7eb',
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
          },
          headerStyle: {
            backgroundColor: isDark ? '#1f2937' : '#fff',
            borderBottomColor: isDark ? '#374151' : '#e5e7eb',
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            fontFamily: 'Inter-Bold',
            color: isDark ? '#f9fafb' : '#1f2937',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="alarms"
          options={{
            title: 'Alarms',
            tabBarIcon: ({ color, size }) => (
              <Bell size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarIcon: ({ color, size }) => (
              <PlusCircle size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ color, size }) => (
              <Clock size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}