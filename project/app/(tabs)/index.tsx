import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Calendar, Clock, MapPin } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import AlarmService from '@/services/AlarmService';
import { Alarm } from '@/types/Alarm';
import { formatTime, getTodayAlarms, getTomorrowAlarms } from '@/utils/alarmUtils';

export default function Dashboard() {
  const { isDark, theme } = useTheme();
  const router = useRouter();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    fetchAlarms();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const fetchAlarms = async () => {
    try {
      const data = await AlarmService.getAlarms();
      setAlarms(data);
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
  
  const getUpcomingAlarm = () => {
    if (!alarms.length) return null;
    
    const now = new Date();
    const upcoming = alarms
      .filter(alarm => {
        const alarmTime = new Date(alarm.time);
        return alarmTime > now;
      })
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
    return upcoming.length > 0 ? upcoming[0] : null;
  };
  
  const upcomingAlarm = getUpcomingAlarm();
  const todayAlarms = getTodayAlarms(alarms);
  const tomorrowAlarms = getTomorrowAlarms(alarms);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} 
            colors={['#7B2CBF']}
            tintColor={isDark ? '#f9fafb' : '#7B2CBF'}
          />
        }
      >
        <View style={styles.headerContainer}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>Good morning,</Text>
            <Text style={[styles.username, { color: theme.text }]}>Teacher</Text>
          </View>
          <TouchableOpacity 
            style={[styles.notificationBadge, { backgroundColor: theme.cardBackground }]}
            onPress={() => router.push('/(tabs)/alarms')}
          >
            <Bell size={20} color="#7B2CBF" />
            {alarms.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{alarms.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <Animated.View 
          style={[
            styles.upcomingContainer,
            { 
              backgroundColor: upcomingAlarm ? '#7B2CBF' : theme.cardBackground,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {upcomingAlarm ? (
            <>
              <View style={styles.upcomingHeader}>
                <Clock size={20} color="#fff" />
                <Text style={styles.upcomingTitle}>Upcoming Class</Text>
              </View>
              <Text style={styles.upcomingSubject}>{upcomingAlarm.subject}</Text>
              <View style={styles.upcomingDetails}>
                <View style={styles.upcomingDetail}>
                  <Clock size={16} color="#fff" />
                  <Text style={styles.upcomingDetailText}>
                    {formatTime(new Date(upcomingAlarm.time))}
                  </Text>
                </View>
                <View style={styles.upcomingDetail}>
                  <MapPin size={16} color="#fff" />
                  <Text style={styles.upcomingDetailText}>{upcomingAlarm.classroom}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => router.push({
                  pathname: '/(tabs)/alarms/[id]',
                  params: { id: upcomingAlarm.id }
                })}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.noUpcomingContainer}>
              <Bell size={32} color={theme.text} />
              <Text style={[styles.noUpcomingText, { color: theme.text }]}>
                No upcoming classes
              </Text>
              <TouchableOpacity 
                style={[styles.createButton, { backgroundColor: '#7B2CBF' }]}
                onPress={() => router.push('/(tabs)/create')}
              >
                <Text style={styles.createButtonText}>Create an Alarm</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
        
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={theme.text} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Schedule</Text>
          </View>
          
          {todayAlarms.length > 0 ? (
            <View style={styles.alarmsContainer}>
              {todayAlarms.map((alarm) => (
                <TouchableOpacity
                  key={alarm.id}
                  style={[styles.alarmCard, { backgroundColor: theme.cardBackground }]}
                  onPress={() => router.push({
                    pathname: '/(tabs)/alarms/[id]',
                    params: { id: alarm.id }
                  })}
                >
                  <View style={[styles.alarmColorTag, { backgroundColor: alarm.color || '#7B2CBF' }]} />
                  <View style={styles.alarmContent}>
                    <Text style={[styles.alarmTime, { color: theme.text }]}>
                      {formatTime(new Date(alarm.time))}
                    </Text>
                    <Text style={[styles.alarmSubject, { color: theme.text }]}>
                      {alarm.subject}
                    </Text>
                    <View style={styles.alarmMeta}>
                      <MapPin size={14} color={theme.textSecondary} />
                      <Text style={[styles.alarmMetaText, { color: theme.textSecondary }]}>
                        {alarm.classroom}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No classes scheduled for today
              </Text>
            </View>
          )}
          
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Calendar size={20} color={theme.text} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Tomorrow</Text>
          </View>
          
          {tomorrowAlarms.length > 0 ? (
            <View style={styles.alarmsContainer}>
              {tomorrowAlarms.map((alarm) => (
                <TouchableOpacity
                  key={alarm.id}
                  style={[styles.alarmCard, { backgroundColor: theme.cardBackground }]}
                  onPress={() => router.push({
                    pathname: '/(tabs)/alarms/[id]',
                    params: { id: alarm.id }
                  })}
                >
                  <View style={[styles.alarmColorTag, { backgroundColor: alarm.color || '#7B2CBF' }]} />
                  <View style={styles.alarmContent}>
                    <Text style={[styles.alarmTime, { color: theme.text }]}>
                      {formatTime(new Date(alarm.time))}
                    </Text>
                    <Text style={[styles.alarmSubject, { color: theme.text }]}>
                      {alarm.subject}
                    </Text>
                    <View style={styles.alarmMeta}>
                      <MapPin size={14} color={theme.textSecondary} />
                      <Text style={[styles.alarmMetaText, { color: theme.textSecondary }]}>
                        {alarm.classroom}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No classes scheduled for tomorrow
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  username: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginTop: 4,
  },
  notificationBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  upcomingContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingTitle: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  upcomingSubject: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 24,
    marginBottom: 12,
  },
  upcomingDetails: {
    marginBottom: 16,
  },
  upcomingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  upcomingDetailText: {
    fontFamily: 'Inter-Regular',
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  viewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 14,
  },
  noUpcomingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  noUpcomingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginVertical: 16,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginLeft: 8,
  },
  alarmsContainer: {
    marginBottom: 8,
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
  emptyContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});