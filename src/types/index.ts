export type TimeOfDay = 'morning' | 'noon' | 'evening' | 'bedtime';

export type FoodInstruction = 'with_food' | 'empty_stomach' | 'plenty_water' | 'no_dairy' | 'no_grapefruit';

export type ConflictSeverity = 'critical' | 'moderate' | 'mild' | 'synergy';

export type TabType = 'schedule' | 'cabinet' | 'conflicts' | 'scanner' | 'missed';

export type WorkspaceView =
  | 'dashboard'
  | 'documents'
  | 'analysis'
  | 'routine'
  | 'cabinet'
  | 'sentinel'
  | 'missed'
  | 'settings';

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

export interface AllergyAlert {
  drugId: string;
  drugName: string;
  allergen: string;
  reactionSeverity: 'fatal' | 'severe' | 'moderate';
  warningMessage: string;
}

export interface SafetyAnalysisResult {
  conflicts: DrugConflict[];
  allergyAlerts: AllergyAlert[];
  foodWarnings: {
    medication: string;
    warning: FoodWarning;
  }[];
  polypharmacyScore: number; // 0 to 100 risk score
  polypharmacyLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  doctorQuestions: string[];
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

export interface AnalyzedDocument {
  id: string;
  name: string;
  type: 'prescription_label' | 'discharge_summary' | 'clinical_protocol' | 'care_plan';
  format: 'pdf' | 'docx' | 'txt' | 'image';
  size: string;
  dateUploaded: string;
  status: 'analyzed' | 'processing' | 'failed' | 'flagged_hazard';
  rawText?: string;
  medication?: Medication;
  summary: string;
  keyInformation: string[];
  concerns: {
    level: 'critical' | 'warning' | 'info';
    message: string;
  }[];
  recommendations: string[];
  doctorQuestions: string[];
}
