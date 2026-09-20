import { Calendar, Pill, ShieldAlert, Camera, HelpCircle } from 'lucide-react';
import { TabType } from '../types';

export interface NavItemConfig {
  id: TabType;
  label: string;
  shortLabel?: string;
  icon: typeof Calendar;
  description: string;
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'schedule',
    label: "Today's Routine",
    shortLabel: 'Routine',
    icon: Calendar,
    description: 'Visual 24-hour timeline synchronized with meal times',
  },
  {
    id: 'cabinet',
    label: 'Medicine Cabinet',
    shortLabel: 'Cabinet',
    icon: Pill,
    description: 'Complete prescription records, doctor notes & refill tracking',
  },
  {
    id: 'conflicts',
    label: 'Safety Sentinel',
    shortLabel: 'Sentinel',
    icon: ShieldAlert,
    description: 'Polypharmacy hazard screening, food interactions & physician talking points',
  },
  {
    id: 'scanner',
    label: 'AI Label Scanner',
    shortLabel: 'Scanner',
    icon: Camera,
    description: 'Camera & OCR translation of complex pharmacy prescription labels',
  },
  {
    id: 'missed',
    label: 'Missed Dose Advisor',
    shortLabel: 'Missed Dose?',
    icon: HelpCircle,
    description: 'Immediate evidence-based clinical guidance for late or forgotten doses',
  },
];
