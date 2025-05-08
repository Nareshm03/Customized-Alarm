import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm } from '@/types/Alarm';
import { 
  scheduleNotification, 
  cancelNotification, 
  rescheduleStoredNotifications,
  requestNotificationPermissions 
} from '@/utils/notificationUtils';

const STORAGE_KEY = 'alarms';

class AlarmService {
  constructor() {
    // Reschedule notifications when service is initialized
    this.initializeAlarms();
  }

  private async initializeAlarms() {
    try {
      // First check if we have notification permissions
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        console.log('Notification permissions not granted, skipping alarm initialization');
        return;
      }
      
      const alarms = await this.getAlarms();
      for (const alarm of alarms) {
        if (alarm.isActive) {
          await this.scheduleAlarmNotifications(alarm);
        }
      }
      // Reschedule any stored notifications
      await rescheduleStoredNotifications();
    } catch (error) {
      console.error('Error initializing alarms:', error);
    }
  }

  async getAlarms(): Promise<Alarm[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching alarms:', error);
      return [];
    }
  }

  async getAlarmById(id: string): Promise<Alarm | null> {
    try {
      const alarms = await this.getAlarms();
      return alarms.find(alarm => alarm.id === id) || null;
    } catch (error) {
      console.error('Error fetching alarm by ID:', error);
      return null;
    }
  }

  async createAlarm(alarmData: Omit<Alarm, 'id'>): Promise<Alarm> {
    try {
      const alarms = await this.getAlarms();
      
      const id = Date.now().toString();
      const newAlarm: Alarm = {
        id,
        ...alarmData
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...alarms, newAlarm]));
      
      if (newAlarm.isActive) {
        await this.scheduleAlarmNotifications(newAlarm);
      }
      
      return newAlarm;
    } catch (error) {
      console.error('Error creating alarm:', error);
      throw error;
    }
  }

  async updateAlarm(updatedAlarm: Alarm): Promise<Alarm> {
    try {
      const alarms = await this.getAlarms();
      const index = alarms.findIndex(alarm => alarm.id === updatedAlarm.id);
      
      if (index === -1) {
        throw new Error('Alarm not found');
      }
      
      // Cancel existing notifications
      await this.cancelAlarmNotifications(alarms[index]);
      
      // Update the alarm
      alarms[index] = updatedAlarm;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
      
      // Schedule new notifications if alarm is active
      if (updatedAlarm.isActive) {
        await this.scheduleAlarmNotifications(updatedAlarm);
      }
      
      return updatedAlarm;
    } catch (error) {
      console.error('Error updating alarm:', error);
      throw error;
    }
  }

  async deleteAlarm(id: string): Promise<void> {
    try {
      const alarms = await this.getAlarms();
      const alarmToDelete = alarms.find(alarm => alarm.id === id);
      
      if (alarmToDelete) {
        await this.cancelAlarmNotifications(alarmToDelete);
        const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlarms));
      }
    } catch (error) {
      console.error('Error deleting alarm:', error);
      throw error;
    }
  }

  private async scheduleAlarmNotifications(alarm: Alarm): Promise<void> {
    try {
      const alarmTime = new Date(alarm.time);
      const now = new Date();
      
      // Only schedule if the alarm time is in the future
      if (alarmTime > now) {
        // Schedule main notification
        await scheduleNotification({
          id: alarm.id,
          title: alarm.subject,
          body: `Class in ${alarm.classroom} is starting now!`,
          data: { alarmId: alarm.id },
          trigger: alarmTime,
          sound: alarm.sound || 'default',
        });
        
        // Schedule early notification if enabled and if there's enough time
        if (alarm.notifyBefore) {
          const earlyTime = new Date(alarmTime.getTime() - 5 * 60 * 1000); // 5 minutes before
          
          // Only schedule early notification if it's in the future
          if (earlyTime > now) {
            await scheduleNotification({
              id: `${alarm.id}-early`,
              title: `${alarm.subject} in 5 minutes`,
              body: `Prepare for your class in ${alarm.classroom}`,
              data: { alarmId: alarm.id },
              trigger: earlyTime,
              sound: 'default',
            });
          } else {
            console.log('Early notification time is in the past, skipping');
          }
        }
      } else {
        console.log('Alarm time is in the past, skipping notification scheduling');
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  private async cancelAlarmNotifications(alarm: Alarm): Promise<void> {
    try {
      await cancelNotification(alarm.id);
      await cancelNotification(`${alarm.id}-early`);
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }
}

export default new AlarmService();