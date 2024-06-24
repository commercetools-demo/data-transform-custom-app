import React, { useEffect, useState } from 'react';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import { useModalState } from '@commercetools-frontend/application-components';
import { useParseCSV } from './hooks/use-parse-csv';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { Options } from 'csv-parse';
import CSVParseOptions from './csv-parse-options';
import DataTable from '@commercetools-uikit/data-table';
import { getColumnsFromJson } from '../../utils/jsonUtils';
import { readFileAsString } from '../../utils/readFileAsString';
import styled from 'styled-components';

type Props = {
  file: File;
};

const StyledStack = styled.div`
  overflow-x: scroll;
`;

const PreviewItem = ({ file }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<any>([]);
  const [columns, setColumns] = useState<{ key: string; label: string }[]>([]);
  const [options, setOptions] = useState<Options>({
    columns: true,
  });
  const { parseCSV } = useParseCSV();

  const handleParseCSV = async () => {
    setIsLoading(true);
    const result = await parseCSV(file, options);
    setRecords(result?.parseData);
    setColumns(getColumnsFromJson(result?.parseData));
    setIsLoading(false);
  };

  const handleParseJson = async () => {
    const fileContent = await readFileAsString(file);
    const json = JSON.parse(fileContent);
    setColumns(getColumnsFromJson(json));
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
      >
        <StyledStack>
          {file.type === 'text/csv' && (
            <CSVParseOptions options={options} onOptionsChange={setOptions} />
          )}
          {isLoading && <LoadingSpinner>Loading...</LoadingSpinner>}
          {!isLoading && <DataTable columns={columns} rows={records} />}
        </StyledStack>
      </CollapsiblePanel>
    </>
  );
};

export default PreviewItem;
