import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bell, Clock, MapPin, Calendar, CreditCard as Edit, Trash2, Volume2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import AlarmService from '@/services/AlarmService';
import { Alarm } from '@/types/Alarm';
import { formatTime, formatDate } from '@/utils/alarmUtils';

export default function AlarmDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark, theme } = useTheme();
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    if (id) {
      fetchAlarmDetails();
    }
  }, [id]);
  
  useEffect(() => {
    // Start animations when alarm data is loaded
    if (alarm) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [alarm]);
  
  const fetchAlarmDetails = async () => {
    try {
      const data = await AlarmService.getAlarmById(id);
      if (data) {
        setAlarm(data);
        setIsActive(data.isActive);
      }
    } catch (error) {
      console.error('Error fetching alarm details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleActive = async (value: boolean) => {
    try {
      if (alarm) {
        const updatedAlarm = { ...alarm, isActive: value };
        await AlarmService.updateAlarm(updatedAlarm);
        setIsActive(value);
      }
    } catch (error) {
      console.error('Error updating alarm:', error);
      // Revert UI state on error
      setIsActive(!value);
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Alarm",
      "Are you sure you want to delete this alarm?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              if (alarm) {
                await AlarmService.deleteAlarm(alarm.id);
                router.replace('/(tabs)/alarms');
              }
            } catch (error) {
              console.error('Error deleting alarm:', error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#7B2CBF" />
      </View>
    );
  }
  
  if (!alarm) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Alarm Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.notFoundContainer}>
          <Bell size={64} color={theme.textSecondary} strokeWidth={1} />
          <Text style={[styles.notFoundText, { color: theme.text }]}>
            Alarm not found
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Alarm Details</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push({
            pathname: '/(tabs)/create',
            params: { id: alarm.id }
          })}
        >
          <Edit size={20} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[
            styles.alarmHeader,
            { 
              backgroundColor: alarm.color || '#7B2CBF',
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Text style={styles.alarmSubject}>{alarm.subject}</Text>
          <Text style={styles.alarmTime}>{formatTime(new Date(alarm.time))}</Text>
          
          <View style={styles.activeContainer}>
            <Text style={styles.activeText}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
            <Switch
              value={isActive}
              onValueChange={handleToggleActive}
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.6)' }}
              thumbColor={isActive ? '#fff' : '#f4f3f4'}
            />
          </View>
        </Animated.View>
        
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={theme.text} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Location</Text>
            </View>
            <View style={[styles.detailCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.detailText, { color: theme.text }]}>
                {alarm.classroom}
              </Text>
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color={theme.text} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Date</Text>
            </View>
            <View style={[styles.detailCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.detailText, { color: theme.text }]}>
                {formatDate(new Date(alarm.time))}
              </Text>
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Volume2 size={20} color={theme.text} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Notification</Text>
            </View>
            <View style={[styles.detailCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.detailText, { color: theme.text }]}>
                {alarm.notifyBefore ? '5 minutes before' : 'On time only'}
              </Text>
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={theme.text} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Alarm Sound</Text>
            </View>
            <View style={[styles.detailCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.detailText, { color: theme.text }]}>
                {alarm.sound || 'Default'}
              </Text>
            </View>
          </View>
          
          {alarm.notes && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes</Text>
              </View>
              <View style={[styles.detailCard, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.detailText, { color: theme.text }]}>
                  {alarm.notes}
                </Text>
              </View>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#EF4444" />
            <Text style={styles.deleteText}>Delete Alarm</Text>
          </TouchableOpacity>
        </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  editButton: {
    padding: 8,
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    padding: 16,
  },
  alarmHeader: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  alarmSubject: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 24,
    marginBottom: 8,
  },
  alarmTime: {
    fontFamily: 'Inter-Regular',
    color: '#fff',
    fontSize: 36,
    marginBottom: 16,
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeText: {
    fontFamily: 'Inter-Regular',
    color: '#fff',
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginLeft: 8,
  },
  detailCard: {
    borderRadius: 12,
    padding: 16,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    marginTop: 24,
    marginBottom: 40,
  },
  deleteText: {
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    fontSize: 16,
    marginLeft: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: 16,
  },
});