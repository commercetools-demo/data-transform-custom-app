import { useModalState } from '@commercetools-frontend/application-components';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import DataTable from '@commercetools-uikit/data-table';
import FieldLabel from '@commercetools-uikit/field-label';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { Options } from 'csv-parse';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DEFAULT_NUMBER_OF_PREVIEW_LINES } from '../../constants/parser';
import { getColumnsFromJson } from '../../utils/jsonUtils';
import ParseOptions from './csv-parse-options';
import { useParseCSV } from './hooks/use-parse-csv';
import { useParseJSON } from './hooks/use-parse-json';

type Props = {
  file: File;
  selected?: boolean;
  handleSelect?: (json: any) => void;
};

const StyledStack = styled.div`
  overflow-x: scroll;
`;
const StyledControl = styled.div`
  display: flex;
  align-items: center;
  max-width: 120px;
  gap-x: 0.5rem;
`;

const PreviewItem = ({ file, selected, handleSelect }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<any>([]);
  const [columns, setColumns] = useState<{ key: string; label: string }[]>([]);
  const [options, setOptions] = useState<Options>({
    columns: true,
    from_line: 1,
    to_line: DEFAULT_NUMBER_OF_PREVIEW_LINES,
  });
  const { parseCSV } = useParseCSV();
  const { parseJson } = useParseJSON();

  const handleParseCSV = async () => {
    setIsLoading(true);
    const result = await parseCSV(file, options);
    setRecords(result?.parseData);
    setColumns(getColumnsFromJson(result?.parseData, options));
    setIsLoading(false);
  };

  const handleParseJson = async () => {
    const json = await parseJson(file, options);
    setColumns(getColumnsFromJson(json, options));
    setRecords(json);
  };

  useEffect(() => {
    if (file.type === 'text/csv') {
      handleParseCSV();
    } else if (file.type === 'application/json') {
      handleParseJson();
    }
  }, [file, options]);

  const { closeModal, isModalOpen, openModal } = useModalState();
  return (
    <>
      <CollapsiblePanel
        isClosed={!isModalOpen}
        onToggle={() => (isModalOpen ? closeModal() : openModal())}
        header={file.name}
        headerControls={
          <StyledControl>
            <FieldLabel htmlFor="selected" title="Save?"></FieldLabel>
            <CheckboxInput
              name="selected"
              onChange={() => handleSelect?.(records)}
              isChecked={selected}
            />
          </StyledControl>
        }
      >
        <StyledStack>
          <ParseOptions
            options={options}
            onOptionsChange={setOptions}
            type={file.type}
          />
          {isLoading && <LoadingSpinner>Loading...</LoadingSpinner>}
          {!isLoading && <DataTable columns={columns} rows={records} />}
        </StyledStack>
      </CollapsiblePanel>
    </>
  );
};

export default PreviewItem;
