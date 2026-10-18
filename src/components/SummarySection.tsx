import React, { useState } from 'react';
import { FileText, Copy, Check, Users, Tag } from 'lucide-react';
import { ThreadMetadata } from '../types';
import { copyToClipboard } from '../utils/formatters';

interface SummarySectionProps {
  summary: string;
  metadata: ThreadMetadata;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ summary, metadata }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `Topic: ${metadata.primaryTopic}\nParticipants: ${metadata.estimatedParticipants.join(', ')}\n\nSummary:\n${summary}`;
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <FileText className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            1. Concise Summary
          </h2>
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
              <span>Copy summary</span>
            </>
          )}
        </button>
      </div>

      {/* Metadata Badges */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300">
          <Tag className="h-3.5 w-3.5 text-stone-500" />
          <span className="font-medium">Topic:</span>
          <span>{metadata.primaryTopic || 'General discussion'}</span>
        </div>

        {metadata.estimatedParticipants && metadata.estimatedParticipants.length > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <Users className="h-3.5 w-3.5 text-stone-500" />
            <span className="font-medium">Participants:</span>
            <span>{metadata.estimatedParticipants.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Summary Narrative */}
      <div className="mt-3.5 text-sm leading-relaxed text-stone-700 dark:text-stone-300 font-sans whitespace-pre-line">
        {summary}
      </div>
    </section>
  );
};
