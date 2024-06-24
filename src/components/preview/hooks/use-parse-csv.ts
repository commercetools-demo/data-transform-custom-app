import { readFileAsString } from '../../../utils/readFileAsString';
import { parseString } from '../../../utils/parseString';
import { Options } from 'csv-parse/.';

export const useParseCSV = () => {
  const parseCSV = async (file: File, options?: Options): Promise<any> => {
    try {
      const input = await readFileAsString(file);
      const parseData = await parseString(input, options);
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
