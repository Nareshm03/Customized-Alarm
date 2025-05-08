import { NotificationService } from './NotificationService';
import { StorageService } from './StorageService';
import { Alarm } from '../types/Alarm';

export class AlarmService {
  // Create a new alarm
  static async createAlarm(alarm: Alarm): Promise<Alarm> {
    try {
      // Save the alarm to storage
      const newAlarm = await StorageService.addAlarm(alarm);
      
      // Schedule notifications if the alarm is active
      if (newAlarm.isActive) {
        await this.scheduleAlarmNotifications(newAlarm);
      }
      
      return newAlarm;
    } catch (error) {
      console.error('Error creating alarm:', error);
      throw error;
    }
  }

  // Update an existing alarm
  static async updateAlarm(alarm: Alarm): Promise<void> {
    try {
      // Cancel existing notifications for this alarm
      await NotificationService.cancelAlarmNotifications(alarm.id);
      
      // Update the alarm in storage
      await StorageService.updateAlarm(alarm);
      
      // Schedule new notifications if the alarm is active
      if (alarm.isActive) {
        await this.scheduleAlarmNotifications(alarm);
      }
    } catch (error) {
      console.error('Error updating alarm:', error);
      throw error;
    }
  }

  // Delete an alarm
  static async deleteAlarm(id: number): Promise<void> {
    try {
      // Cancel notifications for this alarm
      await NotificationService.cancelAlarmNotifications(id);
      
      // Delete the alarm from storage
      await StorageService.deleteAlarm(id);
    } catch (error) {
      console.error('Error deleting alarm:', error);
      throw error;
    }
  }

  // Toggle alarm active status
  static async toggleAlarmActive(id: number): Promise<Alarm> {
    try {
      // Update the alarm in storage
      const updatedAlarm = await StorageService.toggleAlarmActive(id);
      
      // Cancel existing notifications
      await NotificationService.cancelAlarmNotifications(id);
      
      // Schedule new notifications if the alarm is now active
      if (updatedAlarm.isActive) {
        await this.scheduleAlarmNotifications(updatedAlarm);
      }
      
      return updatedAlarm;
    } catch (error) {
      console.error('Error toggling alarm active status:', error);
      throw error;
    }
  }

  // Get all alarms
  static async getAlarms(): Promise<Alarm[]> {
    return await StorageService.getAlarms();
  }

  // Schedule notifications for an alarm
  private static async scheduleAlarmNotifications(alarm: Alarm): Promise<void> {
    try {
      // Get app settings
      const settings = await StorageService.getSettings();
      
      // Schedule the main alarm notification
      await NotificationService.scheduleAlarmNotification(alarm);
      
      // Schedule early reminder if enabled in settings
      if (settings.earlyReminders) {
        await NotificationService.scheduleEarlyReminder(alarm);
      }
    } catch (error) {
      console.error('Error scheduling alarm notifications:', error);
      throw error;
    }
  }

  // Initialize the alarm service
  static async initialize(): Promise<void> {
    try {
      // Request notification permissions
      const permissionGranted = await NotificationService.requestPermissions();
      
      if (permissionGranted) {
        // Get all alarms
        const alarms = await StorageService.getAlarms();
        
        // Cancel all existing notifications
        for (const alarm of alarms) {
          await NotificationService.cancelAlarmNotifications(alarm.id);
        }
        
        // Reschedule notifications for active alarms
        for (const alarm of alarms) {
          if (alarm.isActive) {
            await this.scheduleAlarmNotifications(alarm);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing alarm service:', error);
    }
  }
}