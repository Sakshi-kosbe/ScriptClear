import React from 'react';
import { FileText, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { AnalyzedDocument } from '../../types';

export interface RecentActivityProps {
  documents: AnalyzedDocument[];
  onSelectDocument: (doc: AnalyzedDocument) => void;
  onViewAllDocuments: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  documents,
  onSelectDocument,
  onViewAllDocuments,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Recent Analysis Activity
        </h3>
        <button
          onClick={onViewAllDocuments}
          className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View all documents</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {documents.slice(0, 4).map((doc) => {
          const isHazard = doc.status === 'flagged_hazard';
          return (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isHazard
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {isHazard ? <AlertTriangle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {doc.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {doc.summary}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isHazard
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {isHazard ? 'Hazard Flagged' : 'Verified'}
                </span>
                <div className="text-[10px] text-slate-400 mt-1">{doc.dateUploaded}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
