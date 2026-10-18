import React, { useState } from 'react';
import { Play, Trash2, BookOpen, Sparkles, SlidersHorizontal, CornerDownRight } from 'lucide-react';
import { SAMPLE_THREADS } from '../data/sampleThreads';

interface ThreadInputProps {
  emailText: string;
  setEmailText: (val: string) => void;
  onAnalyze: (tone: string, customInstruction: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

export const ThreadInput: React.FC<ThreadInputProps> = ({
  emailText,
  setEmailText,
  onAnalyze,
  isLoading,
  onClear,
}) => {
  const [selectedTone, setSelectedTone] = useState('Professional & Direct');
  const [customNote, setCustomNote] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const wordCount = emailText.trim() ? emailText.trim().split(/\s+/).length : 0;
  const charCount = emailText.length;

  const handleClearClick = () => {
    if (!emailText) return;
    if (confirmClear) {
      onClear();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const found = SAMPLE_THREADS.find((s) => s.id === sampleId);
    if (found) {
      setEmailText(found.content);
      setConfirmClear(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim() || isLoading) return;
    onAnalyze(selectedTone, customNote);
  };

  return (
    <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition-all dark:border-stone-800 dark:bg-stone-900">
      {/* Sample Threads Picker */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 dark:border-stone-800/60">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
          <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Quick start with a realistic sample thread:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_THREADS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample.id)}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300"
              title={sample.description}
            >
              {sample.title.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Large Text Area */}
        <div className="relative">
          <label htmlFor="email-thread-input" className="sr-only">
            Paste email thread
          </label>
          <textarea
            id="email-thread-input"
            rows={10}
            value={emailText}
            onChange={(e) => {
              setEmailText(e.target.value);
              if (confirmClear) setConfirmClear(false);
            }}
            placeholder={`Paste your entire email thread here...

Example:
From: Sarah <sarah@acme.com>
To: Alex <alex@acme.com>
Subject: Re: Product launch date

Hi Alex,
Let's confirm the launch for Thursday at 2 PM. Who is running the database migration? That is currently unassigned.

Best,
Sarah`}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-4 font-mono text-xs leading-relaxed text-stone-900 placeholder-stone-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder-stone-500"
            disabled={isLoading}
          />

          {/* Word / Char Counter */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium text-stone-500 shadow-xs backdrop-blur-xs dark:bg-stone-800/90 dark:text-stone-400">
            <span>{wordCount} words</span>
            <span>&bull;</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Reply Options Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Customize Reply Draft Options</span>
            <span className="text-[11px] text-stone-400 font-normal">
              ({selectedTone})
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-2.5 rounded-xl border border-stone-200/80 bg-stone-50/80 p-3.5 space-y-3 dark:border-stone-800 dark:bg-stone-800/40 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Reply Tone
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-indigo-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                  >
                    <option value="Professional & Direct">Professional & Direct (Default)</option>
                    <option value="Executive Brief">Executive Brief (High-level, bulleted)</option>
                    <option value="Warm & Collaborative">Warm & Collaborative (Team-friendly)</option>
                    <option value="Urgent & Action-Focused">Urgent & Action-Focused (Clear deadlines)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Optional context for the reply draft
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g., 'I am Liam, I can take the database task'"
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-indigo-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar & Analyse Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearClick}
              disabled={!emailText || isLoading}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all ${
                confirmClear
                  ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 disabled:opacity-40 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>{confirmClear ? 'Click again to confirm' : 'Clear all'}</span>
            </button>
            {confirmClear && (
              <span className="text-[11px] text-red-500 dark:text-red-400">
                Are you sure?
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!emailText.trim() || isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Analysing Thread...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyse Thread</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
