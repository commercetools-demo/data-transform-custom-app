import FlatButton from '@commercetools-uikit/flat-button';
import Icon from '@commercetools-uikit/icon-button';
import { BackIcon, BinLinearIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useHistory, useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useProcess } from '../../../hooks/use-process';
import { useAppStateContext } from '../../../providers/process';
import ProcessWorkspace from '../process-workspace';
import { useConfirmationDialog } from '../../../hooks/use-confirmation-dialog';

type Props = {
  linkToWelcome: string;
};

const ProcessDetails = (props: Props) => {
  const { params }: { params: { key: string } } = useRouteMatch();
  const { push } = useHistory();
  const { deleteProcess } = useProcess();
  const { refreshData } = useAppStateContext();

  const hanldeDeleteProcess = async (key: string) => {
    await deleteProcess(key);
    refreshData?.();
    push(props.linkToWelcome);
  };

  const { handleDelete, ConfirmationModals } = useConfirmationDialog({
    deleteAction: (key: string) => hanldeDeleteProcess(key),
  });
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
              onClick={() => handleDelete(params.key)}
            />
          </Spacings.Inline>
          <ProcessWorkspace />
        </Spacings.Stack>
      </Spacings.Stack>
      <ConfirmationModals
        deleteButtonLabel="Delete"
        deleteMessage="Are you sure you want to delete this process"
      />
    </>
  );
};

export default ProcessDetails;
