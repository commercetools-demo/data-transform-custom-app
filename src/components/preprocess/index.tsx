import React, { useState } from 'react';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import styled from 'styled-components';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useProcess } from '../../hooks/use-process';
import { FileConfig } from '../../types/process/file-config';
type Props = {
  files: FileConfig[];
  processKey: string;
  onNextStep: () => void;
};

const StyledDiv = styled.div`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Preprocess = ({ files, processKey, onNextStep }: Props) => {
  const { uploadFilesToProcess } = useProcess();
  const [loading, setLoading] = useState(false);

  const handleStoreFiles = async () => {
    setLoading(true);

    await uploadFilesToProcess(processKey, files);

    setLoading(false);
    onNextStep();
  };

  return (
    <StyledDiv>
      <Text.Body>
        {`Total of ${files.length} file(s) will be stored in your workspace.`}
      </Text.Body>
      <PrimaryButton
        label="Continue?"
        isDisabled={loading || files.length === 0}
        iconLeft={loading ? <LoadingSpinner /> : <div />}
        onClick={handleStoreFiles}
      />
    </StyledDiv>
  );
};

export default Preprocess;
