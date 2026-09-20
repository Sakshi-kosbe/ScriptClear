import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Share2,
  Printer,
  Volume2,
  HelpCircle,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { AnalyzedDocument, Medication } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { useSpeech } from '../../hooks/useSpeech';

export interface AnalysisResultViewProps {
  document: AnalyzedDocument;
  onBack?: () => void;
  onAddToCabinet?: (med: Medication) => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  document,
  onBack,
  onAddToCabinet,
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { speak, stop, isSpeaking } = useSpeech();

  const handleCopy = () => {
    const text = `
ScriptClear Document Analysis Report
Document: ${document.name}
Status: ${document.status.toUpperCase()}
Date: ${document.dateUploaded}

SUMMARY:
${document.summary}

KEY INFORMATION:
${document.keyInformation.map((k) => `• ${k}`).join('\n')}

POTENTIAL CONCERNS:
${document.concerns.map((c) => `⚠ [${c.level.toUpperCase()}] ${c.message}`).join('\n')}

RECOMMENDATIONS:
${document.recommendations.map((r) => `✓ ${r}`).join('\n')}

QUESTIONS FOR DOCTOR:
${document.doctorQuestions.map((q) => `? ${q}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      type: 'success',
      title: 'Analysis Copied',
      description: 'The plain-language summary and recommendations were copied to your clipboard.',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const text = `ScriptClear Clinical Analysis: ${document.name}\nGenerated: ${new Date().toLocaleString()}\n\nSUMMARY:\n${document.summary}\n\nKEY INFORMATION:\n${document.keyInformation.join('\n')}\n\nCONCERNS:\n${document.concerns.map(c => c.message).join('\n')}\n\nRECOMMENDATIONS:\n${document.recommendations.join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.name.replace(/\.[^/.]+$/, '')}-ScriptClear-Analysis.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      type: 'success',
      title: 'Report Downloaded',
      description: 'Your clinical document summary was downloaded.',
    });
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      const speechText = `Here is the ScriptClear analysis for ${document.name}. ${document.summary}. Main recommendations: ${document.recommendations.join('. ')}`;
      speak(speechText);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center h-8 w-8 min-h-[32px] min-w-[32px] rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Back to documents list"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                {document.name}
              </h2>
              {document.status === 'flagged_hazard' ? (
                <Badge variant="danger" pulse>
                  Hazard Detected
                </Badge>
              ) : (
                <Badge variant="success">Verified Analysis</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analyzed {document.dateUploaded} • Format: {document.format.toUpperCase()} • Size: {document.size}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSpeak}
            leftIcon={<Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-sky-600 animate-pulse' : ''}`} />}
            aria-label={isSpeaking ? 'Stop audio readout' : 'Listen to analysis'}
          >
            {isSpeaking ? 'Stop Audio' : 'Listen'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Flagged Hazard Banner if any */}
      {document.status === 'flagged_hazard' && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              High-Risk Polypharmacy Conflict Detected
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
              This document contains prescriptions or over-the-counter drugs that conflict severely with Eleanor's active regimen. Do not take before speaking with your physician.
            </p>
          </div>
        </div>
      )}

      {/* Main Analysis Sections */}
      <div className="space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Section 1: Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Plain-Language Summary
            </span>
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full">
              4th-Grade Reading Level
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 font-medium">
            {document.summary}
          </p>
        </div>

        {/* Section 2: Key Information */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Key Information
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {document.keyInformation.map((info, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{info}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Potential Concerns */}
        {document.concerns.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Potential Concerns & Contraindications
            </span>
            <div className="space-y-2">
              {document.concerns.map((concern, idx) => {
                const isCrit = concern.level === 'critical';
                const isWarn = concern.level === 'warning';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm ${
                      isCrit
                        ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                        : isWarn
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        isCrit ? 'text-rose-600' : isWarn ? 'text-amber-600' : 'text-slate-500'
                      }`}
                    />
                    <span className="leading-relaxed font-medium">{concern.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 4: Recommendations */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Suggested Recommendations
          </span>
          <div className="space-y-2">
            {document.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Doctor Consultation Questions */}
        {document.doctorQuestions.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Questions to Ask Your Doctor or Pharmacist
            </span>
            <div className="space-y-2">
              {document.doctorQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900 text-xs sm:text-sm text-sky-950 dark:text-sky-200"
                >
                  <HelpCircle className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
