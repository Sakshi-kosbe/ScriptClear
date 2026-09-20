import { Sun, SunMedium, Sunset, Moon } from 'lucide-react';
import { TimeOfDay } from '../types';

export interface TimeSlotConfig {
  id: TimeOfDay;
  label: string;
  timeWindow: string;
  mealContext: string;
  icon: typeof Sun;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  pillColor: string;
}

export const TIME_SLOTS: TimeSlotConfig[] = [
  {
    id: 'morning',
    label: 'Morning Dose',
    timeWindow: '7:30 AM – 9:00 AM',
    mealContext: 'Take around breakfast or upon waking',
    icon: Sun,
    accentBg: 'bg-amber-50 dark:bg-amber-950/20',
    accentBorder: 'border-amber-200 dark:border-amber-800/40',
    accentText: 'text-amber-800 dark:text-amber-300',
    pillColor: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'noon',
    label: 'Afternoon / Lunch',
    timeWindow: '12:00 PM – 1:30 PM',
    mealContext: 'Take with midday lunch or snack',
    icon: SunMedium,
    accentBg: 'bg-sky-50 dark:bg-sky-950/20',
    accentBorder: 'border-sky-200 dark:border-sky-800/40',
    accentText: 'text-sky-800 dark:text-sky-300',
    pillColor: 'bg-sky-100 text-sky-900',
  },
  {
    id: 'evening',
    label: 'Evening / Dinner',
    timeWindow: '6:00 PM – 7:30 PM',
    mealContext: 'Take with dinner to avoid stomach upset',
    icon: Sunset,
    accentBg: 'bg-orange-50 dark:bg-orange-950/20',
    accentBorder: 'border-orange-200 dark:border-orange-800/40',
    accentText: 'text-orange-800 dark:text-orange-300',
    pillColor: 'bg-orange-100 text-orange-900',
  },
  {
    id: 'bedtime',
    label: 'Bedtime Routine',
    timeWindow: '9:30 PM – 10:30 PM',
    mealContext: 'Take 30 minutes before sleep with half a glass of water',
    icon: Moon,
    accentBg: 'bg-indigo-50 dark:bg-indigo-950/20',
    accentBorder: 'border-indigo-200 dark:border-indigo-800/40',
    accentText: 'text-indigo-800 dark:text-indigo-300',
    pillColor: 'bg-indigo-100 text-indigo-900',
  },
];
