import Spacings from '@commercetools-uikit/spacings';
import PreviewItem from './preview-item';
import { ActionWrapper } from '../atoms/styled/action-wrapper';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useEffect, useState } from 'react';
import { Options } from 'csv-parse/.';
import { FileConfig } from '../../types/process/file-config';

type Props = {
  files: File[];
  selectedFilesConfig: FileConfig[];
  onNextStep: () => void;
  onSelectFiles: (fileJson: FileConfig[]) => void;
};

const Preview = ({
  files,
  selectedFilesConfig,
  onNextStep,
  onSelectFiles,
}: Props) => {
  const [error, setError] = useState('');

  const handleFileSelect = (options: Options, file: File, index: number) => {
    if (selectedFilesConfig.some((f) => f.index === index)) {
      onSelectFiles(selectedFilesConfig.filter((f) => f.index !== index));
    } else {
      onSelectFiles([...selectedFilesConfig, { index, file, options }]);
    }
  };

  useEffect(() => {
    onSelectFiles(selectedFilesConfig);
  }, [selectedFilesConfig]);
  return (
    <Spacings.Stack>
      {files.map((file, index) => (
        <PreviewItem
          key={file.name}
          file={file}
          selected={selectedFilesConfig.some((f) => f.index === index)}
          handleSelect={(options) => handleFileSelect(options, file, index)}
        />
      ))}
      <ActionWrapper>
        <PrimaryButton
          tone="primary"
          isDisabled={selectedFilesConfig.length === 0}
          onClick={() => {
            if (selectedFilesConfig.length === 0) {
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

export default Preview;
