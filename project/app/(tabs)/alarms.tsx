import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, CreditCard as Edit, Trash2, Calendar } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import AlarmService from '@/services/AlarmService';
import { Alarm } from '@/types/Alarm';
import { formatTime, formatDate } from '@/utils/alarmUtils';

export default function AlarmsList() {
  const { isDark, theme } = useTheme();
  const router = useRouter();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchAlarms();
  }, []);
  
  const fetchAlarms = async () => {
    try {
      const data = await AlarmService.getAlarms();
      // Sort by time
      const sortedData = [...data].sort((a, b) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
      );
      setAlarms(sortedData);
    } catch (error) {
      console.error('Error fetching alarms:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchAlarms();
  };
  
  const handleDeleteAlarm = async (id: string) => {
    try {
      await AlarmService.deleteAlarm(id);
      // Filter out the deleted alarm
      setAlarms(alarms.filter(alarm => alarm.id !== id));
    } catch (error) {
      console.error('Error deleting alarm:', error);
    }
  };
  
  const groupAlarmsByDate = () => {
    const grouped: { [key: string]: Alarm[] } = {};
    
    alarms.forEach(alarm => {
      const date = new Date(alarm.time).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(alarm);
    });
    
    return Object.entries(grouped).map(([date, alarms]) => ({
      date,
      alarms,
    }));
  };
  
  const renderItem = ({ item }: { item: { date: string; alarms: Alarm[] } }) => (
    <View style={styles.dateGroup}>
      <View style={styles.dateHeader}>
        <Calendar size={16} color={theme.text} />
        <Text style={[styles.dateText, { color: theme.text }]}>
          {formatDate(new Date(item.date))}
        </Text>
      </View>
      
      {item.alarms.map(alarm => (
        <View 
          key={alarm.id}
          style={[styles.alarmCard, { backgroundColor: theme.cardBackground }]}
        >
          <View style={[styles.alarmColorTag, { backgroundColor: alarm.color || '#7B2CBF' }]} />
          <TouchableOpacity 
            style={styles.alarmContent}
            onPress={() => router.push({
              pathname: '/(tabs)/alarms/[id]',
              params: { id: alarm.id }
            })}
          >
            <Text style={[styles.alarmTime, { color: theme.text }]}>
              {formatTime(new Date(alarm.time))}
            </Text>
            <Text style={[styles.alarmSubject, { color: theme.text }]}>
              {alarm.subject}
            </Text>
            <View style={styles.alarmMeta}>
              <Bell size={14} color={theme.textSecondary} />
              <Text style={[styles.alarmMetaText, { color: theme.textSecondary }]}>
                {alarm.classroom}
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.alarmActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => router.push({
                pathname: '/(tabs)/create',
                params: { id: alarm.id }
              })}
            >
              <Edit size={16} color="#38B2AC" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteAlarm(alarm.id)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#7B2CBF" />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Alarms</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: '#7B2CBF' }]}
          onPress={() => router.push('/(tabs)/create')}
        >
          <Text style={styles.addButtonText}>+ New Alarm</Text>
        </TouchableOpacity>
      </View>
      
      {alarms.length > 0 ? (
        <FlatList
          data={groupAlarmsByDate()}
          renderItem={renderItem}
          keyExtractor={item => item.date}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#7B2CBF']}
              tintColor={isDark ? '#f9fafb' : '#7B2CBF'}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Bell size={64} color={theme.textSecondary} strokeWidth={1} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Alarms Set</Text>
          <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
            You haven't created any alarms yet. Tap the 'New Alarm' button to create your first alarm.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/(tabs)/create')}
          >
            <Text style={styles.createButtonText}>Create Alarm</Text>
          </TouchableOpacity>
        </View>
      )}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginLeft: 8,
  },
  alarmCard: {
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alarmColorTag: {
    width: 8,
  },
  alarmContent: {
    padding: 16,
    flex: 1,
  },
  alarmTime: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  alarmSubject: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  alarmMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmMetaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  alarmActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  actionButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  deleteButton: {},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  createButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 16,
  },
});