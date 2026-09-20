import { useMemo } from 'react';
import { Medication, PatientProfile } from '../types';
import { analyzeMedicationSafety, ConflictAnalysisResult } from '../utils/conflictChecker';

export function useMedicationSafety(
  medications: Medication[],
  patient: PatientProfile
): ConflictAnalysisResult {
  return useMemo(() => {
    return analyzeMedicationSafety(medications, patient);
  }, [medications, patient]);
}
