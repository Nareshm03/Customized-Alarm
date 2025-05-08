import { Alarm } from '@/types/Alarm';

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get alarms scheduled for today
 */
export function getTodayAlarms(alarms: Alarm[]): Alarm[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return alarms.filter(alarm => {
    const alarmDate = new Date(alarm.time);
    return alarmDate >= today && alarmDate < tomorrow;
  });
}

/**
 * Get alarms scheduled for tomorrow
 */
export function getTomorrowAlarms(alarms: Alarm[]): Alarm[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  
  return alarms.filter(alarm => {
    const alarmDate = new Date(alarm.time);
    return alarmDate >= tomorrow && alarmDate < dayAfter;
  });
}

/**
 * Group alarms by date
 */
export function groupAlarmsByDate(alarms: Alarm[]): { [key: string]: Alarm[] } {
  const grouped: { [key: string]: Alarm[] } = {};
  
  alarms.forEach(alarm => {
    const date = new Date(alarm.time).toDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(alarm);
  });
  
  return grouped;
}