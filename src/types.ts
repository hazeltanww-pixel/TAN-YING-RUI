export interface ConfirmedDecision {
  decision: string;
  decidedBy: string;
  supportingSentence: string;
}

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
  status: string;
  supportingSentence: string;
  completed?: boolean;
}

export interface OpenQuestion {
  question: string;
  askedBy: string;
  waitingOn: string;
  supportingSentence: string;
}

export interface MissingInformation {
  item: string;
  contextOrImpact: string;
  supportingSentence: string;
}

export interface ProposedItem {
  proposal: string;
  proposedBy: string;
  supportingSentence: string;
}

export interface ReplyDraft {
  subject: string;
  body: string;
}

export interface ThreadMetadata {
  estimatedParticipants: string[];
  primaryTopic: string;
}

export interface AnalysisData {
  summary: string;
  threadMetadata: ThreadMetadata;
  confirmedDecisions: ConfirmedDecision[];
  actionItems: ActionItem[];
  openQuestions: OpenQuestion[];
  missingInformation: MissingInformation[];
  proposedOrPendingItems: ProposedItem[];
  replyDraft: ReplyDraft;
}

export interface SampleThread {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
}
