import { SamplePrescriptionPreset } from '../types';

export const SAMPLE_PRESCRIPTION_PRESETS: SamplePrescriptionPreset[] = [
  {
    id: 'preset-ibuprofen',
    title: 'Advil / Ibuprofen 400mg (OTC Trap)',
    badge: '🚨 Critical Conflict Test',
    simulatedBottleText: `WALGREENS PHARMACY #04812
RX #4892019-OTC   QTY: 50
TAKE 1 TABLET (400MG) BY MOUTH EVERY 6-8 HOURS AS NEEDED FOR KNEE JOINT PAIN.
DO NOT EXCEED 1200MG/24HRS. TAKE WITH FOOD.
CAUTION: MAY CAUSE STOMACH BLEEDING.`,
    scenarioNote: 'Common scenario: Patient Eleanor buys over-the-counter Advil for knee arthritis. Watch ScriptClear instantly detect the fatal gastrointestinal bleeding conflict with her active Warfarin!',
    triggersConflictWith: 'Warfarin Sodium',
    medication: {
      brandName: 'Advil / Motrin',
      genericName: 'Ibuprofen',
      dosage: '400 mg',
      form: 'tablet',
      color: '#fb923c', // orange
      shape: 'oval',
      purposePlain: 'Reduces joint swelling, arthritis inflammation, and dull aches.',
      condition: 'Osteoarthritis Knee Pain',
      prescribedBy: 'Self-Administered (Over The Counter)',
      rxNumber: 'OTC-JOINT-400',
      pharmacyPhone: '(555) 234-5678',
      instructionsPlain: 'Take 1 oval orange tablet with a snack only when pain is severe. Maximum 3 per day.',
      clinicalNotes: 'Non-Steroidal Anti-Inflammatory Drug (NSAID). High GI ulceration risk with anticoagulants.',
      timeOfDay: ['noon'],
      foodInstruction: 'with_food',
      warnings: [
        'CRITICAL: Must not be taken with blood thinners without direct physician supervision.',
        'Always take with food or milk to protect stomach lining.',
      ],
      foodInteractions: [
        {
          item: 'Alcohol',
          hazard: 'Substantially increases risk of acute stomach ulcers and bleeding.',
          iconName: 'ShieldAlert',
          recommendation: 'Do not consume alcoholic beverages.',
        },
      ],
      refillDaysLeft: 30,
      totalPills: 50,
      remainingPills: 50,
      datePrescribed: '2026-09-19',
    },
  },
  {
    id: 'preset-amoxicillin',
    title: 'Amoxicillin 500mg (Allergy Trap)',
    badge: '🛑 Penicillin Allergy Alert',
    simulatedBottleText: `URGENT CARE CLINIC RX
RX #991048-A   QTY: 21
AMOXICILLIN 500 MG CAPSULE
TAKE 1 CAPSULE 3 TIMES DAILY FOR 7 DAYS UNTIL FINISHED FOR BRONCHIAL INFECTION.
DR. CHOPRA, MD`,
    scenarioNote: 'Common scenario: An urgent care doctor unaware of Eleanor\'s hospital chart prescribes Amoxicillin. ScriptClear intercepts it immediately against her recorded Penicillin allergy!',
    triggersConflictWith: 'Penicillin Allergy',
    medication: {
      brandName: 'Amoxil',
      genericName: 'Amoxicillin Trihydrate',
      dosage: '500 mg',
      form: 'capsule',
      color: '#f472b6', // pink
      shape: 'capsule',
      purposePlain: 'Kills harmful bacterial infections in the chest and respiratory system.',
      condition: 'Acute Bronchitis',
      prescribedBy: 'Dr. Vivek Chopra, MD',
      rxNumber: 'RX-991048-A',
      pharmacyPhone: '(555) 998-1122',
      instructionsPlain: 'Take 1 pink capsule every 8 hours (morning, noon, bedtime) with a full glass of water.',
      clinicalNotes: 'Beta-lactam antibiotic. Cross-reactive with Penicillin allergies.',
      timeOfDay: ['morning', 'noon', 'bedtime'],
      foodInstruction: 'plenty_water',
      warnings: [
        'Finish all pills even if you feel completely cured.',
        'Seek emergency help immediately if hives, lip swelling, or wheezing occurs.',
      ],
      foodInteractions: [
        {
          item: 'Probiotics / Yogurt',
          hazard: 'Antibiotics kill beneficial gut bacteria causing diarrhea.',
          iconName: 'Info',
          recommendation: 'Eat cultured yogurt or probiotics 2 hours apart from this pill.',
        },
      ],
      refillDaysLeft: 7,
      totalPills: 21,
      remainingPills: 21,
      datePrescribed: '2026-09-19',
    },
  },
  {
    id: 'preset-levothyroxine',
    title: 'Levothyroxine 50mcg (Food Timing Rule)',
    badge: '☕ Strict Timing / Coffee Rule',
    simulatedBottleText: `COMMUNITY HEALTH RX
RX #112940-T   QTY: 90
LEVOTHYROXINE SODIUM 50 MCG
TAKE 1 TABLET BY MOUTH DAILY IN THE MORNING ON AN EMPTY STOMACH 30-60 MINUTES BEFORE BREAKFAST.
DR. REBECCA STONE, MD`,
    scenarioNote: 'Demonstrates complex food/timing rules: Must be taken alone on an empty stomach with plain water. Coffee, milk, or calcium within 60 minutes deactivates the drug.',
    medication: {
      brandName: 'Synthroid',
      genericName: 'Levothyroxine Sodium',
      dosage: '50 mcg',
      form: 'tablet',
      color: '#e2e8f0', // off-white
      shape: 'round',
      purposePlain: 'Replaces natural thyroid hormone to keep your daily energy, metabolism, and body warmth steady.',
      condition: 'Hypothyroidism',
      prescribedBy: 'Dr. Rebecca Stone, MD',
      rxNumber: 'RX-112940-T',
      pharmacyPhone: '(555) 234-5678',
      instructionsPlain: 'Take 1 tiny round tablet first thing upon waking. Wait at least 45 minutes before eating or drinking coffee.',
      clinicalNotes: 'Synthetic T4. Bioavailability severely hindered by food, coffee, and polyvalent cations.',
      timeOfDay: ['morning'],
      foodInstruction: 'empty_stomach',
      warnings: [
        'Take ONLY with plain water.',
        'Wait at least 45 to 60 minutes before breakfast, tea, or coffee.',
        'Do not take calcium or iron supplements within 4 hours of this pill.',
      ],
      foodInteractions: [
        {
          item: 'Morning Coffee / Espresso',
          hazard: 'Coffee decreases thyroid absorption by up to 55%.',
          iconName: 'AlertTriangle',
          recommendation: 'Wait a full 60 minutes after taking this tablet before your first morning coffee.',
        },
        {
          item: 'Calcium / Dairy / Tums',
          hazard: 'Calcium chemically binds to the drug in your stomach, rendering it useless.',
          iconName: 'AlertCircle',
          recommendation: 'Keep milk, cheese, and antacids 4 hours away from this dose.',
        },
      ],
      refillDaysLeft: 45,
      totalPills: 90,
      remainingPills: 72,
      datePrescribed: '2026-08-20',
    },
  },
];
