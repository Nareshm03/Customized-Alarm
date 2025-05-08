export interface Alarm {
  id: string;
  subject: string;
  classroom: string;
  time: string; // ISO date string
  notes?: string;
  notifyBefore: boolean;
  color?: string;
  sound?: string;
  isActive: boolean;
}