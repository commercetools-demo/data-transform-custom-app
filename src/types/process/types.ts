import { PROCESS_STATUSES, PROCESS_TYPES } from './process';

export enum VALUE_TYPES {
  PROCESS = 'process',
  RAW_JSON = 'raw_json',
}

export interface ProcessDraft {
  name: string;
  description: string;
  processType: PROCESS_TYPES;
  processStatus?: PROCESS_STATUSES;
  valueType: VALUE_TYPES;
}

export interface Process {
  id: string;
  createdAt: string;
  key: string;
  value?: ProcessDraft;
}
