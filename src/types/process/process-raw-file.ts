import { VALUE_TYPES } from './types';

export interface ProcessRawFileDraft {
  name: string;
  valueType: VALUE_TYPES.RAW_JSON;
  json: any;
  index: number;
  process: string;
}
