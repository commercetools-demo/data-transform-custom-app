import FlatButton from '@commercetools-uikit/flat-button';
import Icon from '@commercetools-uikit/icon-button';
import { BackIcon, BinLinearIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useHistory, useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useProcess } from '../../../hooks/use-process';
import { useAppStateContext } from '../../../providers/process';
import ProcessSetupTabularView from '../process-setup-tabular-view';
import { useConfirmationDialog } from '../../../hooks/use-confirmation-dialog';
import { useState } from 'react';
import { ProcessRawFile } from '../../../types/process/process-raw-file';

type Props = {
  linkToWelcome: string;
};

const ProcessSetup = (props: Props) => {
  const { params }: { params: { key: string } } = useRouteMatch();
  const { push } = useHistory();
  const { deleteProcess, fetchAllRelatedProcessEntities } = useProcess();
  const { refreshData } = useAppStateContext();
  const [relatedEntities, setRelatedEntities] = useState<{
    processFiles: ProcessRawFile[];
  }>();

  const hanldeDeleteProcess = async (key: string) => {
    await deleteProcess(key);
    refreshData?.();
    push(props.linkToWelcome);
  };

  const { handleDelete, ConfirmationModals } = useConfirmationDialog({
    deleteAction: (key: string) => hanldeDeleteProcess(key),
  });
  const onDeleteClicked = async () => {
    await fetchAllRelatedProcessEntities(params.key).then((res) =>
      setRelatedEntities(res)
    );
    handleDelete(params.key);
  };
  return (
    <>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="xs">
          <FlatButton
            as={RouterLink}
            to={props.linkToWelcome}
            label={'Back'}
            icon={<BackIcon />}
          />
        </Spacings.Stack>
        <Text.Headline as="h1">Process: {params.key} </Text.Headline>

        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <div></div>
            <Icon
              icon={<BinLinearIcon />}
              label="Delete"
              onClick={onDeleteClicked}
            />
          </Spacings.Inline>
          <ProcessSetupTabularView />
        </Spacings.Stack>
      </Spacings.Stack>
      <ConfirmationModals
        deleteButtonLabel="Delete"
        deleteMessage={`Are you sure you want to delete this process and ${relatedEntities?.processFiles?.length} files?`}
        deleteDetailsMessage={`Files: ${relatedEntities?.processFiles?.map(
          (item) => item.value?.name
        )}`}
      />
    </>
  );
};

export default ProcessSetup;
