import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Mock data for schedule
  const scheduleData = {
    'Monday': [
      { id: 1, subject: 'Mathematics', classroom: 'Room 101', startTime: '09:00 AM', endTime: '10:30 AM', color: '#FF5733' },
      { id: 2, subject: 'Physics', classroom: 'Room 203', startTime: '11:00 AM', endTime: '12:30 PM', color: '#33A8FF' },
      { id: 3, subject: 'Lunch Break', classroom: 'Cafeteria', startTime: '12:30 PM', endTime: '01:30 PM', color: '#9ca3af' },
      { id: 4, subject: 'Chemistry', classroom: 'Lab 3', startTime: '01:30 PM', endTime: '03:00 PM', color: '#33FF57' },
    ],
    'Tuesday': [
      { id: 5, subject: 'History', classroom: 'Room 105', startTime: '10:00 AM', endTime: '11:30 AM', color: '#F3FF33' },
      { id: 6, subject: 'Lunch Break', classroom: 'Cafeteria', startTime: '11:30 AM', endTime: '12:30 PM', color: '#9ca3af' },
      { id: 7, subject: 'English', classroom: 'Room 302', startTime: '12:30 PM', endTime: '02:00 PM', color: '#FF33A8' },
    ],
    'Wednesday': [
      { id: 8, subject: 'Mathematics', classroom: 'Room 101', startTime: '09:00 AM', endTime: '10:30 AM', color: '#FF5733' },
      { id: 9, subject: 'Computer Science', classroom: 'Lab 1', startTime: '11:00 AM', endTime: '12:30 PM', color: '#7B2CBF' },
      { id: 10, subject: 'Lunch Break', classroom: 'Cafeteria', startTime: '12:30 PM', endTime: '01:30 PM', color: '#9ca3af' },
      { id: 11, subject: 'Physics', classroom: 'Room 203', startTime: '01:30 PM', endTime: '03:00 PM', color: '#33A8FF' },
    ],
    'Thursday': [
      { id: 12, subject: 'Chemistry', classroom: 'Lab 3', startTime: '10:00 AM', endTime: '11:30 AM', color: '#33FF57' },
      { id: 13, subject: 'Lunch Break', classroom: 'Cafeteria', startTime: '11:30 AM', endTime: '12:30 PM', color: '#9ca3af' },
      { id: 14, subject: 'English', classroom: 'Room 302', startTime: '12:30 PM', endTime: '02:00 PM', color: '#FF33A8' },
    ],
    'Friday': [
      { id: 15, subject: 'Mathematics', classroom: 'Room 101', startTime: '09:00 AM', endTime: '10:30 AM', color: '#FF5733' },
      { id: 16, subject: 'History', classroom: 'Room 105', startTime: '11:00 AM', endTime: '12:30 PM', color: '#F3FF33' },
      { id: 17, subject: 'Lunch Break', classroom: 'Cafeteria', startTime: '12:30 PM', endTime: '01:30 PM', color: '#9ca3af' },
      { id: 18, subject: 'Computer Science', classroom: 'Lab 1', startTime: '01:30 PM', endTime: '03:00 PM', color: '#7B2CBF' },
    ],
  };

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#111827' : '#f9fafb' }
      ]}
    >
      <Text style={[
        styles.headerTitle, 
        { color: isDark ? '#f9fafb' : '#1f2937' }
      ]}>
        Weekly Schedule
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton,
              { 
                backgroundColor: selectedDay === day 
                  ? '#7B2CBF' 
                  : isDark ? '#1f2937' : '#ffffff',
                borderColor: isDark ? '#374151' : '#e5e7eb',
              }
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text 
              style={[
                styles.dayButtonText,
                { 
                  color: selectedDay === day 
                    ? '#ffffff' 
                    : isDark ? '#d1d5db' : '#4b5563' 
                }
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scheduleContainer}>
        {scheduleData[selectedDay].map((item) => (
          <View 
            key={item.id}
            style={[
              styles.scheduleItem,
              { 
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                borderLeftColor: item.color,
              }
            ]}
          >
            <View style={styles.scheduleTimeContainer}>
              <Text style={[
                styles.scheduleTime,
                { color: isDark ? '#9ca3af' : '#6b7280' }
              ]}>
                {item.startTime}
              </Text>
              <Text style={[
                styles.scheduleTimeSeparator,
                { color: isDark ? '#6b7280' : '#9ca3af' }
              ]}>
                |
              </Text>
              <Text style={[
                styles.scheduleTime,
                { color: isDark ? '#9ca3af' : '#6b7280' }
              ]}>
                {item.endTime}
              </Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={[
                styles.scheduleSubject,
                { color: isDark ? '#f9fafb' : '#1f2937' }
              ]}>
                {item.subject}
              </Text>
              <Text style={[
                styles.scheduleClassroom,
                { color: isDark ? '#9ca3af' : '#6b7280' }
              ]}>
                {item.classroom}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
    marginBottom: 16,
  },
  daySelector: {
    marginBottom: 16,
  },
  daySelectorContent: {
    paddingRight: 16,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  selectedDayButton: {
    borderWidth: 0,
  },
  dayButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  scheduleContainer: {
    flex: 1,
  },
  scheduleItem: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleTimeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  scheduleTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  scheduleTimeSeparator: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleSubject: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  scheduleClassroom: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});