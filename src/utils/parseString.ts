import { Options, parse } from 'csv-parse/browser/esm/sync';

export async function parseString(file: string, options?: Options) {
  const records = parse(file, options);
  return records;
}
