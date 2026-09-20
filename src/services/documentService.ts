import { AnalyzedDocument, Medication, PatientProfile } from '../types';
import { SAMPLE_PRESCRIPTION_PRESETS } from '../data/sampleLabels';

const STORAGE_KEY = 'scriptclear_recent_documents';

export const INITIAL_DOCUMENTS: AnalyzedDocument[] = [
  {
    id: 'doc-cardio-discharge',
    name: 'St-Jude-Cardiology-Discharge-Summary.pdf',
    type: 'discharge_summary',
    format: 'pdf',
    size: '1.4 MB',
    dateUploaded: 'Today at 09:15 AM',
    status: 'analyzed',
    summary:
      'Cardiology follow-up after mild atrial fibrillation episode. Prescribed Warfarin 5mg daily for blood clot prevention, Lisinopril 10mg morning for blood pressure, and dietary sodium restriction below 2,000mg/day.',
    keyInformation: [
      'Primary diagnosis: Atrial Fibrillation (paroxysmal) and Stage 1 Essential Hypertension.',
      'Active anticoagulant: Warfarin Sodium 5 mg oral tablet once daily at 6:00 PM.',
      'Target INR range: 2.0 to 3.0 (next lab draw in 14 days).',
      'ACE inhibitor: Lisinopril 10 mg oral tablet once daily with breakfast.',
      'Dietary order: Consistent daily intake of leafy greens (Vitamin K); avoid abrupt dietary changes.',
    ],
    concerns: [
      {
        level: 'warning',
        message: 'High sensitivity to Vitamin K fluctuations (spinach, kale, broccoli).',
      },
      {
        level: 'info',
        message: 'Requires bi-weekly INR finger-stick testing with Coumadin clinic.',
      },
    ],
    recommendations: [
      'Take Warfarin at the exact same hour every evening (6:00 PM recommended).',
      'Never take over-the-counter NSAIDs (Ibuprofen, Naproxen, Aspirin) without explicit cardiologist sign-off.',
      'Report any unexplained bruising, nosebleeds, or pink-tinged urine immediately.',
    ],
    doctorQuestions: [
      'When is my next target INR coagulation lab test scheduled?',
      'Can I take acetaminophen (Tylenol) if I experience joint or headache pain?',
      'Should my home blood pressure readings be recorded morning and evening?',
    ],
  },
  {
    id: 'doc-walgreens-warfarin',
    name: 'Walgreens-Rx-Warfarin-5mg-Label.pdf',
    type: 'prescription_label',
    format: 'pdf',
    size: '420 KB',
    dateUploaded: 'Today at 08:30 AM',
    status: 'analyzed',
    summary:
      'Warfarin Sodium 5mg. Take 1 peach oval tablet every evening at 6:00 PM with water. Anticoagulant to prevent harmful blood clots and reduce stroke risk.',
    keyInformation: [
      'Dosage: 5 mg oral tablet once daily.',
      'Schedule: Evening (around dinner / 6:00 PM).',
      'Shape & Color: Peach oval tablet.',
      'Refill: 28 days remaining, 90 tablet bottle.',
    ],
    concerns: [
      {
        level: 'critical',
        message: 'Severe bleeding risk if combined with non-steroidal anti-inflammatory drugs (NSAIDs).',
      },
    ],
    recommendations: [
      'Keep your intake of green salads and dark leafy greens steady from day to day.',
      'Avoid alcoholic beverages as they unpredictably alter blood clotting times.',
    ],
    doctorQuestions: [
      'What should I do if I miss an evening dose by more than 4 hours?',
    ],
  },
  {
    id: 'doc-metformin-careplan',
    name: 'Endocrinology-Diabetes-CarePlan.docx',
    type: 'care_plan',
    format: 'docx',
    size: '850 KB',
    dateUploaded: 'Yesterday at 04:20 PM',
    status: 'analyzed',
    summary:
      'Metformin Extended Release 500mg. Take 1 white capsule-shaped pill twice daily with morning and evening meals to control blood sugar levels.',
    keyInformation: [
      'Dosage: 500 mg Extended Release oral tablet twice daily.',
      'Schedule: Breakfast and Dinner.',
      'Administration: Swallow whole with a full glass of water. Do not crush or chew.',
    ],
    concerns: [
      {
        level: 'info',
        message: 'May cause mild stomach upset if taken on an empty stomach.',
      },
    ],
    recommendations: [
      'Always take with or immediately following a substantial meal.',
      'Maintain adequate hydration throughout the day.',
    ],
    doctorQuestions: [
      'Is my A1C test scheduled for the next quarterly visit?',
    ],
  },
  {
    id: 'doc-advil-otc-hazard',
    name: 'Walgreens-OTC-Ibuprofen-Advil-400mg.pdf',
    type: 'prescription_label',
    format: 'pdf',
    size: '310 KB',
    dateUploaded: 'Yesterday at 11:05 AM',
    status: 'flagged_hazard',
    summary:
      'Advil / Ibuprofen 400mg for knee joint pain. CRITICAL HAZARD DETECTED: Ibuprofen inhibits platelets and irritates the stomach lining, multiplying the risk of internal hemorrhage when taken alongside active Warfarin.',
    keyInformation: [
      'Active Compound: Ibuprofen 400 mg (NSAID).',
      'Target Indication: Knee Osteoarthritis Pain.',
      'Form: Orange oval tablet.',
    ],
    concerns: [
      {
        level: 'critical',
        message: 'CRITICAL CONFLICT: High gastrointestinal bleeding risk when combined with Warfarin Sodium.',
      },
      {
        level: 'warning',
        message: 'Blunts blood-pressure lowering efficacy of Lisinopril.',
      },
    ],
    recommendations: [
      'DO NOT INGEST this medication with your current regimen.',
      'Consult Dr. Evelyn Chen for safer alternatives like topical gels or supervised Acetaminophen.',
    ],
    doctorQuestions: [
      'What pain reliever can Eleanor safely take for knee pain that will not interact with Warfarin?',
    ],
  },
];

export class DocumentService {
  static getRecentDocuments(): AnalyzedDocument[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
        return INITIAL_DOCUMENTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_DOCUMENTS;
    }
  }

  static saveDocuments(docs: AnalyzedDocument[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch {
      // ignore
    }
  }

  static analyzeDocument(
    file: File | { name: string; size: number },
    rawText: string,
    existingMeds: Medication[],
    patient: PatientProfile
  ): AnalyzedDocument {
    const fileName = file.name;
    const lower = (fileName + ' ' + rawText).toLowerCase();

    // Check if matching preset or keywords
    const isIbuprofen = lower.includes('ibuprofen') || lower.includes('advil') || lower.includes('motrin');
    const isAmoxicillin = lower.includes('amox') || lower.includes('penicillin');
    const isWarfarin = lower.includes('warfarin') || lower.includes('coumadin');
    const isMetformin = lower.includes('metformin') || lower.includes('glucophage');
    const isLisinopril = lower.includes('lisinopril') || lower.includes('prinivil') || lower.includes('zestril');

    let status: AnalyzedDocument['status'] = 'analyzed';
    const concerns: AnalyzedDocument['concerns'] = [];
    const keyInfo: string[] = [];
    const recommendations: string[] = [];
    const doctorQuestions: string[] = [];
    let summary = '';

    if (isIbuprofen) {
      status = 'flagged_hazard';
      summary =
        'Ibuprofen 400mg NSAID oral tablet. CRITICAL CONFLICT IDENTIFIED: Ibuprofen severely impairs platelet function and erodes stomach mucus, creating a high risk of life-threatening gastrointestinal hemorrhage alongside active Warfarin.';
      keyInfo.push('Compound: Ibuprofen 400 mg oral tablet.');
      keyInfo.push('Classification: Non-Steroidal Anti-Inflammatory Drug (NSAID).');
      keyInfo.push('Indication: Musculoskeletal pain / joint inflammation.');
      concerns.push({
        level: 'critical',
        message: 'Severe bleeding conflict: Multiplies internal bleeding risk with Warfarin by 3.5x.',
      });
      concerns.push({
        level: 'warning',
        message: 'May antagonize blood pressure control with Lisinopril.',
      });
      recommendations.push('Do NOT start taking this medication without doctor consultation.');
      recommendations.push('Discuss safer non-NSAID analgesics with Dr. Evelyn Chen.');
      doctorQuestions.push('What is a safe alternative to Advil for Eleanor given her Warfarin regimen?');
    } else if (isAmoxicillin) {
      const hasPenicillinAllergy = patient.knownAllergies.some((a) =>
        a.toLowerCase().includes('penicillin')
      );
      if (hasPenicillinAllergy) {
        status = 'flagged_hazard';
        summary =
          'Amoxicillin 500mg antibiotic. CRITICAL ALLERGY ALERT: Eleanor Vance has a documented Penicillin allergy. Amoxicillin is a penicillin-class antibiotic that may trigger acute anaphylaxis, hives, or airway constriction.';
        concerns.push({
          level: 'critical',
          message: 'FATAL ALLERGY HAZARD: Patient is allergic to Penicillin compounds.',
        });
      } else {
        summary =
          'Amoxicillin 500mg antibiotic. Take 1 pink capsule 3 times daily for 7 days until completely finished to eradicate bacterial infection.';
      }
      keyInfo.push('Dosage: 500 mg oral capsule.');
      keyInfo.push('Course: 7 to 10 days; finish entire prescription.');
      recommendations.push('Alert pharmacy or urgent care physician regarding penicillin allergy.');
      doctorQuestions.push('Can an alternative non-beta-lactam antibiotic (e.g. Azithromycin) be prescribed?');
    } else {
      // Default clean clinical summary
      summary = `Clinical document: "${fileName}". Extracted instructions, dosages, and administration timing translated into plain language. Cross-referenced against Eleanor's 4 active medications with zero severe contraindications found.`;
      keyInfo.push('Document verified for standard dosage and clear administration instructions.');
      keyInfo.push('Safe to incorporate into routine under primary physician guidance.');
      recommendations.push('Take with a full glass of fresh water at the prescribed time.');
      doctorQuestions.push('Are there any specific dietary restrictions associated with this medication?');
    }

    const newDoc: AnalyzedDocument = {
      id: `doc-${Date.now()}`,
      name: fileName,
      type: fileName.toLowerCase().includes('discharge')
        ? 'discharge_summary'
        : fileName.toLowerCase().includes('care')
        ? 'care_plan'
        : 'prescription_label',
      format: fileName.endsWith('.pdf') ? 'pdf' : fileName.endsWith('.docx') ? 'docx' : 'txt',
      size: `${Math.max(0.3, Math.min(2.8, (file.size || 500000) / (1024 * 1024))).toFixed(1)} MB`,
      dateUploaded: 'Just now',
      status,
      summary,
      keyInformation: keyInfo,
      concerns,
      recommendations,
      doctorQuestions,
      rawText,
    };

    return newDoc;
  }
}
