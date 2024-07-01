import React, { useState } from 'react';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import styled from 'styled-components';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useProcess } from '../../hooks/use-process';
type Props = {
  files: { json: any; name: string; index: number }[];
  workspace: string;
};

const StyledDiv = styled.div`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Preprocess = ({ files, workspace }: Props) => {
  const { uploadfileToProcess } = useProcess();
  const [loading, setLoading] = useState(false);

  const handleStoreFiles = async () => {
    setLoading(true);
    for (const file of files) {
      await uploadfileToProcess({
        name: file.name,
        json: file.json,
        process: workspace,
        index: file.index,
      });
    }
    setLoading(false);
  };

  return (
    <StyledDiv>
      <Text.Body>
        {`Total of ${files.length} file(s) will be stored in your workspace.`}
      </Text.Body>
      <PrimaryButton
        label="Continue?"
        iconLeft={loading ? <LoadingSpinner /> : <div />}
        onClick={handleStoreFiles}
      />
    </StyledDiv>
  );
};

export default Preprocess;
