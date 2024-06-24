import React, { useEffect, useRef, useState } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import useCSVFileEvents from './hooks/useCSVFileEvents';
import useCSVFileHandler from './hooks/useCSVFileHandler';
import uploadImage from './static/upload.svg';
import styled from 'styled-components';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import { ActionWrapper } from '../atoms/styled/action-wrapper';

type Props = {
  initialFiles?: File[];
  onFilesChange: (files: File[]) => void;
  onNextStep: () => void;
};

const UploadWrapper = styled.div`
  display: flex;
  margin-top: 0.75rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  border-width: 1px;
  border-color: #d1d5db;
  border-style: dashed;
  width: 100%;
  cursor: pointer;
  height: 160px;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const Upload = ({ initialFiles, onFilesChange, onNextStep }: Props) => {
  const [error, setError] = useState('');
  const inputFile = useRef<HTMLInputElement>(null);

  const { files, handleFile, handleFileReader, handleRemoveClick } =
    useCSVFileHandler(initialFiles);
  const { handleChange, handleDragLeave, handleDragOver, handleDrop } =
    useCSVFileEvents(handleFile, handleFileReader);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError('');
    handleChange(e);
  };
  useEffect(() => {
    onFilesChange(files);
  }, [files]);
  return (
    <Spacings.Stack>
      <UploadWrapper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputFile?.current?.click()}
      >
        <input
          type="file"
          multiple
          accept=".csv, .json"
          onChange={handleFileChange}
          ref={inputFile}
          style={{ display: 'none' }}
        />
        <img src={uploadImage} alt="upload" />
        <div className="mt-5">
          <Text.Body>Drag and drop your files here</Text.Body>
        </div>
      </UploadWrapper>
      {files.length > 0 && (
        <div>
          {files.map((file) => (
            <div className="relative" key={file.lastModified}>
              <div className="rounded-md border">
                <FileRow>
                  <Text.Detail>{file.name}</Text.Detail>
                  <FlatButton
                    icon={<BinLinearIcon />}
                    onClick={() => handleRemoveClick(file)}
                    label="Delete"
                  />
                </FileRow>
              </div>
            </div>
          ))}
        </div>
      )}

      <ActionWrapper>
        <PrimaryButton
          tone="primary"
          isDisabled={files.length === 0}
          onClick={() => {
            if (files.length === 0) {
              setError('Please select a file');
            } else {
              onNextStep();
            }
          }}
          label="Next"
        />
      </ActionWrapper>
    </Spacings.Stack>
  );
};

export default Upload;
