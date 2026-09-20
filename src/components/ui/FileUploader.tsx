import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface FileUploaderProps {
  onFileSelect: (file: File | null, contentText?: string) => void;
  onAnalyze: (file: File | null, contentText?: string) => void;
  isAnalyzing?: boolean;
  acceptedFormats?: string[];
  maxSizeMB?: number;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  onAnalyze,
  isAnalyzing = false,
  acceptedFormats = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg'],
  maxSizeMB = 15,
  className,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndHandle = (file: File) => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isAllowed = acceptedFormats.some(
      (f) => f.toLowerCase() === ext || file.type.includes(f.replace('.', ''))
    );

    if (!isAllowed) {
      setError(`Invalid file type. Please upload a PDF, DOCX, TXT, or image.`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandle(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFileSelect(null);
  };

  const handleAnalyzeClick = () => {
    if (!selectedFile) {
      setError('Please select or drop a document to analyze.');
      return;
    }
    onAnalyze(selectedFile);
  };

  return (
    <div className={cn('space-y-4 w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 bg-white dark:bg-slate-900',
          dragOver
            ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 ring-4 ring-sky-500/10'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50',
          error && 'border-rose-300 dark:border-rose-800'
        )}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-transform group-hover:scale-105">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              <span className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
                Click to upload
              </span>{' '}
              or drag & drop your document here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PDF, DOCX, TXT, or bottle label image (max {maxSizeMB}MB)
            </p>
          </div>
        </div>

        {selectedFile && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-5 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs"
          >
            <FileText className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                {selectedFile.name}
              </div>
              <div className="text-slate-500 text-[11px]">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="ml-2 text-slate-400 hover:text-rose-500 p-1 rounded-md transition"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>HIPAA-aligned client processing • Zero unencrypted storage</span>
        </div>

        <Button
          onClick={handleAnalyzeClick}
          disabled={!selectedFile || isAnalyzing}
          isLoading={isAnalyzing}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold shadow-xs"
        >
          {isAnalyzing ? 'Analyzing Document...' : 'Analyze Document'}
        </Button>
      </div>
    </div>
  );
};
