import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { requestNotificationPermissions } from '@/utils/notificationUtils';

export default function RootLayout() {
  useFrameworkReady();
  
  // Request notification permissions when the app starts
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await requestNotificationPermissions();
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    };
    
    requestPermissions();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
