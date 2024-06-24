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
  json: any
): { key: string; label: string }[] => {
  let allProperties = new Set<string>();
  json.forEach((obj: any) => {
    Object.keys(obj).forEach((key) => allProperties.add(key));
  });

  return mapColumnNameToDataTableColumn(Array.from(allProperties));
};
