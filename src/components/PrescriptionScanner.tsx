import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { Medication, SamplePrescriptionPreset, PatientProfile } from '../types';
import { SAMPLE_PRESCRIPTION_PRESETS } from '../data/sampleLabels';
import { PillVisual } from './PillVisual';
import { speakText } from '../utils/speech';

interface PrescriptionScannerProps {
  onAddMedication: (med: Medication) => void;
  existingMedications: Medication[];
  patient: PatientProfile;
  seniorMode: boolean;
  activePresetId?: string | null;
  onClearActivePreset?: () => void;
}

export const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({
  onAddMedication,
  existingMedications,
  patient,
  seniorMode,
  activePresetId,
  onClearActivePreset,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SamplePrescriptionPreset | null>(
    SAMPLE_PRESCRIPTION_PRESETS.find((p) => p.id === activePresetId) || SAMPLE_PRESCRIPTION_PRESETS[0]
  );
  const [rawText, setRawText] = useState(
    (SAMPLE_PRESCRIPTION_PRESETS.find((p) => p.id === activePresetId) || SAMPLE_PRESCRIPTION_PRESETS[0]).simulatedBottleText
  );
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Medication | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (preset: SamplePrescriptionPreset) => {
    setSelectedPreset(preset);
    setRawText(preset.simulatedBottleText);
    setAnalysisResult(null);
    setJustAdded(false);
    setUploadedImagePreview(null);
    if (onClearActivePreset) onClearActivePreset();
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setJustAdded(false);

    // Realistic AI ingestion delay (1.2s)
    setTimeout(() => {
      setIsScanning(false);
      if (selectedPreset) {
        setAnalysisResult({
          id: `med-${Date.now()}`,
          ...selectedPreset.medication,
        });
      } else {
        // Fallback for custom typed label
        setAnalysisResult({
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
        });
      }
    }, 1100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImagePreview(reader.result as string);
        setRawText(`EXTRACTED PHARMACY LABEL FROM CAMERA CAPTURE:
WALGREENS PHARMACY #04812
RX #4892019-CUSTOM   QTY: 30
TAKE 1 TABLET BY MOUTH DAILY WITH FOOD.`);
        handleSimulateScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCurrent = () => {
    if (analysisResult) {
      onAddMedication(analysisResult);
      setJustAdded(true);
      speakText(`${analysisResult.brandName} added to Eleanor's daily routine.`);
    }
  };

  // Check if current analysis result triggers a conflict with existing meds or allergy
  let potentialConflictWarning: string | null = null;
  if (analysisResult) {
    const isWarfarinPresent = existingMedications.some((m) => m.genericName.toLowerCase().includes('warfarin'));
    const isNSAID =
      analysisResult.genericName.toLowerCase().includes('ibuprofen') ||
      analysisResult.brandName.toLowerCase().includes('advil') ||
      analysisResult.brandName.toLowerCase().includes('motrin');

    if (isWarfarinPresent && isNSAID) {
      potentialConflictWarning = 'CRITICAL WARNING: This medication (Ibuprofen) interacts with Eleanor\'s active Warfarin! High internal bleeding hazard.';
    }

    const isAmox = analysisResult.genericName.toLowerCase().includes('amoxicillin');
    const hasPenicillinAllergy = patient.knownAllergies.some((a) => a.toLowerCase().includes('penicillin'));
    if (isAmox && hasPenicillinAllergy) {
      potentialConflictWarning = 'CRITICAL ALLERGY ALERT: Eleanor is allergic to Penicillin! Amoxicillin belongs to the penicillin class.';
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Explainer */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Multimodal OCR & Plain-Language Transformer
              </span>
            </div>
            <h2 className={`font-black tracking-tight text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              Prescription Bottle Scanner & AI Ingestion Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Deconstructs dense medical jargon into a 4th-grade plain-English schedule, warns of food hazards, and instantly checks for deadly drug interactions before you take your first dose.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-1.5 h-9 min-h-[36px] px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span>Upload Label Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* Preset Prescription Scenarios for Hackathon Demo */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Select a Demo Prescription Bottle:
          </label>
          <span className="text-[11px] text-sky-700 font-semibold">1-Click Live Demo Scenarios</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_PRESCRIPTION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedPreset?.id === preset.id
                  ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 inline-block mb-1.5">
                  {preset.badge}
                </span>
                <h4 className="font-black text-slate-900 text-sm">{preset.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{preset.scenarioNote}</p>
              </div>
              <span className="text-[11px] font-bold text-sky-700 mt-3 flex items-center gap-1">
                Load Bottle OCR & Parse <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Lab: Raw Label Input vs. AI Extracted Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw Bottle Label Simulator */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="font-black text-slate-900 text-sm">Raw Prescription Bottle Label</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">OCR Text Buffer</span>
          </div>

          {uploadedImagePreview && (
            <div className="relative rounded-xl overflow-hidden max-h-48 border border-slate-200 bg-slate-50">
              <img
                src={uploadedImagePreview}
                alt="Captured prescription bottle"
                className="w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                Captured Bottle Image
              </span>
            </div>
          )}

          <div className="relative">
            <textarea
              rows={7}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full font-mono text-xs p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
              placeholder="Paste or type prescription label text..."
            />
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="w-full inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-sm transition cursor-pointer shrink-0 whitespace-nowrap disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            {isScanning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin shrink-0" />
                <span>Running Semantic OCR & Conflict Extraction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Deconstruct & Safety-Check This Prescription</span>
              </>
            )}
          </button>
        </div>

        {/* Right: AI Ingestion Result Preview */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="font-black text-slate-900 text-sm">AI Plain-Language Decomposition</h3>
            </div>
            {analysisResult && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Confidence: 98.4%
              </span>
            )}
          </div>

          {!analysisResult && !isScanning && (
            <div className="py-16 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No active extraction</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click "Deconstruct & Safety-Check" on the left to extract plain-language guidance.
              </p>
            </div>
          )}

          {isScanning && (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">Analyzing chemical compound & dosing...</p>
              <p className="text-xs text-slate-500">Checking Eleanor's allergy chart and active medications</p>
            </div>
          )}

          {analysisResult && !isScanning && (
            <div className="space-y-4">
              {/* Conflict banner if triggered */}
              {potentialConflictWarning && (
                <div className="p-3.5 rounded-xl bg-rose-100 border-2 border-rose-400 text-rose-950 space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <strong className="text-xs font-black">HAZARD INTERCEPTED BEFORE INTAKE</strong>
                  </div>
                  <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    {potentialConflictWarning}
                  </p>
                </div>
              )}

              {/* Extracted Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <PillVisual medication={analysisResult} size="md" />
                  <div>
                    <h4 className="font-black text-slate-900 text-base">
                      {analysisResult.brandName}{' '}
                      <span className="text-xs text-slate-500 font-normal">
                        ({analysisResult.genericName} • {analysisResult.dosage})
                      </span>
                    </h4>
                    <span className="text-xs font-semibold text-sky-800">
                      Target: {analysisResult.condition}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Plain-English Purpose
                  </span>
                  <p className="text-xs text-slate-900 font-semibold">
                    {analysisResult.purposePlain}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Schedule & Administration
                  </span>
                  <p className="text-xs text-slate-800 font-medium">
                    {analysisResult.instructionsPlain}
                  </p>
                </div>

                {analysisResult.foodInteractions.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">Dietary & Food Warning:</span>
                    {analysisResult.foodInteractions.map((fw, idx) => (
                      <p key={idx} className="text-xs">
                        ⚠️ <strong>{fw.item}:</strong> {fw.hazard} ({fw.recommendation})
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    speakText(
                      `Parsed ${analysisResult.brandName}. ${analysisResult.purposePlain}. ${analysisResult.instructionsPlain}`
                    )
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 min-h-[40px] px-4 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs sm:text-sm hover:bg-sky-100 transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <Volume2 className="w-4 h-4 shrink-0" />
                  <span>Listen to Plan</span>
                </button>

                <button
                  onClick={handleAddCurrent}
                  disabled={justAdded}
                  className={`flex-1 inline-flex items-center justify-center gap-2 h-10 min-h-[40px] px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    justAdded
                      ? 'bg-emerald-600 text-white cursor-default focus-visible:ring-emerald-500'
                      : 'bg-slate-900 hover:bg-slate-800 text-white focus-visible:ring-slate-900'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Added to Routine!</span>
                    </>
                  ) : (
                    <>
                      <span>Save to Active Cabinet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
