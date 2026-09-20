import { Medication, DrugConflict, PatientProfile, FoodWarning } from '../types';

export interface ConflictAnalysisResult {
  conflicts: DrugConflict[];
  allergyAlerts: {
    medicationName: string;
    allergen: string;
    warning: string;
  }[];
  foodWarnings: {
    medicationName: string;
    warning: FoodWarning;
  }[];
  polypharmacyScore: {
    pillCount: number;
    complexityLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    timingSlotsCovered: number;
    recommendation: string;
  };
  doctorQuestions: string[];
}

export function analyzeMedicationSafety(
  medications: Medication[],
  patient: PatientProfile
): ConflictAnalysisResult {
  const conflicts: DrugConflict[] = [];
  const allergyAlerts: ConflictAnalysisResult['allergyAlerts'] = [];
  const foodWarnings: ConflictAnalysisResult['foodWarnings'] = [];
  const doctorQuestions: string[] = [];

  // Check Allergy Contradictions
  medications.forEach((med) => {
    const medText = `${med.brandName} ${med.genericName} ${med.clinicalNotes || ''}`.toLowerCase();
    patient.knownAllergies.forEach((allergy) => {
      const allergyLower = allergy.toLowerCase();
      let matched = false;

      if (allergyLower.includes('penicillin') && (medText.includes('amoxicillin') || medText.includes('penicillin') || medText.includes('ampicillin') || medText.includes('augmentin'))) {
        matched = true;
      } else if (allergyLower.includes('sulfa') && (medText.includes('sulfamethoxazole') || medText.includes('bactrim') || medText.includes('sulfasalazine'))) {
        matched = true;
      } else if (medText.includes(allergyLower)) {
        matched = true;
      }

      if (matched) {
        allergyAlerts.push({
          medicationName: med.brandName,
          allergen: allergy,
          warning: `CRITICAL ALLERGY CONFLICT: ${med.brandName} (${med.genericName}) is derived from or cross-reactive with ${allergy}. Taking this can trigger an immediate allergic reaction or anaphylaxis!`,
        });
        doctorQuestions.push(`"Doctor, I have a documented ${allergy} allergy. Is ${med.brandName} safe, or should we switch to an alternative class?"`);
      }
    });
  });

  // Check Pairwise Drug-Drug Interactions
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const medA = medications[i];
      const medB = medications[j];
      const nameA = medA.genericName.toLowerCase();
      const nameB = medB.genericName.toLowerCase();

      // Warfarin + NSAID (Ibuprofen / Naproxen / Aspirin)
      if (
        (nameA.includes('warfarin') && (nameB.includes('ibuprofen') || nameB.includes('advil') || nameB.includes('motrin') || nameB.includes('naproxen') || nameB.includes('aspirin'))) ||
        (nameB.includes('warfarin') && (nameA.includes('ibuprofen') || nameA.includes('advil') || nameA.includes('motrin') || nameA.includes('naproxen') || nameA.includes('aspirin')))
      ) {
        conflicts.push({
          id: `conflict-${medA.id}-${medB.id}`,
          drugAId: medA.id,
          drugBId: medB.id,
          drugAName: medA.brandName,
          drugBName: medB.brandName,
          severity: 'critical',
          headline: 'Severe Internal Bleeding Hazard',
          plainExplanation: `${medA.brandName} thins your blood, while ${medB.brandName} (an NSAID) irritates the stomach lining and stops platelets from plugging small tears. Together, they multiply your risk of dangerous stomach ulcers and internal bleeding by over 400%.`,
          clinicalMechanism: 'Dual antiplatelet/anticoagulant synergy + gastric mucosal prostaglandin inhibition.',
          actionRequired: 'DO NOT TAKE TOGETHER. Ask your pharmacist for a safe alternative like Acetaminophen (Tylenol) for arthritis or pain relief.',
        });
        doctorQuestions.push(`"Since I am taking Warfarin for stroke prevention, what is the safest pain reliever for my joint stiffness instead of Ibuprofen?"`);
      }

      // Lisinopril + Potassium-sparing or High Potassium
      if (
        (nameA.includes('lisinopril') && nameB.includes('spironolactone')) ||
        (nameB.includes('lisinopril') && nameA.includes('spironolactone'))
      ) {
        conflicts.push({
          id: `conflict-${medA.id}-${medB.id}`,
          drugAId: medA.id,
          drugBId: medB.id,
          drugAName: medA.brandName,
          drugBName: medB.brandName,
          severity: 'moderate',
          headline: 'Elevated Blood Potassium Risk (Hyperkalemia)',
          plainExplanation: `Both medications hold onto potassium in your kidneys. Too much potassium in your bloodstream can disrupt your heart rhythm and cause chest palpitations.`,
          clinicalMechanism: 'Combined inhibition of aldosterone pathway causing potassium retention.',
          actionRequired: 'Your doctor should monitor your blood electrolytes with a routine lab draw every 3 to 6 months.',
        });
      }

      // Metformin + Contrast or Special Alcohol synergy
      if (
        (nameA.includes('metformin') && nameB.includes('cimetidine')) ||
        (nameB.includes('metformin') && nameA.includes('cimetidine'))
      ) {
        conflicts.push({
          id: `conflict-${medA.id}-${medB.id}`,
          drugAId: medA.id,
          drugBId: medB.id,
          drugAName: medA.brandName,
          drugBName: medB.brandName,
          severity: 'moderate',
          headline: 'Reduced Kidney Clearance of Metformin',
          plainExplanation: `Taking these together slows down how fast your kidneys clear Metformin, increasing the chance of stomach sickness and fatigue.`,
          clinicalMechanism: 'Competition for renal tubular organic cation transporter 2 (OCT2).',
          actionRequired: 'Consider an alternative acid-reflux medication that does not block kidney clearance.',
        });
      }
    }
  }

  // Aggregate Food Warnings
  medications.forEach((med) => {
    med.foodInteractions.forEach((fw) => {
      foodWarnings.push({
        medicationName: med.brandName,
        warning: fw,
      });
    });
  });

  // Polypharmacy Complexity Calculation
  const totalPills = medications.length;
  const timeSlots = new Set<string>();
  medications.forEach((m) => m.timeOfDay.forEach((t) => timeSlots.add(t)));

  let complexityLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let recommendation = 'Your medication schedule is relatively simple and manageable.';

  if (totalPills >= 5 || (totalPills >= 4 && conflicts.length > 0)) {
    complexityLevel = 'Severe';
    recommendation = 'You are taking 5+ medications across multiple time slots. High risk of missed doses or interaction. Use our daily visual checklist and consider a weekly organizer.';
  } else if (totalPills >= 4 || timeSlots.size >= 3) {
    complexityLevel = 'High';
    recommendation = 'Moderate-to-high polypharmacy. Your regimen spans 3+ daily intervals. Keep strict morning and evening meal routines.';
  } else if (totalPills >= 2) {
    complexityLevel = 'Moderate';
    recommendation = 'Routine regimen. Follow food-timing rules closely.';
  }

  if (doctorQuestions.length === 0) {
    doctorQuestions.push(`"Doctor, can we do a quick 5-minute review to see if any of my ${totalPills} current prescriptions can be de-prescribed or simplified?"`);
    doctorQuestions.push(`"Are my kidney and liver function lab numbers optimal for my current doses of ${medications.map((m) => m.brandName).slice(0, 3).join(', ')}?"`);
  }

  return {
    conflicts,
    allergyAlerts,
    foodWarnings,
    polypharmacyScore: {
      pillCount: totalPills,
      complexityLevel,
      timingSlotsCovered: timeSlots.size,
      recommendation,
    },
    doctorQuestions,
  };
}
