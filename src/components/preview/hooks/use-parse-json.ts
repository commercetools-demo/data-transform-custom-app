import { Options } from 'csv-parse/.';
import { DEFAULT_NUMBER_OF_PREVIEW_LINES } from '../../../constants/parser';
import { readFileAsString } from '../../../utils/readFileAsString';

export const useParseJSON = () => {
  const parseJson = async (file: File, options?: Options) => {
    const fileContent = await readFileAsString(file);
    const json = JSON.parse(fileContent);
    if (Array.isArray(json)) {
      return json.slice(0, options?.to_line ?? DEFAULT_NUMBER_OF_PREVIEW_LINES);
    }
    return [];
  };

  return {
    parseJson,
  };
};
