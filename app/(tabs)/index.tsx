import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlarms } from '@/context/AlarmContext';
import { router } from 'expo-router';
import { Alarm } from '@/types/Alarm';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { alarms, loading, error, refreshAlarms } = useAlarms();
  const [upcomingAlarms, setUpcomingAlarms] = useState<(Alarm & { date: string })[]>([]);

  // Process alarms to get upcoming ones
  useEffect(() => {
    if (alarms.length > 0) {
      // Get today's day of week
      const today = new Date();
      const todayDayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()];

      // Get tomorrow's day of week
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowDayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][tomorrow.getDay()];

      // Filter alarms for today and tomorrow
      const upcoming = alarms
        .filter(alarm => alarm.isActive && alarm.days)
        .map(alarm => {
          if (alarm.days?.includes(todayDayOfWeek)) {
            return { ...alarm, date: 'Today' };
          } else if (alarm.days?.includes(tomorrowDayOfWeek)) {
            return { ...alarm, date: 'Tomorrow' };
          }
          return null;
        })
        .filter(alarm => alarm !== null)
        .slice(0, 3) as (Alarm & { date: string })[];

      setUpcomingAlarms(upcoming);
    } else {
      setUpcomingAlarms([]);
    }
  }, [alarms]);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#f9fafb' }
      ]}
    >
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#f9fafb' : '#1f2937' }
          ]}>
            Welcome to ClassAlarm
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#9ca3af' : '#4b5563' }
          ]}>
            Your upcoming class alarms
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshAlarms}
          disabled={loading}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={isDark ? '#d1d5db' : '#4b5563'}
            style={loading ? styles.rotating : undefined}
          />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refreshAlarms}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B2CBF" />
          <Text style={[
            styles.loadingText,
            { color: isDark ? '#d1d5db' : '#4b5563' }
          ]}>
            Loading alarms...
          </Text>
        </View>
      ) : (
        <View style={styles.alarmsContainer}>
          {upcomingAlarms.length > 0 ? (
            upcomingAlarms.map((alarm) => (
              <TouchableOpacity
                key={alarm.id}
                style={[
                  styles.alarmCard,
                  { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
                ]}
                onPress={() => router.push('/(tabs)/alarms')}
              >
                <View style={[styles.colorIndicator, { backgroundColor: alarm.color }]} />
                <View style={styles.alarmInfo}>
                  <Text style={[
                    styles.subjectText,
                    { color: isDark ? '#f9fafb' : '#1f2937' }
                  ]}>
                    {alarm.subject}
                  </Text>
                  <Text style={[
                    styles.classroomText,
                    { color: isDark ? '#9ca3af' : '#4b5563' }
                  ]}>
                    {alarm.classroom}
                  </Text>
                  <View style={styles.timeContainer}>
                    <Text style={[
                      styles.dateText,
                      { color: isDark ? '#d1d5db' : '#6b7280' }
                    ]}>
                      {alarm.date}
                    </Text>
                    <Text style={[
                      styles.timeText,
                      { color: isDark ? '#d1d5db' : '#6b7280' }
                    ]}>
                      {alarm.time}
                    </Text>
                  </View>
                </View>
                <Ionicons name="notifications" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications" size={64} color={isDark ? '#4b5563' : '#9ca3af'} />
              <Text style={[
                styles.emptyText,
                { color: isDark ? '#9ca3af' : '#4b5563' }
              ]}>
                No upcoming alarms
              </Text>
              <Text style={[
                styles.emptySubtext,
                { color: isDark ? '#6b7280' : '#6b7280' }
              ]}>
                Create your first class alarm to get started
              </Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.createButton,
          { backgroundColor: '#7B2CBF' }
        ]}
        onPress={() => router.push('/(tabs)/create')}
      >
        <Text style={styles.createButtonText}>Create New Alarm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  header: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  refreshButton: {
    padding: 8,
  },
  rotating: {
    transform: [{ rotate: '45deg' }],
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#B91C1C',
  },
  retryText: {
    color: '#7B2CBF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  alarmsContainer: {
    marginBottom: 24,
  },
  alarmCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  alarmInfo: {
    flex: 1,
  },
  subjectText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  classroomText: {
    fontSize: 14,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  createButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});