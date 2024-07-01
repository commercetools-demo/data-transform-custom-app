import { readFileAsString } from '../../../utils/readFileAsString';
import { parseString } from '../../../utils/parseString';
import { Options } from 'csv-parse/.';
import { DEFAULT_NUMBER_OF_PREVIEW_LINES } from '../../../constants/parser';

export const useParseCSV = () => {
  const parseCSV = async (file: File, options?: Options): Promise<any> => {
    try {
      const input = await readFileAsString(file);
      const parseData = await parseString(input, {
        ...options,
        to_line: (options?.to_line ?? DEFAULT_NUMBER_OF_PREVIEW_LINES) + 1,
      });
      return {
        parseData,
      };
    } catch (error) {
      throw error;
    }
  };

  return {
    parseCSV,
  };
};
