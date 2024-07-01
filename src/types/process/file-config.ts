import { Options } from 'csv-parse/.';

export interface FileConfig {
  file: File;
  index: number;
  options: Options;
}
