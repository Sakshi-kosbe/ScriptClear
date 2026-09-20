import { Medication, SamplePrescriptionPreset } from '../types';

export class LabelScannerService {
  static parseSimulatedText(text: string, preset?: SamplePrescriptionPreset | null): Medication {
    if (preset) {
      return {
        id: `med-${Date.now()}`,
        ...preset.medication,
      };
    }

    // Default fallback extractor
    return {
      id: `med-${Date.now()}`,
      brandName: 'Custom Ingested Rx',
      genericName: 'Simulated Medication',
      dosage: '25 mg',
      form: 'tablet',
      color: '#bae6fd',
      shape: 'round',
      purposePlain: 'Supports stable metabolic equilibrium and tissue health.',
      condition: 'General Maintenance',
      prescribedBy: 'Dr. Robert Martinez, MD',
      rxNumber: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      pharmacyPhone: '(555) 234-5678',
      instructionsPlain: 'Take 1 round tablet once daily with water as directed.',
      timeOfDay: ['morning'],
      foodInstruction: 'plenty_water',
      warnings: ['Take with plenty of water.', 'Store at room temperature.'],
      foodInteractions: [],
      refillDaysLeft: 30,
      totalPills: 30,
      remainingPills: 30,
      datePrescribed: new Date().toISOString().split('T')[0],
    };
  }
}
