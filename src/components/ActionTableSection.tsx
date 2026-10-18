import React, { useState } from 'react';
import { CheckSquare, Copy, Check, Search, Download, User, Calendar, AlertCircle } from 'lucide-react';
import { ActionItem } from '../types';
import { CitationQuote } from './CitationQuote';
import { copyToClipboard, generateActionItemsCSV } from '../utils/formatters';

interface ActionTableSectionProps {
  actionItems: ActionItem[];
  onToggleComplete?: (index: number) => void;
}

export const ActionTableSection: React.FC<ActionTableSectionProps> = ({
  actionItems: initialItems,
}) => {
  const [items, setItems] = useState<ActionItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  // Sync state if props change
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const toggleTask = (index: number) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, completed: !item.completed } : item))
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deadline.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'SPECIFIED') return matchesSearch && item.status !== 'Not specified';
    if (statusFilter === 'UNSPECIFIED') return matchesSearch && item.status === 'Not specified';
    if (statusFilter === 'COMPLETED') return matchesSearch && item.completed;
    return matchesSearch;
  });

  const handleCopyMarkdown = async () => {
    let md = `| Task | Owner | Deadline | Status | Supporting Quote |\n`;
    md += `| --- | --- | --- | --- | --- |\n`;
    items.forEach((a) => {
      md += `| ${a.task.replace(/\|/g, '-')} | ${a.owner} | ${a.deadline} | ${a.status} | "${a.supportingSentence.replace(/\|/g, '-')}" |\n`;
    });

    const ok = await copyToClipboard(md);
    if (ok) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  const handleCopyCsv = async () => {
    const csv = generateActionItemsCSV(items);
    const ok = await copyToClipboard(csv);
    if (ok) {
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    }
  };

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <CheckSquare className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            3. Action Table
          </h2>
          <span className="rounded-full bg-indigo-100/70 px-2 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
            {items.length} tasks
          </span>
          {completedCount > 0 && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ({completedCount} completed)
            </span>
          )}
        </div>

        {/* Copy Table Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-850 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            title="Copy as Markdown table"
          >
            {copiedMd ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied MD</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy as Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-850 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            title="Copy as CSV format"
          >
            {copiedCsv ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied CSV</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Copy CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter tasks, owners, or deadlines..."
            className="w-full rounded-lg border border-stone-200 bg-stone-50/50 pl-8 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-700 focus:border-indigo-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          >
            <option value="ALL">All Tasks</option>
            <option value="SPECIFIED">Status Specified</option>
            <option value="UNSPECIFIED">Status Not Specified</option>
            <option value="COMPLETED">Checked Off</option>
          </select>
        </div>
      </div>

      {/* The Action Table */}
      <div className="mt-3.5 overflow-x-auto rounded-xl border border-stone-200/90 dark:border-stone-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/90 font-semibold text-stone-700 dark:border-stone-800 dark:bg-stone-800/80 dark:text-stone-300">
              <th className="py-2.5 px-3 w-10 text-center">Done</th>
              <th className="py-2.5 px-3 min-w-[200px]">Task</th>
              <th className="py-2.5 px-3 min-w-[130px]">Owner</th>
              <th className="py-2.5 px-3 min-w-[130px]">Deadline</th>
              <th className="py-2.5 px-3 min-w-[110px]">Status</th>
              <th className="py-2.5 px-3 min-w-[240px]">Supporting Sentence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-sans">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-500 dark:text-stone-400">
                  {items.length === 0
                    ? 'No action items identified in this thread.'
                    : 'No tasks match the active filter.'}
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const originalIndex = items.indexOf(item);
                const isOwnerUnspecified = item.owner === 'Not specified';
                const isDeadlineUnspecified = item.deadline === 'Not specified';
                const isStatusUnspecified = item.status === 'Not specified';

                return (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40 ${
                      item.completed ? 'bg-stone-50/60 opacity-60 dark:bg-stone-900/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center align-top">
                      <input
                        type="checkbox"
                        checked={!!item.completed}
                        onChange={() => toggleTask(originalIndex)}
                        className="h-4 w-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer dark:border-stone-700"
                        title="Mark task done locally"
                      />
                    </td>

                    {/* Task */}
                    <td className="py-3 px-3 align-top font-medium text-stone-900 dark:text-stone-100">
                      <div className={item.completed ? 'line-through text-stone-400' : ''}>
                        {item.task}
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-3 align-top">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                        <span
                          className={
                            isOwnerUnspecified
                              ? 'italic text-stone-400 dark:text-stone-500 font-serif'
                              : 'font-medium text-stone-800 dark:text-stone-200'
                          }
                        >
                          {item.owner}
                        </span>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="py-3 px-3 align-top">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                        <span
                          className={
                            isDeadlineUnspecified
                              ? 'italic text-stone-400 dark:text-stone-500 font-serif'
                              : 'font-medium text-stone-800 dark:text-stone-200'
                          }
                        >
                          {item.deadline}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 align-top">
                      {isStatusUnspecified ? (
                        <span className="italic text-stone-400 dark:text-stone-500 font-serif">
                          Not specified
                        </span>
                      ) : (
                        <span className="inline-block rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700 border border-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300">
                          {item.status}
                        </span>
                      )}
                    </td>

                    {/* Supporting Sentence */}
                    <td className="py-3 px-3 align-top">
                      <CitationQuote
                        sentence={item.supportingSentence}
                        compact={true}
                        label="Action sentence"
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-[11px] text-stone-400 dark:text-stone-500 flex items-center justify-between">
        <span>* Checkboxes allow you to mark off tasks as you review.</span>
        <span>Missing values strictly displayed as "Not specified".</span>
      </div>
    </section>
  );
};
