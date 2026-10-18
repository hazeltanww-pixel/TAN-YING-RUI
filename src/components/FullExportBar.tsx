import React, { useState } from 'react';
import { Copy, Check, Download, Printer, Share2 } from 'lucide-react';
import { AnalysisData } from '../types';
import { copyToClipboard, generateMarkdownExport } from '../utils/formatters';

interface FullExportBarProps {
  data: AnalysisData;
}

export const FullExportBar: React.FC<FullExportBarProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    const md = generateMarkdownExport(data);
    const ok = await copyToClipboard(md);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const md = generateMarkdownExport(data);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-to-action-${data.threadMetadata.primaryTopic.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'brief'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-r from-stone-50 via-indigo-50/20 to-stone-50 p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
        <Share2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>Export Complete Briefing (All 5 Sections)</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopyAll}
          className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>Copied All Sections</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Full Briefing (Markdown)</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-750 transition-colors"
          title="Download .md file for Slack, Notion, or Docs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download .md</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-750 transition-colors"
          title="Print or save as PDF"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / PDF</span>
        </button>
      </div>
    </div>
  );
};
