import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { StorageService } from '../services/StorageService';

type SettingsContextType = {
  darkMode: boolean | null; // null means use system setting
  notifications: boolean;
  earlyReminders: boolean;
  vibration: boolean;
  loading: boolean;
  error: string | null;
  toggleDarkMode: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
  toggleEarlyReminders: () => Promise<void>;
  toggleVibration: () => Promise<void>;
  isDarkMode: boolean; // Computed value based on darkMode and system setting
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [earlyReminders, setEarlyReminders] = useState<boolean>(true);
  const [vibration, setVibration] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Computed property for dark mode
  const isDarkMode = darkMode === null ? systemColorScheme === 'dark' : darkMode;

  // Load settings on initial render
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const settings = await StorageService.getSettings();
        setDarkMode(settings.darkMode);
        setNotifications(settings.notifications);
        setEarlyReminders(settings.earlyReminders);
        setVibration(settings.vibration);
        setError(null);
      } catch (err) {
        setError('Failed to load settings');
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage
  const saveSettings = async () => {
    try {
      await StorageService.saveSettings({
        darkMode,
        notifications,
        earlyReminders,
        vibration,
      });
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = async () => {
    try {
      // If currently using system setting, set to opposite of system
      const newValue = darkMode === null ? !(systemColorScheme === 'dark') : !darkMode;
      setDarkMode(newValue);
      await StorageService.saveSettings({
        darkMode: newValue,
        notifications,
        earlyReminders,
        vibration,
      });
    } catch (err) {
      setError('Failed to toggle dark mode');
      console.error('Error toggling dark mode:', err);
    }
  };

  // Toggle notifications
  const toggleNotifications = async () => {
    try {
      setNotifications(!notifications);
      await StorageService.saveSettings({
        darkMode,
        notifications: !notifications,
        earlyReminders,
        vibration,
      });
    } catch (err) {
      setError('Failed to toggle notifications');
      console.error('Error toggling notifications:', err);
    }
  };

  // Toggle early reminders
  const toggleEarlyReminders = async () => {
    try {
      setEarlyReminders(!earlyReminders);
      await StorageService.saveSettings({
        darkMode,
        notifications,
        earlyReminders: !earlyReminders,
        vibration,
      });
    } catch (err) {
      setError('Failed to toggle early reminders');
      console.error('Error toggling early reminders:', err);
    }
  };

  // Toggle vibration
  const toggleVibration = async () => {
    try {
      setVibration(!vibration);
      await StorageService.saveSettings({
        darkMode,
        notifications,
        earlyReminders,
        vibration: !vibration,
      });
    } catch (err) {
      setError('Failed to toggle vibration');
      console.error('Error toggling vibration:', err);
    }
  };

  // Save settings when they change
  useEffect(() => {
    if (!loading) {
      saveSettings();
    }
  }, [darkMode, notifications, earlyReminders, vibration]);

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        notifications,
        earlyReminders,
        vibration,
        loading,
        error,
        toggleDarkMode,
        toggleNotifications,
        toggleEarlyReminders,
        toggleVibration,
        isDarkMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};