import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Check, Bell } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import AlarmService from '@/services/AlarmService';
import { Alarm } from '@/types/Alarm';
import ColorPicker from '@/components/ColorPicker';

export default function CreateAlarm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [subject, setSubject] = useState('');
  const [classroom, setClassroom] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [notifyBefore, setNotifyBefore] = useState(true);
  const [color, setColor] = useState('#7B2CBF');
  const [sound, setSound] = useState('Default');
  
  // Animation values
  const formOpacity = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (id) {
      fetchAlarmDetails();
    } else {
      setIsLoadingData(false);
      startAnimation();
    }
  }, [id]);
  
  const startAnimation = () => {
    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  
  const fetchAlarmDetails = async () => {
    try {
      const data = await AlarmService.getAlarmById(id);
      if (data) {
        setSubject(data.subject);
        setClassroom(data.classroom);
        setDate(new Date(data.time));
        setNotes(data.notes || '');
        setNotifyBefore(data.notifyBefore);
        setColor(data.color || '#7B2CBF');
        setSound(data.sound || 'Default');
      }
    } catch (error) {
      console.error('Error fetching alarm details:', error);
      setError('Failed to load alarm details');
    } finally {
      setIsLoadingData(false);
      startAnimation();
    }
  };
  
  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
    }
  };
  
  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };
  
  const validateForm = () => {
    if (!subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!classroom.trim()) {
      setError('Classroom is required');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {
    try {
      setError(null);
      
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);
      
      const alarmData: Omit<Alarm, 'id'> = {
        subject,
        classroom,
        time: date.toISOString(),
        notes,
        notifyBefore,
        color,
        sound,
        isActive: true,
      };
      
      if (id) {
        // Update existing alarm
        await AlarmService.updateAlarm({ id, ...alarmData });
      } else {
        // Create new alarm
        await AlarmService.createAlarm(alarmData);
      }
      
      router.replace('/(tabs)/alarms');
    } catch (error) {
      console.error('Error saving alarm:', error);
      setError('Failed to save alarm');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (isLoadingData) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#7B2CBF" />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {id ? 'Edit Alarm' : 'Create Alarm'}
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, { opacity: isLoading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Check size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: formOpacity }}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Basic Information
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Subject</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                value={subject}
                onChangeText={setSubject}
                placeholder="Enter subject name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Classroom</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                value={classroom}
                onChangeText={setClassroom}
                placeholder="Enter classroom"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Date & Time
            </Text>
            
            <TouchableOpacity
              style={[
                styles.dateTimeButton,
                { 
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border
                }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateTimeLabel, { color: theme.textSecondary }]}>
                Date
              </Text>
              <Text style={[styles.dateTimeValue, { color: theme.text }]}>
                {formatDate(date)}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dateTimeButton,
                { 
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border
                }
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[styles.dateTimeLabel, { color: theme.textSecondary }]}>
                Time
              </Text>
              <Text style={[styles.dateTimeValue, { color: theme.text }]}>
                {formatTime(date)}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
          
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Notification
            </Text>
            
            <View style={styles.switchContainer}>
              <View>
                <Text style={[styles.switchLabel, { color: theme.text }]}>
                  Notify 5 minutes before
                </Text>
                <Text style={[styles.switchDescription, { color: theme.textSecondary }]}>
                  Get a reminder 5 minutes before the alarm
                </Text>
              </View>
              <Switch
                value={notifyBefore}
                onValueChange={setNotifyBefore}
                trackColor={{ false: theme.switchTrack, true: '#7B2CBF' }}
                thumbColor={notifyBefore ? '#fff' : theme.switchThumb}
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Appearance
            </Text>
            
            <Text style={[styles.label, { color: theme.text }]}>Color</Text>
            <ColorPicker
              selectedColor={color}
              onSelectColor={setColor}
              colors={[
                '#7B2CBF', // Purple
                '#38B2AC', // Teal
                '#F59E0B', // Amber
                '#EF4444', // Red
                '#10B981', // Green
                '#3B82F6', // Blue
              ]}
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Notes
            </Text>
            
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: theme.inputBackground,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about this class (optional)"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#7B2CBF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  scrollContent: {
    padding: 16,
  },
  errorContainer: {
    backgroundColor: '#FEECEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: '#B91C1C',
    fontSize: 14,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
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
    fontFamily: 'Inter-Regular',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dateTimeButton: {
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },
  dateTimeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  switchLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  switchDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  textArea: {
    fontFamily: 'Inter-Regular',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
});