export type TimeOfDay = 'morning' | 'noon' | 'evening' | 'bedtime';

export type FoodInstruction = 'with_food' | 'empty_stomach' | 'plenty_water' | 'no_dairy' | 'no_grapefruit';

export type ConflictSeverity = 'critical' | 'moderate' | 'mild' | 'synergy';

export interface FoodWarning {
  item: string;
  hazard: string;
  iconName: string;
  recommendation: string;
}

export interface Medication {
  id: string;
  brandName: string;
  genericName: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'inhaler' | 'injection';
  color: string; // e.g., 'white', 'blue', 'orange', 'yellow'
  shape: 'round' | 'oval' | 'capsule' | 'diamond';
  purposePlain: string; // "Lowers your blood pressure to prevent strokes"
  condition: string;
  prescribedBy: string;
  rxNumber: string;
  pharmacyPhone: string;
  instructionsPlain: string; // "Take 1 round white pill every morning with breakfast."
  clinicalNotes?: string;
  timeOfDay: TimeOfDay[];
  foodInstruction: FoodInstruction;
  warnings: string[];
  foodInteractions: FoodWarning[];
  refillDaysLeft: number;
  totalPills: number;
  remainingPills: number;
  datePrescribed: string;
}

export interface DrugConflict {
  id: string;
  drugAId: string;
  drugBId: string;
  drugAName: string;
  drugBName: string;
  severity: ConflictSeverity;
  headline: string;
  plainExplanation: string;
  clinicalMechanism: string;
  actionRequired: string;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  date: string; // YYYY-MM-DD
  timeSlot: TimeOfDay;
  takenAt?: string;
  taken: boolean;
  skippedReason?: string;
}

export interface PatientProfile {
  name: string;
  age: number;
  bloodType: string;
  knownAllergies: string[];
  primaryDoctor: string;
  doctorPhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export interface SamplePrescriptionPreset {
  id: string;
  title: string;
  badge: string;
  simulatedBottleText: string;
  medication: Omit<Medication, 'id'>;
  triggersConflictWith?: string; // name of conflicting drug
  scenarioNote: string;
}
