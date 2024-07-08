import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { useProcess } from '../../hooks/use-process';
import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import { BackIcon, BinLinearIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import { Link as RouterLink } from 'react-router-dom';
import { ProcessRawFile } from '../../types/process/process-raw-file';
import Icon from '@commercetools-uikit/icon-button';
import { useConfirmationDialog } from '../../hooks/use-confirmation-dialog';
import { useAppStateContext } from '../../providers/process';
import WorkspaceTabularView from './workspace-tabular-view';
import { WorkspaceOptions } from './workspace-tabular-view/workspace-preview-options';
import { ProcessTransformFileObject } from '../../types/process/process-transform-file';

type Props = {
  linkToWelcome: string;
};

const ProcessWorkspace = ({ linkToWelcome }: Props) => {
  const match = useRouteMatch();
  const { push } = useHistory();
  const { refreshData } = useAppStateContext();
  const { key } = match.params as { key: string };

  const [files, setFiles] = useState<ProcessRawFile[]>([]);
  const [sampleData, setSampleData] = useState<ProcessTransformFileObject[]>();
  const [options, setOptions] = useState<WorkspaceOptions>({
    from: 0,
    to: 10,
  });

  const { getProcessRawFiles, deleteProcess } = useProcess();

  const hanldeDeleteProcess = async (key: string) => {
    await deleteProcess(key);
    refreshData?.();
    push(linkToWelcome);
  };

  const { handleDelete, ConfirmationModals } = useConfirmationDialog({
    deleteAction: (key: string) => hanldeDeleteProcess(key),
  });

  useEffect(() => {
    getProcessRawFiles(key).then((res) => setFiles(res.results));
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      const sampleDataFromRawFiles: ProcessTransformFileObject[] = files.map(
        (file) => {
          if (file.value) {
            return {
              ...file,
              value: {
                ...file.value,
                json: file.value.json.slice(options.from, options.to),
              },
            };
          }
          return file;
        }
      );
      setSampleData(sampleDataFromRawFiles);
    }
  }, [files, options]);

  return (
    <>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="xs">
          <FlatButton
            as={RouterLink}
            to={linkToWelcome}
            label={'Back'}
            icon={<BackIcon />}
          />
        </Spacings.Stack>
        <Text.Headline as="h1">Process: {key} </Text.Headline>
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <div></div>
            <Icon
              icon={<BinLinearIcon />}
              label="Delete"
              onClick={() => handleDelete(key)}
            />
          </Spacings.Inline>
        </Spacings.Stack>
        {!files.length && (
          <Spacings.Stack scale="l">
            <Text.Detail>This process has no files</Text.Detail>
          </Spacings.Stack>
        )}
        {!!files.length && !!sampleData && (
          <WorkspaceTabularView
            linkToWelcome={linkToWelcome}
            onOptionsChange={setOptions}
            options={options}
            sampleData={sampleData}
          />
        )}
      </Spacings.Stack>
      <ConfirmationModals
        deleteButtonLabel="Delete"
        deleteMessage={`Are you sure you want to delete this process and ${files?.length} files?`}
        deleteDetailsMessage={`Files: ${files?.map(
          (item) => item.value?.name
        )}`}
      />
    </>
  );
};

export default ProcessWorkspace;
