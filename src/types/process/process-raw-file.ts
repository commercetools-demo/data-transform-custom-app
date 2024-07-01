import { VALUE_TYPES } from './types';

export interface ProcessRawFileDraft {
  name: string;
  valueType: VALUE_TYPES.RAW_JSON;
  json: any;
  index: number;
  process: string;
}

export interface ProcessRawFile {
  id: string;
  createdAt: string;
  key: string;
  value?: ProcessRawFileDraft;
}
