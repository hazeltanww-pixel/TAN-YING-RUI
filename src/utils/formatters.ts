import { AnalysisData } from '../types';

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => fallbackCopyTextToClipboard(text)
    );
  } else {
    return Promise.resolve(fallbackCopyTextToClipboard(text));
  }
}

function fallbackCopyTextToClipboard(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let successful = false;
  try {
    successful = document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
  return successful;
}

export function generateMarkdownExport(data: AnalysisData): string {
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let md = `# Email-to-Action Executive Briefing\nGenerated on ${dateStr}\n\n`;

  md += `## 1. Summary\n**Topic:** ${data.threadMetadata.primaryTopic}\n`;
  if (data.threadMetadata.estimatedParticipants.length > 0) {
    md += `**Participants:** ${data.threadMetadata.estimatedParticipants.join(', ')}\n\n`;
  }
  md += `${data.summary}\n\n`;

  md += `## 2. Confirmed Decisions\n`;
  if (data.confirmedDecisions.length === 0) {
    md += `_No confirmed decisions were explicitly made in this thread._\n\n`;
  } else {
    data.confirmedDecisions.forEach((d, idx) => {
      md += `${idx + 1}. **${d.decision}**\n`;
      md += `   - **Decided by:** ${d.decidedBy}\n`;
      md += `   - **Supporting quote:** "${d.supportingSentence}"\n\n`;
    });
  }

  if (data.proposedOrPendingItems && data.proposedOrPendingItems.length > 0) {
    md += `### *Items Still Under Discussion (Not Yet Confirmed)*\n`;
    data.proposedOrPendingItems.forEach((p, idx) => {
      md += `- ${p.proposal} *(Proposed by: ${p.proposedBy})*\n`;
      md += `  Quote: "${p.supportingSentence}"\n`;
    });
    md += `\n`;
  }

  md += `## 3. Action Items\n`;
  if (data.actionItems.length === 0) {
    md += `_No specific action items found._\n\n`;
  } else {
    md += `| Task | Owner | Deadline | Status | Supporting Quote |\n`;
    md += `| --- | --- | --- | --- | --- |\n`;
    data.actionItems.forEach((a) => {
      md += `| ${a.task.replace(/\|/g, '-')} | ${a.owner} | ${a.deadline} | ${a.status} | "${a.supportingSentence.replace(/\|/g, '-')}" |\n`;
    });
    md += `\n`;
  }

  md += `## 4. Open Questions & Missing Information\n`;
  if (data.openQuestions.length === 0 && data.missingInformation.length === 0) {
    md += `_No open questions or missing information noted._\n\n`;
  } else {
    if (data.openQuestions.length > 0) {
      md += `### Open Questions\n`;
      data.openQuestions.forEach((q, idx) => {
        md += `${idx + 1}. **${q.question}**\n`;
        md += `   - Asked by: ${q.askedBy} | Waiting on: ${q.waitingOn}\n`;
        md += `   - Supporting quote: "${q.supportingSentence}"\n`;
      });
      md += `\n`;
    }

    if (data.missingInformation.length > 0) {
      md += `### Missing Information & Blockers\n`;
      data.missingInformation.forEach((m, idx) => {
        md += `${idx + 1}. **${m.item}**\n`;
        md += `   - Impact / Need: ${m.contextOrImpact}\n`;
        md += `   - Supporting quote: "${m.supportingSentence}"\n`;
      });
      md += `\n`;
    }
  }

  md += `## 5. Professional Reply Draft\n`;
  md += `**Subject:** ${data.replyDraft.subject}\n\n`;
  md += `${data.replyDraft.body}\n`;

  return md;
}

export function generateActionItemsCSV(actions: AnalysisData['actionItems']): string {
  const headers = ['Task', 'Owner', 'Deadline', 'Status', 'Supporting Sentence'];
  const rows = actions.map((a) => [
    `"${a.task.replace(/"/g, '""')}"`,
    `"${a.owner.replace(/"/g, '""')}"`,
    `"${a.deadline.replace(/"/g, '""')}"`,
    `"${a.status.replace(/"/g, '""')}"`,
    `"${a.supportingSentence.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
