import Spacings from '@commercetools-uikit/spacings';
import PreviewItem from './preview-item';
import { ActionWrapper } from '../atoms/styled/action-wrapper';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useEffect, useState } from 'react';

type Props = {
  files: File[];
  onNextStep: () => void;
  onSelectFiles: (
    fileJson: { json: any; name: string; index: number }[]
  ) => void;
};

const Preview = ({ files, onNextStep, onSelectFiles }: Props) => {
  const [selectedFilesJson, setSelectedFilesJson] = useState<
    { index: number; name: string; json: any }[]
  >([]);
  const [error, setError] = useState('');

  const handleFileSelect = (json: any, name: string, index: number) => {
    if (selectedFilesJson.some((f) => f.index === index)) {
      setSelectedFilesJson(selectedFilesJson.filter((f) => f.index !== index));
    } else {
      setSelectedFilesJson([...selectedFilesJson, { index, name, json }]);
    }
  };

  useEffect(() => {
    onSelectFiles(selectedFilesJson);
  }, [selectedFilesJson]);
  return (
    <Spacings.Stack>
      {files.map((file, index) => (
        <PreviewItem
          key={file.name}
          file={file}
          selected={selectedFilesJson.some((f) => f.index === index)}
          handleSelect={(json) => handleFileSelect(json, file.name, index)}
        />
      ))}
      <ActionWrapper>
        <PrimaryButton
          tone="primary"
          isDisabled={selectedFilesJson.length === 0}
          onClick={() => {
            if (selectedFilesJson.length === 0) {
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
