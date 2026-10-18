import React, { useState } from 'react';
import { MailCheck, ShieldCheck, HelpCircle, X, Sparkles, AlertCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 transition-colors dark:border-stone-800 dark:bg-stone-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
            <MailCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                Email-to-Action
              </h1>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/60 dark:text-indigo-300">
                v1.0
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Paste email thread &rarr; Instant structured summary, decisions, task table & draft reply
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Strict Grounding &bull; Zero Hallucination</span>
          </div>

          <button
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm hover:bg-stone-50 hover:text-stone-900 transition-all dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            <HelpCircle className="h-4 w-4 text-stone-500" />
            <span className="hidden sm:inline">How it works</span>
          </button>
        </div>
      </div>

      {/* Beginner Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-stone-900 dark:border dark:border-stone-800">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                How Email-to-Action Works
              </h2>
            </div>

            <div className="space-y-3.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <div className="rounded-lg bg-stone-50 p-3 dark:bg-stone-800/50">
                <span className="font-semibold text-stone-900 dark:text-white block mb-1">
                  1. Paste any messy email exchange
                </span>
                Copy an entire email thread from Gmail, Outlook, Apple Mail or Slack and paste it into the box.
              </div>

              <div className="rounded-lg bg-indigo-50/70 p-3 dark:bg-indigo-950/30">
                <span className="font-semibold text-indigo-950 dark:text-indigo-200 block mb-1">
                  2. Strict Factual Grounding
                </span>
                The engine uses strictly the text supplied:
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>If an owner, deadline, or status is absent, it says <code className="bg-white/80 px-1 py-0.5 rounded text-indigo-700 font-mono text-[11px] dark:bg-stone-800">Not specified</code>.</li>
                  <li>Proposed ideas under debate are NOT treated as confirmed decisions.</li>
                  <li>Every single action item and decision cites the supporting sentence quote from the email.</li>
                </ul>
              </div>

              <div className="rounded-lg bg-amber-50/70 p-3 dark:bg-amber-950/30">
                <span className="font-semibold text-amber-950 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Privacy & Content Safety
                </span>
                Instructions or prompt-override attempts inside pasted emails are treated solely as text to analyze, never followed. In this first version, no emails are ever sent and your personal inbox is never connected.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Got it, let's go
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
