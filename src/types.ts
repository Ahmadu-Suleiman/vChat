export interface Party {
  tel?: string;
  mailto?: string;
  name: string;
  role: string; // Flexible role: 'mediator', 'claimant', 'doctor', 'patient', etc.
  id: string; // internal ID
  avatar?: string; // UI specific
}

export interface Dialog {
  id?: string; // Optional internal ID
  start: string; // ISO timestamp
  duration?: number;
  parties: number[]; // Indices of parties in the parties array
  mimetype: string; // 'text/plain', 'audio/mp3', etc.
  content: string; // The text or base64 audio
  encoding?: string; // 'none', 'base64'
  type: 'text' | 'audio' | 'video' | 'email' | 'sms' | 'system' | 'image' | 'file'; // Helper type
  originator?: number; // Index of the party who sent it
  metadata?: {
    sessionId?: string;
    importedFrom?: string;
    isRedacted?: boolean;
    [key: string]: any;
  };
}

export interface Attachment {
  type: string;
  body: string;
  encoding?: string;
  mimetype?: string;
}

export interface Analysis {
  type: 'baseline' | 'consistency_check' | 'summary' | 'other';
  dialog: number[]; // Indices of dialogs analyzed
  body: string | object;
  vendor: string;
  schema?: string;
  created_at: string;
  name?: string; // UI title
}

export interface Session {
  id: string;
  title: string;
  date: string;
  status: 'active' | 'closed' | 'imported';
  importSource?: string;
}

export interface VCon {
  vcon: string; // version, e.g., "0.0.1"
  uuid: string;
  created_at: string;
  updated_at?: string;
  subject?: string;
  parties: Party[];
  dialog: Dialog[];
  attachments: Attachment[];
  analysis: Analysis[];
  metadata?: {
    type?: 'Mediation' | 'Healthcare' | 'Education' | 'Legal' | 'Professional' | 'Personal';
    description?: string;
    sessions?: Session[]; // UI organization
    [key: string]: any;
  };
}
