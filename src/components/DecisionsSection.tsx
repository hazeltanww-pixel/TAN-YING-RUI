import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, User, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfirmedDecision, ProposedItem } from '../types';
import { CitationQuote } from './CitationQuote';
import { copyToClipboard } from '../utils/formatters';

interface DecisionsSectionProps {
  decisions: ConfirmedDecision[];
  proposedItems?: ProposedItem[];
}

export const DecisionsSection: React.FC<DecisionsSectionProps> = ({
  decisions,
  proposedItems = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [showProposals, setShowProposals] = useState(true);

  const handleCopyDecisions = async () => {
    let text = `CONFIRMED DECISIONS:\n`;
    if (decisions.length === 0) {
      text += `No confirmed decisions found.\n`;
    } else {
      decisions.forEach((d, idx) => {
        text += `${idx + 1}. ${d.decision} (Decided by: ${d.decidedBy})\n   Quote: "${d.supportingSentence}"\n\n`;
      });
    }

    if (proposedItems.length > 0) {
      text += `PROPOSED / NOT YET CONFIRMED:\n`;
      proposedItems.forEach((p, idx) => {
        text += `- ${p.proposal} (Proposed by: ${p.proposedBy})\n  Quote: "${p.supportingSentence}"\n`;
      });
    }

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              2. Confirmed Decisions
            </h2>
          </div>
          <span className="rounded-full bg-emerald-100/70 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            {decisions.length}
          </span>
        </div>

        <button
          onClick={handleCopyDecisions}
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
              <span>Copy decisions</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-2 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span>Only explicitly finalized or approved decisions are included.</span>
      </div>

      {/* Confirmed Decisions List */}
      <div className="mt-4 space-y-3.5">
        {decisions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-6 text-center text-xs text-stone-500 dark:border-stone-800 dark:bg-stone-800/30 dark:text-stone-400">
            No confirmed decisions were explicitly finalized in this thread.
          </div>
        ) : (
          decisions.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-stone-200/80 bg-stone-50/40 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/20 dark:border-stone-800 dark:bg-stone-800/30 dark:hover:border-emerald-800/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {item.decision}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                      <User className="h-3.5 w-3.5 text-stone-400" />
                      <span className="font-medium">Decided by:</span>
                      <span
                        className={
                          item.decidedBy === 'Not specified'
                            ? 'italic text-stone-400 dark:text-stone-500'
                            : 'font-medium text-stone-800 dark:text-stone-200'
                        }
                      >
                        {item.decidedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supporting sentence from the email thread */}
              <CitationQuote sentence={item.supportingSentence} label="Decision confirmation quote" />
            </div>
          ))
        )}
      </div>

      {/* Proposed / Under-Discussion Section (Explicitly separated to prevent mistaking proposals as decisions) */}
      {proposedItems && proposedItems.length > 0 && (
        <div className="mt-5 rounded-xl border border-amber-200/70 bg-amber-50/30 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
          <button
            onClick={() => setShowProposals(!showProposals)}
            className="flex w-full items-center justify-between text-left text-xs font-semibold text-amber-900 dark:text-amber-200"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>
                Items Under Discussion ({proposedItems.length}) &mdash; Not Yet Confirmed
              </span>
            </div>
            {showProposals ? (
              <ChevronUp className="h-4 w-4 text-amber-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-amber-600" />
            )}
          </button>

          {showProposals && (
            <div className="mt-3 space-y-2.5 pt-2 border-t border-amber-200/50 dark:border-amber-900/40 text-xs">
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                These were suggested or proposed in the email, but participants have not yet approved or finalized them.
              </p>
              {proposedItems.map((p, pIdx) => (
                <div
                  key={pIdx}
                  className="rounded-lg bg-white/70 p-2.5 border border-amber-100 dark:bg-stone-900/60 dark:border-amber-900/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {p.proposal}
                    </span>
                    <span className="shrink-0 text-[11px] text-stone-500">
                      Proposed by: {p.proposedBy}
                    </span>
                  </div>
                  <CitationQuote sentence={p.supportingSentence} compact={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
