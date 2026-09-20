import React, { useState } from 'react';
import { FileText, Sparkles, AlertTriangle, FileCode } from 'lucide-react';
import { AnalyzedDocument, Medication, PatientProfile } from '../../types';
import { FileUploader } from '../ui/FileUploader';
import { LoadingState } from '../ui/LoadingState';
import { DocumentService } from '../../services/documentService';
import { useToast } from '../ui/Toast';

export interface DocumentUploaderProps {
  onDocumentAnalyzed: (doc: AnalyzedDocument) => void;
  existingMedications: Medication[];
  patient: PatientProfile;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentAnalyzed,
  existingMedications,
  patient,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const { toast } = useToast();

  const handleStartAnalysis = (fileToAnalyze?: File | null, customText?: string) => {
    const file = fileToAnalyze || selectedFile;
    const text = customText || pastedText || (file ? file.name : 'Clinical prescription');

    setIsAnalyzing(true);

    setTimeout(() => {
      const doc = DocumentService.analyzeDocument(
        file || { name: 'Pasted-Prescription-Text.txt', size: 1024 },
        text,
        existingMedications,
        patient
      );

      setIsAnalyzing(false);
      onDocumentAnalyzed(doc);

      toast({
        type: doc.status === 'flagged_hazard' ? 'warning' : 'success',
        title: doc.status === 'flagged_hazard' ? 'Hazard Flagged' : 'Document Analyzed',
        description:
          doc.status === 'flagged_hazard'
            ? 'A critical interaction or contraindication was flagged.'
            : 'Clinical text converted into clear, plain language.',
      });
    }, 1800);
  };

  const handleSelectSample = (sampleName: string, sampleContent: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const doc = DocumentService.analyzeDocument(
        { name: sampleName, size: 450000 },
        sampleContent,
        existingMedications,
        patient
      );
      setIsAnalyzing(false);
      onDocumentAnalyzed(doc);
      toast({
        type: doc.status === 'flagged_hazard' ? 'warning' : 'success',
        title: 'Sample Document Analyzed',
        description: `Loaded and verified ${sampleName}.`,
      });
    }, 1400);
  };

  if (isAnalyzing) {
    return (
      <LoadingState
        title="Analyzing Prescription Document..."
        subtitle="Extracting pharmacology directives, cross-referencing active medications, and validating against clinical safety databases."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload mode tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paste Text
          </button>
        </div>

        <span className="text-[11px] text-slate-400">
          Supported: PDF, DOCX, TXT, PNG, JPG (up to 15MB)
        </span>
      </div>

      {activeTab === 'upload' ? (
        <FileUploader
          onFileSelect={(file) => setSelectedFile(file)}
          onAnalyze={(file) => handleStartAnalysis(file)}
          isAnalyzing={isAnalyzing}
        />
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Paste Prescription or Clinical Text
            </label>
            <textarea
              rows={5}
              placeholder="e.g. WALGREENS PHARMACY - TAKE 1 TABLET (400MG) BY MOUTH EVERY 6-8 HOURS AS NEEDED FOR KNEE JOINT PAIN..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full text-xs sm:text-sm font-mono p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleStartAnalysis(null, pastedText)}
              disabled={!pastedText.trim() || isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition disabled:opacity-50 cursor-pointer"
            >
              Analyze Pasted Text
            </button>
          </div>
        </div>
      )}

      {/* Quick Test Clinical Document Presets */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Or test with a sample medical document
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() =>
              handleSelectSample(
                'Walgreens-OTC-Advil-Ibuprofen-400mg.pdf',
                'WALGREENS PHARMACY #04812 - TAKE 1 TABLET (400MG) BY MOUTH EVERY 6-8 HOURS FOR KNEE PAIN. CAUTION: STOMACH BLEEDING.'
              )
            }
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-900 hover:bg-rose-50/20 transition text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600">
                Walgreens-OTC-Advil-400mg.pdf
              </span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                Bleed Hazard Test
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              OTC Ibuprofen 400mg tablet. Tests conflict detection with active Warfarin blood thinner.
            </p>
          </button>

          <button
            onClick={() =>
              handleSelectSample(
                'UrgentCare-Amoxicillin-500mg-Rx.pdf',
                'URGENT CARE CLINIC RX - AMOXICILLIN 500 MG CAPSULE - TAKE 1 CAPSULE 3 TIMES DAILY FOR 7 DAYS.'
              )
            }
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300 dark:hover:border-amber-900 hover:bg-amber-50/20 transition text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                UrgentCare-Amoxicillin-500mg.pdf
              </span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                Penicillin Allergy Test
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Antibiotic prescribed at urgent care. Tests allergy cross-check against patient Penicillin allergy.
            </p>
          </button>

          <button
            onClick={() =>
              handleSelectSample(
                'St-Jude-Cardiology-Discharge-Summary.pdf',
                'ST. JUDE MEDICAL CENTER - CARDIOLOGY DISCHARGE SUMMARY: WARFARIN SODIUM 5MG DAILY AT 6PM. LISINOPRIL 10MG MORNING.'
              )
            }
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-sky-900 hover:bg-sky-50/20 transition text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600">
                Cardiology-Discharge-Summary.pdf
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                Care Plan
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hospital discharge record with multiple medications, INR testing, and dietary guidelines.
            </p>
          </button>

          <button
            onClick={() =>
              handleSelectSample(
                'Endocrinology-Metformin-ER-CarePlan.docx',
                'MEMORIAL ENDOCRINOLOGY - METFORMIN EXTENDED RELEASE 500MG TWICE DAILY WITH BREAKFAST AND DINNER.'
              )
            }
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-sky-900 hover:bg-sky-50/20 transition text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600">
                Endocrinology-Metformin-ER.docx
              </span>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-full">
                Diabetes Protocol
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Type 2 diabetes care plan with meal timing instructions and hydration notes.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
