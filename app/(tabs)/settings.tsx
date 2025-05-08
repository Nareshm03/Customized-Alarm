import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../context/SettingsContext';
import { StorageService } from '../../services/StorageService';
import { Alert } from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const systemIsDark = colorScheme === 'dark';

  const {
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
    isDarkMode
  } = useSettings();

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all alarms and settings? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAll();
              Alert.alert('Success', 'All data has been cleared. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
              console.error('Error clearing data:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#111827' : '#f9fafb' }
      ]}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B2CBF" />
          <Text style={[
            styles.loadingText,
            { color: isDarkMode ? '#d1d5db' : '#4b5563' }
          ]}>
            Loading settings...
          </Text>
        </View>
      ) : (
        <>
          <Text style={[
            styles.headerTitle,
            { color: isDarkMode ? '#f9fafb' : '#1f2937' }
          ]}>
            Settings
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDarkMode ? '#d1d5db' : '#4b5563' }
            ]}>
              Appearance
            </Text>
            <View
              style={[
                styles.settingItem,
                { borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb' }
              ]}
            >
              <View style={styles.settingLabelContainer}>
                {isDarkMode ? (
                  <Ionicons name="moon" size={20} color="#d1d5db" style={styles.settingIcon} />
                ) : (
                  <Ionicons name="sunny" size={20} color="#4b5563" style={styles.settingIcon} />
                )}
                <Text style={[
                  styles.settingLabel,
                  { color: isDarkMode ? '#f9fafb' : '#1f2937' }
                ]}>
                  Dark Mode
                </Text>
                {darkMode === null && (
                  <Text style={[
                    styles.systemSettingText,
                    { color: isDarkMode ? '#9ca3af' : '#6b7280' }
                  ]}>
                    (Using system setting)
                  </Text>
                )}
              </View>
              <Switch
                trackColor={{ false: isDarkMode ? '#374151' : '#e5e7eb', true: '#7B2CBF' }}
                thumbColor={isDarkMode ? '#ffffff' : isDarkMode ? '#6b7280' : '#9ca3af'}
                ios_backgroundColor={isDarkMode ? '#374151' : '#e5e7eb'}
                onValueChange={toggleDarkMode}
                value={isDarkMode}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDarkMode ? '#d1d5db' : '#4b5563' }
            ]}>
              Notifications
            </Text>
            <View
              style={[
                styles.settingItem,
                { borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb' }
              ]}
            >
              <View style={styles.settingLabelContainer}>
                <Ionicons name="notifications" size={20} color={isDarkMode ? '#d1d5db' : '#4b5563'} style={styles.settingIcon} />
                <Text style={[
                  styles.settingLabel,
                  { color: isDarkMode ? '#f9fafb' : '#1f2937' }
                ]}>
                  Enable Notifications
                </Text>
              </View>
              <Switch
                trackColor={{ false: isDarkMode ? '#374151' : '#e5e7eb', true: '#7B2CBF' }}
                thumbColor={notifications ? '#ffffff' : isDarkMode ? '#6b7280' : '#9ca3af'}
                ios_backgroundColor={isDarkMode ? '#374151' : '#e5e7eb'}
                onValueChange={toggleNotifications}
                value={notifications}
              />
            </View>
            <View
              style={[
                styles.settingItem,
                { borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb' }
              ]}
            >
              <View style={styles.settingLabelContainer}>
                <Ionicons name="time" size={20} color={isDarkMode ? '#d1d5db' : '#4b5563'} style={styles.settingIcon} />
                <Text style={[
                  styles.settingLabel,
                  { color: isDarkMode ? '#f9fafb' : '#1f2937' }
                ]}>
                  5-Minute Early Reminders
                </Text>
              </View>
              <Switch
                trackColor={{ false: isDarkMode ? '#374151' : '#e5e7eb', true: '#7B2CBF' }}
                thumbColor={earlyReminders ? '#ffffff' : isDarkMode ? '#6b7280' : '#9ca3af'}
                ios_backgroundColor={isDarkMode ? '#374151' : '#e5e7eb'}
                onValueChange={toggleEarlyReminders}
                value={earlyReminders}
              />
            </View>
            <View
              style={[
                styles.settingItem,
                { borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb' }
              ]}
            >
              <View style={styles.settingLabelContainer}>
                <Ionicons name="phone-portrait" size={20} color={isDarkMode ? '#d1d5db' : '#4b5563'} style={styles.settingIcon} />
                <Text style={[
                  styles.settingLabel,
                  { color: isDarkMode ? '#f9fafb' : '#1f2937' }
                ]}>
                  Vibration
                </Text>
              </View>
              <Switch
                trackColor={{ false: isDarkMode ? '#374151' : '#e5e7eb', true: '#7B2CBF' }}
                thumbColor={vibration ? '#ffffff' : isDarkMode ? '#6b7280' : '#9ca3af'}
                ios_backgroundColor={isDarkMode ? '#374151' : '#e5e7eb'}
                onValueChange={toggleVibration}
                value={vibration}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDarkMode ? '#d1d5db' : '#4b5563' }
            ]}>
              Data
            </Text>
            <TouchableOpacity
              style={[
                styles.settingItem,
                { borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb' }
              ]}
              onPress={clearAllData}
            >
              <View style={styles.settingLabelContainer}>
                <Ionicons name="log-out" size={20} color="#EF4444" style={styles.settingIcon} />
                <Text style={[
                  styles.settingLabel,
                  { color: '#EF4444' }
                ]}>
                  Clear All Data
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDarkMode ? '#d1d5db' : '#4b5563' }
            ]}>
              About
            </Text>
            <View
              style={[
                styles.settingItem,
                { borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb' }
              ]}
            >
              <View style={styles.settingLabelContainer}>
                <Ionicons name="information-circle" size={20} color={isDarkMode ? '#d1d5db' : '#4b5563'} style={styles.settingIcon} />
                <Text style={[
                  styles.settingLabel,
                  { color: isDarkMode ? '#f9fafb' : '#1f2937' }
                ]}>
                  App Version
                </Text>
              </View>
              <Text style={[
                styles.settingValue,
                { color: isDarkMode ? '#9ca3af' : '#6b7280' }
              ]}>
                1.0.0
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  systemSettingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 8,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#EF4444',
  },
});