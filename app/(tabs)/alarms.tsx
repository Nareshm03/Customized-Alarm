import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlarms } from '../../context/AlarmContext';
import { router } from 'expo-router';

export default function AlarmsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { alarms, loading, error, toggleAlarmActive, deleteAlarm, refreshAlarms } = useAlarms();

  const renderAlarmItem = ({ item }) => (
    <View
      style={[
        styles.alarmCard,
        { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
      ]}
    >
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      <View style={styles.alarmInfo}>
        <Text style={[
          styles.subjectText,
          { color: isDark ? '#f9fafb' : '#1f2937' }
        ]}>
          {item.subject}
        </Text>
        <Text style={[
          styles.classroomText,
          { color: isDark ? '#9ca3af' : '#4b5563' }
        ]}>
          {item.classroom}
        </Text>
        <Text style={[
          styles.timeText,
          { color: isDark ? '#d1d5db' : '#6b7280' }
        ]}>
          {item.time} • {item.days ? item.days.join(', ') : ''}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            { opacity: item.isActive ? 1 : 0.5 }
          ]}
          onPress={() => toggleAlarmActive(item.id)}
        >
          <Ionicons
            name="notifications"
            size={24}
            color={item.isActive ? '#7B2CBF' : (isDark ? '#9ca3af' : '#6b7280')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => deleteAlarm(item.id)}
        >
          <Ionicons name="trash" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#f9fafb' }
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={[
          styles.headerTitle,
          { color: isDark ? '#f9fafb' : '#1f2937' }
        ]}>
          Your Alarms
        </Text>

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
      ) : alarms.length > 0 ? (
        <FlatList
          data={alarms}
          renderItem={renderAlarmItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={refreshAlarms}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications" size={64} color={isDark ? '#4b5563' : '#9ca3af'} />
          <Text style={[
            styles.emptyText,
            { color: isDark ? '#9ca3af' : '#4b5563' }
          ]}>
            No alarms set yet
          </Text>
          <Text style={[
            styles.emptySubtext,
            { color: isDark ? '#6b7280' : '#6b7280' }
          ]}>
            Create your first class alarm to get started
          </Text>
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
    </View>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
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
    fontFamily: 'Inter-Regular',
  },
  retryText: {
    color: '#7B2CBF',
    fontFamily: 'Inter-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    marginTop: 16,
  },
  listContainer: {
    paddingBottom: 80,
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
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  classroomText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  emptyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  createButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  createButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 16,
  },
});