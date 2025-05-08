import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alarm } from '../types/Alarm';
import { AlarmService } from '../services/AlarmService';

type AlarmContextType = {
  alarms: Alarm[];
  loading: boolean;
  error: string | null;
  createAlarm: (alarm: Omit<Alarm, 'id'>) => Promise<void>;
  updateAlarm: (alarm: Alarm) => Promise<void>;
  deleteAlarm: (id: number) => Promise<void>;
  toggleAlarmActive: (id: number) => Promise<void>;
  refreshAlarms: () => Promise<void>;
};

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load alarms on initial render
  useEffect(() => {
    const initializeAlarms = async () => {
      try {
        // Initialize the alarm service
        await AlarmService.initialize();
        
        // Load alarms from storage
        await refreshAlarms();
      } catch (err) {
        setError('Failed to load alarms');
        console.error('Error initializing alarms:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAlarms();
  }, []);

  // Refresh alarms from storage
  const refreshAlarms = async () => {
    try {
      setLoading(true);
      const loadedAlarms = await AlarmService.getAlarms();
      setAlarms(loadedAlarms);
      setError(null);
    } catch (err) {
      setError('Failed to load alarms');
      console.error('Error refreshing alarms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new alarm
  const createAlarm = async (alarmData: Omit<Alarm, 'id'>) => {
    try {
      setLoading(true);
      const newAlarm = await AlarmService.createAlarm(alarmData as Alarm);
      setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
      setError(null);
    } catch (err) {
      setError('Failed to create alarm');
      console.error('Error creating alarm:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing alarm
  const updateAlarm = async (updatedAlarm: Alarm) => {
    try {
      setLoading(true);
      await AlarmService.updateAlarm(updatedAlarm);
      setAlarms(prevAlarms => 
        prevAlarms.map(alarm => 
          alarm.id === updatedAlarm.id ? updatedAlarm : alarm
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update alarm');
      console.error('Error updating alarm:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an alarm
  const deleteAlarm = async (id: number) => {
    try {
      setLoading(true);
      await AlarmService.deleteAlarm(id);
      setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete alarm');
      console.error('Error deleting alarm:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle alarm active status
  const toggleAlarmActive = async (id: number) => {
    try {
      setLoading(true);
      const updatedAlarm = await AlarmService.toggleAlarmActive(id);
      setAlarms(prevAlarms => 
        prevAlarms.map(alarm => 
          alarm.id === id ? updatedAlarm : alarm
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to toggle alarm');
      console.error('Error toggling alarm:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlarmContext.Provider
      value={{
        alarms,
        loading,
        error,
        createAlarm,
        updateAlarm,
        deleteAlarm,
        toggleAlarmActive,
        refreshAlarms,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarms = (): AlarmContextType => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarms must be used within an AlarmProvider');
  }
  return context;
};