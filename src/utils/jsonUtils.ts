import { Options } from 'csv-parse/.';
import { DEFAULT_NUMBER_OF_PREVIEW_LINES } from '../constants/parser';

const mapColumnNameToDataTableColumn = (
  columns: string[]
): { key: string; label: string }[] => {
  return columns.map((column) => {
    return {
      key: column,
      label: column,
    };
  });
};
export const getColumnsFromJson = (
  json: any,
  options: Options
): { key: string; label: string }[] => {
  let allProperties = new Set<string>();
  json.forEach((obj: any, index: number) => {
    if (index < (options.to_line ?? DEFAULT_NUMBER_OF_PREVIEW_LINES)) {
      Object.keys(obj).forEach((key) => allProperties.add(key));
    }
  });

  return mapColumnNameToDataTableColumn(Array.from(allProperties));
};
