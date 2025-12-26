
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

export type EventStatus = 'upcoming' | 'confirmed' | 'missed' | 'rescheduled';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location?: string;
  urgency: UrgencyLevel;
  status: EventStatus;
  description?: string;
  isVoiceInput: boolean;
}

export interface UserSettings {
  voiceTone: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  reminderIntensity: 'gentle' | 'standard' | 'persistent';
  onboardingComplete: boolean;
  name: string;
}

export enum AppSection {
  Timeline = 'timeline',
  Input = 'input',
  Settings = 'settings',
  Onboarding = 'onboarding'
}
