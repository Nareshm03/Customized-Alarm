import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Alarm } from '../types/Alarm';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  // Request permission to send notifications
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for notification!');
      return false;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7B2CBF',
      });
    }

    return true;
  }

  // Schedule a notification for an alarm
  static async scheduleAlarmNotification(alarm: Alarm) {
    // Parse time string to get hours and minutes
    const [time, period] = alarm.time.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    // Create a Date object for the alarm time
    const scheduledTime = new Date();
    
    // If the alarm is for specific days of the week
    if (alarm.days && alarm.days.length > 0) {
      // Map day abbreviations to day numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap: { [key: string]: number } = {
        'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
      };
      
      // Schedule notifications for each day
      const notificationIds = [];
      
      for (const day of alarm.days) {
        const dayNumber = dayMap[day];
        const currentDay = scheduledTime.getDay();
        let daysToAdd = dayNumber - currentDay;
        
        if (daysToAdd < 0) {
          daysToAdd += 7;
        }
        
        const notificationDate = new Date();
        notificationDate.setDate(scheduledTime.getDate() + daysToAdd);
        notificationDate.setHours(hours, minutes, 0, 0);
        
        // If the time has already passed today, schedule for next week
        if (notificationDate < new Date()) {
          notificationDate.setDate(notificationDate.getDate() + 7);
        }
        
        const id = await this.scheduleNotification({
          title: `Class Alarm: ${alarm.subject}`,
          body: `${alarm.subject} in ${alarm.classroom} starts soon!`,
          data: { alarmId: alarm.id },
          trigger: notificationDate,
          repeats: true,
        });
        
        notificationIds.push(id);
      }
      
      return notificationIds;
    } else {
      // For one-time alarms
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      return this.scheduleNotification({
        title: `Class Alarm: ${alarm.subject}`,
        body: `${alarm.subject} in ${alarm.classroom} starts soon!`,
        data: { alarmId: alarm.id },
        trigger: scheduledTime,
      });
    }
  }

  // Schedule an early reminder (5 minutes before the alarm)
  static async scheduleEarlyReminder(alarm: Alarm) {
    // Parse time string to get hours and minutes
    const [time, period] = alarm.time.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    // Create a Date object for 5 minutes before the alarm time
    const scheduledTime = new Date();
    
    // If the alarm is for specific days of the week
    if (alarm.days && alarm.days.length > 0) {
      // Map day abbreviations to day numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap: { [key: string]: number } = {
        'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
      };
      
      // Schedule early reminders for each day
      const notificationIds = [];
      
      for (const day of alarm.days) {
        const dayNumber = dayMap[day];
        const currentDay = scheduledTime.getDay();
        let daysToAdd = dayNumber - currentDay;
        
        if (daysToAdd < 0) {
          daysToAdd += 7;
        }
        
        const notificationDate = new Date();
        notificationDate.setDate(scheduledTime.getDate() + daysToAdd);
        
        // Set time to 5 minutes before the alarm
        let earlyMinutes = minutes - 5;
        let earlyHours = hours;
        
        if (earlyMinutes < 0) {
          earlyMinutes += 60;
          earlyHours -= 1;
          
          if (earlyHours < 0) {
            earlyHours = 23;
            notificationDate.setDate(notificationDate.getDate() - 1);
          }
        }
        
        notificationDate.setHours(earlyHours, earlyMinutes, 0, 0);
        
        // If the time has already passed today, schedule for next week
        if (notificationDate < new Date()) {
          notificationDate.setDate(notificationDate.getDate() + 7);
        }
        
        const id = await this.scheduleNotification({
          title: `5-Minute Reminder: ${alarm.subject}`,
          body: `${alarm.subject} in ${alarm.classroom} starts in 5 minutes!`,
          data: { alarmId: alarm.id, isEarlyReminder: true },
          trigger: notificationDate,
          repeats: true,
        });
        
        notificationIds.push(id);
      }
      
      return notificationIds;
    } else {
      // For one-time alarms
      // Set time to 5 minutes before the alarm
      let earlyMinutes = minutes - 5;
      let earlyHours = hours;
      
      if (earlyMinutes < 0) {
        earlyMinutes += 60;
        earlyHours -= 1;
        
        if (earlyHours < 0) {
          earlyHours = 23;
          scheduledTime.setDate(scheduledTime.getDate() - 1);
        }
      }
      
      scheduledTime.setHours(earlyHours, earlyMinutes, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      return this.scheduleNotification({
        title: `5-Minute Reminder: ${alarm.subject}`,
        body: `${alarm.subject} in ${alarm.classroom} starts in 5 minutes!`,
        data: { alarmId: alarm.id, isEarlyReminder: true },
        trigger: scheduledTime,
      });
    }
  }

  // Cancel all notifications for an alarm
  static async cancelAlarmNotifications(alarmId: number) {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      const data = notification.content.data as { alarmId?: number };
      
      if (data.alarmId === alarmId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  // Helper method to schedule a notification
  private static async scheduleNotification({
    title,
    body,
    data,
    trigger,
    repeats = false,
  }: {
    title: string;
    body: string;
    data: any;
    trigger: Date | number;
    repeats?: boolean;
  }) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: typeof trigger === 'number'
        ? { seconds: trigger }
        : {
            hour: trigger.getHours(),
            minute: trigger.getMinutes(),
            repeats: repeats,
          },
    });
  }
}