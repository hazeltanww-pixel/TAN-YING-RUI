import React, { useState } from 'react';
import { Mail, Copy, Check, RotateCcw, Sparkles, Send, Edit3 } from 'lucide-react';
import { ReplyDraft } from '../types';
import { copyToClipboard } from '../utils/formatters';

interface ReplyDraftSectionProps {
  initialDraft: ReplyDraft;
  onRedraftTone?: (tone: string) => Promise<void>;
  isRedrafting?: boolean;
}

export const ReplyDraftSection: React.FC<ReplyDraftSectionProps> = ({
  initialDraft,
  onRedraftTone,
  isRedrafting = false,
}) => {
  const [subject, setSubject] = useState(initialDraft.subject);
  const [body, setBody] = useState(initialDraft.body);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Sync if initialDraft updates from re-draft or new analysis
  React.useEffect(() => {
    setSubject(initialDraft.subject);
    setBody(initialDraft.body);
  }, [initialDraft]);

  const handleCopy = async () => {
    const fullEmail = `Subject: ${subject}\n\n${body}`;
    const ok = await copyToClipboard(fullEmail);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setSubject(initialDraft.subject);
    setBody(initialDraft.body);
  };

  const hasChanges = subject !== initialDraft.subject || body !== initialDraft.body;
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              5. Editable Professional Reply Draft
            </h2>
          </div>
          <span className="rounded-full bg-violet-100/70 px-2 py-0.5 text-xs font-semibold text-violet-800 dark:bg-violet-950/80 dark:text-violet-300">
            Ready to edit & copy
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              title="Reset to original generated draft"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-violet-500 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Reply Draft</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tone Quick-Reroll Chips */}
      {onRedraftTone && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-stone-100 pb-3 dark:border-stone-800/60">
          <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            Switch tone:
          </span>
          {[
            { label: 'Concise & Direct', tone: 'Very concise, bulleted, action-focused' },
            { label: 'Executive Brief', tone: 'Executive summary style, high-level next steps' },
            { label: 'Warm & Friendly', tone: 'Collaborative, appreciative, encouraging' },
            { label: 'Follow-up on Missing Info', tone: 'Polite inquiry focusing on unblocking missing items' },
          ].map((preset) => (
            <button
              key={preset.label}
              disabled={isRedrafting}
              onClick={() => onRedraftTone(preset.tone)}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50 transition-colors dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-violet-950/60 dark:hover:text-violet-300"
            >
              {isRedrafting ? 'Re-drafting...' : preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Reply Composer Form */}
      <div className="mt-3.5 space-y-3">
        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2 text-xs font-medium text-stone-900 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100"
          />
        </div>

        {/* Body Textarea */}
        <div className="relative">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center justify-between">
            <span>Email Body (Editable)</span>
            <span className="text-[11px] text-stone-400 font-normal">
              {wordCount} words
            </span>
          </label>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3.5 font-sans text-xs leading-relaxed text-stone-900 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100"
            placeholder="Type or tweak your reply here..."
          />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
        <span className="flex items-center gap-1">
          <Edit3 className="h-3 w-3" />
          You can tweak the text directly before copying into your email client.
        </span>
        <span>No emails are sent by this app.</span>
      </div>
    </section>
  );
};
