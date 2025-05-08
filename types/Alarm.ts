export interface Alarm {
  id: number;
  subject: string;
  classroom: string;
  time: string; // Format: "HH:MM AM/PM"
  days?: string[]; // Array of day abbreviations: ['Mon', 'Wed', 'Fri']
  color: string;
  isActive: boolean;
  notes?: string;
}