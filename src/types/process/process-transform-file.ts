import { VALUE_TYPES } from './types';

export interface ProcessTransformFile {
  name?: string;
  valueType?: VALUE_TYPES.RAW_JSON | string;
  json?: any;
  index: number;
  process: string;
}

export interface ProcessTransformFileObject {
  id: string;
  createdAt?: string;
  key: string;
  value?: ProcessTransformFile;
}
