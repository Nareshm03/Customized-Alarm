import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import AlarmService from '@/services/AlarmService';
import { Alarm } from '@/types/Alarm';
import { formatTime } from '@/utils/alarmUtils';

// Days of the week
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Schedule() {
  const { isDark, theme } = useTheme();
  const router = useRouter();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchAlarms();
  }, []);
  
  const fetchAlarms = async () => {
    try {
      const data = await AlarmService.getAlarms();
      setAlarms(data);
    } catch (error) {
      console.error('Error fetching alarms:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Group alarms by day of the week
  const getAlarmsByDay = () => {
    const groupedAlarms: { [key: string]: Alarm[] } = {};
    
    // Initialize days
    DAYS.forEach(day => {
      groupedAlarms[day] = [];
    });
    
    alarms.forEach(alarm => {
      const date = new Date(alarm.time);
      const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Sunday
      groupedAlarms[dayName].push(alarm);
    });
    
    // Sort alarms within each day by time
    Object.keys(groupedAlarms).forEach(day => {
      groupedAlarms[day].sort((a, b) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    });
    
    return groupedAlarms;
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#7B2CBF" />
      </View>
    );
  }
  
  const alarmsByDay = getAlarmsByDay();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Weekly Schedule</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/create')}
        >
          <Text style={styles.addButtonText}>+ New Alarm</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {DAYS.map(day => (
          <View key={day} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Calendar size={20} color={theme.text} />
              <Text style={[styles.dayTitle, { color: theme.text }]}>{day}</Text>
            </View>
            
            {alarmsByDay[day].length > 0 ? (
              <View style={[styles.timelineContainer, { borderLeftColor: theme.border }]}>
                {alarmsByDay[day].map((alarm, index) => (
                  <TouchableOpacity
                    key={alarm.id}
                    style={styles.timelineItem}
                    onPress={() => router.push({
                      pathname: '/(tabs)/alarms/[id]',
                      params: { id: alarm.id }
                    })}
                  >
                    <View style={[styles.timelineDot, { backgroundColor: alarm.color || '#7B2CBF' }]} />
                    <View style={[styles.timelineCard, { backgroundColor: theme.cardBackground }]}>
                      <Text style={[styles.timelineTime, { color: theme.text }]}>
                        {formatTime(new Date(alarm.time))}
                      </Text>
                      <Text style={[styles.timelineSubject, { color: theme.text }]}>
                        {alarm.subject}
                      </Text>
                      <Text style={[styles.timelineClassroom, { color: theme.textSecondary }]}>
                        {alarm.classroom}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={[styles.emptyDay, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.emptyDayText, { color: theme.textSecondary }]}>
                  No classes scheduled
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#7B2CBF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginLeft: 8,
  },
  timelineContainer: {
    borderLeftWidth: 2,
    paddingLeft: 20,
    marginLeft: 10,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 16,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    left: -29,
    top: 16,
  },
  timelineCard: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineTime: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  timelineSubject: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginBottom: 4,
  },
  timelineClassroom: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  emptyDay: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyDayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});