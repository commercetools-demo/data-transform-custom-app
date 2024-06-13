import { PROCESS_TYPES } from './process';

export interface ProcessDraft {
  name: string;
  description: string;
  type: PROCESS_TYPES;
}

export interface Process {
  id: string;
  createdAt: string;
  key: string;
  value?: ProcessDraft;
}
