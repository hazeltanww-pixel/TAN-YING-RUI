import React, { useState } from 'react';
import { Quote, Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/formatters';

interface CitationQuoteProps {
  sentence: string;
  label?: string;
  compact?: boolean;
}

export const CitationQuote: React.FC<CitationQuoteProps> = ({
  sentence,
  label = 'Supporting sentence from email',
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!sentence || sentence === 'Not specified') {
    return null;
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(sentence);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (compact) {
    return (
      <div className="group relative mt-1.5 flex items-start gap-1.5 rounded-md bg-amber-50/80 px-2 py-1 text-xs text-amber-900 border border-amber-200/60 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-200">
        <Quote className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <span className="italic leading-snug line-clamp-2">“{sentence}”</span>
        <button
          onClick={handleCopy}
          title="Copy supporting quote"
          className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-amber-950 dark:hover:text-amber-100"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2.5 rounded-lg border border-amber-200/80 bg-gradient-to-r from-amber-50/90 to-orange-50/50 p-2.5 text-xs text-amber-950 dark:border-amber-900/50 dark:from-amber-950/40 dark:to-stone-900/60 dark:text-amber-200">
      <div className="flex items-center justify-between pb-1 text-[11px] font-semibold tracking-wide uppercase text-amber-700 dark:text-amber-400">
        <span className="flex items-center gap-1">
          <Quote className="h-3 w-3" />
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-normal text-amber-800 hover:bg-amber-200/50 dark:text-amber-300 dark:hover:bg-amber-900/50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Copied quote</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy quote</span>
            </>
          )}
        </button>
      </div>
      <p className="italic font-serif leading-relaxed text-stone-800 dark:text-stone-200 pl-1">
        “{sentence}”
      </p>
    </div>
  );
};
