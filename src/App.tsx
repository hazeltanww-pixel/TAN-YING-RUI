/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ThreadInput } from './components/ThreadInput';
import { SummarySection } from './components/SummarySection';
import { DecisionsSection } from './components/DecisionsSection';
import { ActionTableSection } from './components/ActionTableSection';
import { QuestionsMissingSection } from './components/QuestionsMissingSection';
import { ReplyDraftSection } from './components/ReplyDraftSection';
import { FullExportBar } from './components/FullExportBar';
import { AnalysisData } from './types';
import { AlertCircle, Sparkles, CheckCircle2, ArrowDown, RefreshCw } from 'lucide-react';

export default function App() {
  const [emailText, setEmailText] = useState('');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedrafting, setIsRedrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStepMessage, setActiveStepMessage] = useState('Extracting information...');

  const handleAnalyze = async (replyTone: string, customInstruction: string) => {
    setIsLoading(true);
    setError(null);
    setActiveStepMessage('Reading email thread and participants...');

    // Progress step timers to inform user
    const stepTimer1 = setTimeout(() => {
      setActiveStepMessage('Extracting verified decisions and supporting quotes...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setActiveStepMessage('Compiling action matrix (owners, deadlines, status)...');
    }, 2500);

    const stepTimer3 = setTimeout(() => {
      setActiveStepMessage('Formulating professional reply draft...');
    }, 4000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailThread: emailText,
          replyTone,
          customInstructions: customInstruction,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze email thread.');
      }

      setAnalysisData(json.data);

      // Smooth scroll to results after completion
      setTimeout(() => {
        const resultsEl = document.getElementById('analysis-results-container');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setEmailText('');
    setAnalysisData(null);
    setError(null);
  };

  const handleRedraftTone = async (newTone: string) => {
    if (!analysisData) return;
    setIsRedrafting(true);

    try {
      const response = await fetch('/api/redraft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: analysisData.summary,
          actionItems: analysisData.actionItems,
          openQuestions: analysisData.openQuestions,
          tone: newTone,
          originalThread: emailText,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setAnalysisData({
          ...analysisData,
          replyDraft: {
            subject: json.data.subject || analysisData.replyDraft.subject,
            body: json.data.body || analysisData.replyDraft.body,
          },
        });
      }
    } catch (err) {
      console.error('Redraft error:', err);
    } finally {
      setIsRedrafting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 font-sans text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100 transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Intro Hero / Instructions banner for beginners */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-6 text-white shadow-md">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-xs px-3 py-1 text-xs font-medium text-indigo-100 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>AI-Powered Executive Extraction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Turn Messy Email Chains into Actionable Clarity
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Paste an email thread below to extract a concise summary, verified decisions, a full task table with owners and deadlines, unresolved questions, and a ready-to-send reply draft. Every item links to its original supporting sentence quote.
            </p>
          </div>
        </div>

        {/* Input Form Section */}
        <ThreadInput
          emailText={emailText}
          setEmailText={setEmailText}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onClear={handleClear}
        />

        {/* Loading Spinner & Progress Steps */}
        {isLoading && (
          <div className="rounded-2xl border border-indigo-200 bg-white p-8 shadow-sm text-center space-y-4 dark:border-indigo-900/50 dark:bg-stone-900 animate-in fade-in duration-200">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Analysing Email Thread
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                {activeStepMessage}
              </p>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-2">
                Checking facts strictly against the text &bull; Missing values marked "Not specified"
              </p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Analysis Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysisData && !isLoading && (
          <div id="analysis-results-container" className="space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Top Bar with Section Jump & Full Export */}
            <FullExportBar data={analysisData} />

            {/* 1. Concise Summary */}
            <SummarySection
              summary={analysisData.summary}
              metadata={analysisData.threadMetadata}
            />

            {/* 2. Confirmed Decisions */}
            <DecisionsSection
              decisions={analysisData.confirmedDecisions}
              proposedItems={analysisData.proposedOrPendingItems}
            />

            {/* 3. Action Table */}
            <ActionTableSection actionItems={analysisData.actionItems} />

            {/* 4. Open Questions & Missing Info */}
            <QuestionsMissingSection
              openQuestions={analysisData.openQuestions}
              missingInformation={analysisData.missingInformation}
            />

            {/* 5. Editable Professional Reply Draft */}
            <ReplyDraftSection
              initialDraft={analysisData.replyDraft}
              onRedraftTone={handleRedraftTone}
              isRedrafting={isRedrafting}
            />

            {/* Bottom Export Bar */}
            <FullExportBar data={analysisData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong className="font-semibold text-stone-700 dark:text-stone-300">Email-to-Action</strong> &mdash; Factual email analysis powered by Gemini
          </p>
          <p className="text-[11px]">
            Strict Grounding Policy: Uses only information in the supplied text. Missing fields displayed as "Not specified".
          </p>
        </div>
      </footer>
    </div>
  );
}
