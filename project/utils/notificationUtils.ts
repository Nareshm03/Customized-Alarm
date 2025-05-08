import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications with custom settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

const NOTIFICATION_STORAGE_KEY = 'scheduled_notifications';

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return true;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Store notification in AsyncStorage for persistence
 */
async function storeNotification(id: string, data: any) {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const notifications = stored ? JSON.parse(stored) : {};
    notifications[id] = data;
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error storing notification:', error);
  }
}

/**
 * Remove notification from AsyncStorage
 */
async function removeStoredNotification(id: string) {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (stored) {
      const notifications = JSON.parse(stored);
      delete notifications[id];
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    }
  } catch (error) {
    console.error('Error removing notification:', error);
  }
}

/**
 * Schedule a notification with improved handling
 */
export async function scheduleNotification({
  id,
  title,
  body,
  data,
  trigger,
  sound = 'default',
}: {
  id: string;
  title: string;
  body: string;
  data?: any;
  trigger: Date | number;
  sound?: string;
}): Promise<string> {
  if (Platform.OS === 'web') {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        tag: id,
      });
      return id;
    }
    return id;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    throw new Error('No notification permission');
  }

  // Cancel any existing notification with the same ID
  await cancelNotification(id);

  // Ensure trigger is properly formatted
  let triggerConfig;
  
  if (typeof trigger === 'number') {
    triggerConfig = { seconds: trigger };
  } else {
    // Make sure the date is in the future
    const now = new Date();
    const triggerDate = new Date(trigger);
    
    if (triggerDate <= now) {
      console.warn('Notification date is in the past, adjusting to now + 5 seconds');
      triggerDate.setTime(now.getTime() + 5000); // Set to 5 seconds from now
    }
    
    triggerConfig = {
      date: triggerDate,
      repeats: false,
    };
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound,
      badge: 1,
      priority: 'high',
    },
    trigger: triggerConfig,
    identifier: id,
  });

  // Store notification data for persistence
  await storeNotification(id, {
    title,
    body,
    data,
    trigger,
    sound,
    scheduledTime: new Date().toISOString(),
  });

  return notificationId;
}

/**
 * Cancel a notification with improved cleanup
 */
export async function cancelNotification(id: string): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(id);
  await removeStoredNotification(id);
}

/**
 * Set up notification listeners with improved handling
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void,
  onError?: (error: Error) => void
) {
  if (Platform.OS === 'web') {
    return {
      remove: () => {},
    };
  }

  const receivedListener = Notifications.addNotificationReceivedListener(notification => {
    try {
      console.log('Notification received:', notification);
      onNotificationReceived?.(notification);
    } catch (error) {
      console.error('Error in notification received handler:', error);
      onError?.(error as Error);
    }
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    try {
      console.log('Notification response received:', response);
      onNotificationResponse?.(response);
    } catch (error) {
      console.error('Error in notification response handler:', error);
      onError?.(error as Error);
    }
  });

  // Background notification handling is managed by Expo automatically
  // No need to register a task manually for basic notification handling

  return {
    remove: () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    },
  };
}

/**
 * Reschedule all stored notifications (useful after app restart)
 */
export async function rescheduleStoredNotifications() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (stored) {
      const notifications = JSON.parse(stored);
      for (const [id, data] of Object.entries(notifications)) {
        await scheduleNotification({
          id,
          ...(data as any),
        });
      }
    }
  } catch (error) {
    console.error('Error rescheduling notifications:', error);
  }
}