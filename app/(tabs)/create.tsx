import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAlarms } from '../../context/AlarmContext';
import { router } from 'expo-router';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { createAlarm, loading } = useAlarms();

  const [subject, setSubject] = useState('');
  const [classroom, setClassroom] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [earlyNotification, setEarlyNotification] = useState(true);
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState('#7B2CBF');
  const [selectedDays, setSelectedDays] = useState([]);

  const colors = [
    '#7B2CBF', // Purple (default)
    '#FF5733', // Red
    '#33A8FF', // Blue
    '#33FF57', // Green
    '#F3FF33', // Yellow
    '#FF33A8', // Pink
  ];

  const days = [
    { id: 'Mon', label: 'Monday' },
    { id: 'Tue', label: 'Tuesday' },
    { id: 'Wed', label: 'Wednesday' },
    { id: 'Thu', label: 'Thursday' },
    { id: 'Fri', label: 'Friday' },
    { id: 'Sat', label: 'Saturday' },
    { id: 'Sun', label: 'Sunday' },
  ];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveAlarm = async () => {
    // Validate form
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject name');
      return;
    }

    if (!classroom.trim()) {
      Alert.alert('Error', 'Please enter a classroom');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    try {
      // Create new alarm object
      const newAlarm = {
        id: 0, // This will be set by the AlarmService
        subject: subject.trim(),
        classroom: classroom.trim(),
        time: formatTime(time),
        days: selectedDays,
        color: selectedColor,
        isActive: true,
        notes: notes.trim() || undefined,
      };

      // Save the alarm
      await createAlarm(newAlarm);

      // Navigate back to alarms tab
      router.push('/(tabs)/alarms');
    } catch (error) {
      Alert.alert('Error', 'Failed to create alarm. Please try again.');
      console.error('Error creating alarm:', error);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#f9fafb' }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[
        styles.headerTitle,
        { color: isDark ? '#f9fafb' : '#1f2937' }
      ]}>
        Create New Alarm
      </Text>

      <View style={styles.formGroup}>
        <Text style={[
          styles.label,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Subject
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#f9fafb' : '#1f2937',
              borderColor: isDark ? '#374151' : '#e5e7eb',
            }
          ]}
          placeholder="Enter subject name"
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[
          styles.label,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Classroom
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#f9fafb' : '#1f2937',
              borderColor: isDark ? '#374151' : '#e5e7eb',
            }
          ]}
          placeholder="Enter classroom"
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          value={classroom}
          onChangeText={setClassroom}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[
          styles.label,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Days
        </Text>
        <View style={styles.daysContainer}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dayButton,
                {
                  backgroundColor: selectedDays.includes(day.id)
                    ? '#7B2CBF'
                    : isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                }
              ]}
              onPress={() => toggleDay(day.id)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  {
                    color: selectedDays.includes(day.id)
                      ? '#ffffff'
                      : isDark ? '#d1d5db' : '#4b5563'
                  }
                ]}
              >
                {day.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[
          styles.label,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Time
        </Text>
        <TouchableOpacity
          style={[
            styles.dateTimeButton,
            {
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              borderColor: isDark ? '#374151' : '#e5e7eb',
            }
          ]}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={{ color: isDark ? '#f9fafb' : '#1f2937' }}>
            {formatTime(time)}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <View style={styles.switchContainer}>
          <Text style={[
            styles.label,
            { color: isDark ? '#d1d5db' : '#4b5563' }
          ]}>
            5-minute early notification
          </Text>
          <Switch
            trackColor={{ false: isDark ? '#374151' : '#e5e7eb', true: '#7B2CBF' }}
            thumbColor={earlyNotification ? '#ffffff' : isDark ? '#6b7280' : '#9ca3af'}
            ios_backgroundColor={isDark ? '#374151' : '#e5e7eb'}
            onValueChange={setEarlyNotification}
            value={earlyNotification}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[
          styles.label,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Color
        </Text>
        <View style={styles.colorPicker}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[
          styles.label,
          { color: isDark ? '#d1d5db' : '#4b5563' }
        ]}>
          Notes (Optional)
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#f9fafb' : '#1f2937',
              borderColor: isDark ? '#374151' : '#e5e7eb',
            }
          ]}
          placeholder="Add notes about this class"
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: '#7B2CBF' }
        ]}
        onPress={handleSaveAlarm}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.saveButtonText}>Save Alarm</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  dateTimeButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  dayButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 12,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    minHeight: 100,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 16,
  },
});