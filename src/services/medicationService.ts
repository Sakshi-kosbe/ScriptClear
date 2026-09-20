import { Medication, DoseLog, TimeOfDay } from '../types';
import { INITIAL_MEDICATIONS } from '../data/mockMedications';
import { STORAGE_KEYS } from '../constants/storageKeys';

export class MedicationService {
  static getInitialMedications(): Medication[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved medications', e);
    }
    return INITIAL_MEDICATIONS;
  }

  static getInitialDoseLogs(): DoseLog[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOSE_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved dose logs', e);
    }
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'init-1',
        medicationId: 'med-lisinopril',
        date: today,
        timeSlot: 'morning',
        takenAt: '8:15 AM',
        taken: true,
      },
    ];
  }

  static toggleDoseLog(
    currentLogs: DoseLog[],
    medicationId: string,
    slot: TimeOfDay
  ): DoseLog[] {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = currentLogs.findIndex(
      (l) => l.medicationId === medicationId && l.timeSlot === slot && l.date === today
    );

    if (existingIndex >= 0) {
      const updated = [...currentLogs];
      const willBeTaken = !updated[existingIndex].taken;
      updated[existingIndex] = {
        ...updated[existingIndex],
        taken: willBeTaken,
        takenAt: willBeTaken
          ? new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : undefined,
      };
      return updated;
    } else {
      const newEntry: DoseLog = {
        id: `dose-${Date.now()}`,
        medicationId,
        date: today,
        timeSlot: slot,
        taken: true,
        takenAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      return [...currentLogs, newEntry];
    }
  }

  static calculateAdherence(medications: Medication[], doseLogs: DoseLog[]): number {
    const today = new Date().toISOString().split('T')[0];
    let totalScheduledDoses = 0;
    let takenDoses = 0;

    medications.forEach((med) => {
      totalScheduledDoses += med.timeOfDay.length;
    });

    if (totalScheduledDoses === 0) return 100;

    doseLogs
      .filter((l) => l.date === today && l.taken)
      .forEach(() => {
        takenDoses += 1;
      });

    return Math.min(100, Math.round((takenDoses / totalScheduledDoses) * 100));
  }
}
