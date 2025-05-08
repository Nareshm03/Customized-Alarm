// Use mock implementation for development
import AsyncStorage from './MockAsyncStorage';
import { Alarm } from '../types/Alarm';

const ALARMS_STORAGE_KEY = '@ClassAlarm:alarms';
const SETTINGS_STORAGE_KEY = '@ClassAlarm:settings';

export class StorageService {
  // Save alarms to AsyncStorage
  static async saveAlarms(alarms: Alarm[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(alarms);
      await AsyncStorage.setItem(ALARMS_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving alarms:', error);
      throw error;
    }
  }

  // Get alarms from AsyncStorage
  static async getAlarms(): Promise<Alarm[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error getting alarms:', error);
      return [];
    }
  }

  // Add a new alarm
  static async addAlarm(alarm: Alarm): Promise<Alarm> {
    try {
      const alarms = await this.getAlarms();
      
      // Generate a new ID (use the current timestamp or find the max ID and increment)
      const newId = alarms.length > 0 
        ? Math.max(...alarms.map(a => a.id)) + 1 
        : 1;
      
      const newAlarm = { ...alarm, id: newId };
      alarms.push(newAlarm);
      
      await this.saveAlarms(alarms);
      return newAlarm;
    } catch (error) {
      console.error('Error adding alarm:', error);
      throw error;
    }
  }

  // Update an existing alarm
  static async updateAlarm(updatedAlarm: Alarm): Promise<void> {
    try {
      const alarms = await this.getAlarms();
      const index = alarms.findIndex(alarm => alarm.id === updatedAlarm.id);
      
      if (index !== -1) {
        alarms[index] = updatedAlarm;
        await this.saveAlarms(alarms);
      } else {
        throw new Error(`Alarm with ID ${updatedAlarm.id} not found`);
      }
    } catch (error) {
      console.error('Error updating alarm:', error);
      throw error;
    }
  }

  // Delete an alarm
  static async deleteAlarm(id: number): Promise<void> {
    try {
      const alarms = await this.getAlarms();
      const filteredAlarms = alarms.filter(alarm => alarm.id !== id);
      
      if (filteredAlarms.length < alarms.length) {
        await this.saveAlarms(filteredAlarms);
      } else {
        throw new Error(`Alarm with ID ${id} not found`);
      }
    } catch (error) {
      console.error('Error deleting alarm:', error);
      throw error;
    }
  }

  // Toggle alarm active status
  static async toggleAlarmActive(id: number): Promise<Alarm> {
    try {
      const alarms = await this.getAlarms();
      const index = alarms.findIndex(alarm => alarm.id === id);
      
      if (index !== -1) {
        alarms[index].isActive = !alarms[index].isActive;
        await this.saveAlarms(alarms);
        return alarms[index];
      } else {
        throw new Error(`Alarm with ID ${id} not found`);
      }
    } catch (error) {
      console.error('Error toggling alarm active status:', error);
      throw error;
    }
  }

  // Save app settings
  static async saveSettings(settings: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  // Get app settings
  static async getSettings(): Promise<any> {
    try {
      const jsonValue = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : {
        darkMode: null, // null means use system setting
        notifications: true,
        earlyReminders: true,
        vibration: true,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        darkMode: null,
        notifications: true,
        earlyReminders: true,
        vibration: true,
      };
    }
  }

  // Clear all data (for testing or reset)
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}