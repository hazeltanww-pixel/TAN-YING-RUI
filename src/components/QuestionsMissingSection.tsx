import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, Copy, Check, User, Clock } from 'lucide-react';
import { OpenQuestion, MissingInformation } from '../types';
import { CitationQuote } from './CitationQuote';
import { copyToClipboard } from '../utils/formatters';

interface QuestionsMissingSectionProps {
  openQuestions: OpenQuestion[];
  missingInformation: MissingInformation[];
}

export const QuestionsMissingSection: React.FC<QuestionsMissingSectionProps> = ({
  openQuestions,
  missingInformation,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let text = `OPEN QUESTIONS & MISSING INFORMATION\n\n`;

    text += `Open Questions:\n`;
    if (openQuestions.length === 0) {
      text += `None identified.\n`;
    } else {
      openQuestions.forEach((q, idx) => {
        text += `${idx + 1}. ${q.question}\n   Asked by: ${q.askedBy} | Waiting on: ${q.waitingOn}\n   Quote: "${q.supportingSentence}"\n\n`;
      });
    }

    text += `\nMissing Information & Blockers:\n`;
    if (missingInformation.length === 0) {
      text += `None identified.\n`;
    } else {
      missingInformation.forEach((m, idx) => {
        text += `${idx + 1}. ${m.item}\n   Impact: ${m.contextOrImpact}\n   Quote: "${m.supportingSentence}"\n\n`;
      });
    }

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalCount = openQuestions.length + missingInformation.length;

  return (
    <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            4. Open Questions & Missing Information
          </h2>
          <span className="rounded-full bg-amber-100/70 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            {totalCount} items
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-850 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy section</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Open Questions Column */}
        <div className="rounded-xl border border-stone-200/80 bg-stone-50/40 p-4 dark:border-stone-800 dark:bg-stone-800/30">
          <div className="flex items-center gap-2 pb-2.5 border-b border-stone-200/60 dark:border-stone-700/60">
            <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800 dark:text-stone-200">
              Unanswered Questions ({openQuestions.length})
            </h3>
          </div>

          <div className="mt-3 space-y-3">
            {openQuestions.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">
                No unresolved questions detected in this thread.
              </p>
            ) : (
              openQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-white p-3 border border-stone-200/70 shadow-2xs dark:bg-stone-900/60 dark:border-stone-800"
                >
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {idx + 1}. {q.question}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-stone-400" />
                      <span>Asked by:</span>
                      <strong className="font-medium text-stone-700 dark:text-stone-300">
                        {q.askedBy}
                      </strong>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-stone-400" />
                      <span>Waiting on:</span>
                      <strong className="font-medium text-stone-700 dark:text-stone-300">
                        {q.waitingOn}
                      </strong>
                    </span>
                  </div>

                  <CitationQuote sentence={q.supportingSentence} compact={true} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing Information Column */}
        <div className="rounded-xl border border-stone-200/80 bg-stone-50/40 p-4 dark:border-stone-800 dark:bg-stone-800/30">
          <div className="flex items-center gap-2 pb-2.5 border-b border-stone-200/60 dark:border-stone-700/60">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800 dark:text-stone-200">
              Missing Info & Blockers ({missingInformation.length})
            </h3>
          </div>

          <div className="mt-3 space-y-3">
            {missingInformation.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">
                No missing information or blocking dependencies noted.
              </p>
            ) : (
              missingInformation.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-white p-3 border border-stone-200/70 shadow-2xs dark:bg-stone-900/60 dark:border-stone-800"
                >
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {idx + 1}. {m.item}
                  </p>

                  <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      Impact / Need:
                    </span>{' '}
                    {m.contextOrImpact}
                  </p>

                  <CitationQuote sentence={m.supportingSentence} compact={true} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
