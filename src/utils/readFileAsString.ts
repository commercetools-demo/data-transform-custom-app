/**
 * Reads a file and returns its content as a string.
 * @param file - The File object representing the file to read
 * @returns A Promise that resolves with the file content as a string
 */

export function readFileAsString(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsText(file);
  });
}
