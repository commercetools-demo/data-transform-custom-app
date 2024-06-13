import FlatButton from '@commercetools-uikit/flat-button';
import Icon from '@commercetools-uikit/icon-button';
import { BackIcon, BinLinearIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useProcess } from '../../../hooks/use-process';
import { useAppStateContext } from '../../../providers/process';
import ProcessWorkspace from '../process-workspace';

type Props = {
  linkToWelcome: string;
};

const ProcessDetails = (props: Props) => {
  const { params }: { params: { key: string } } = useRouteMatch();
  const { deleteProcess } = useProcess();
  const { refreshData } = useAppStateContext();
  const hanldeDeleteProcess = async () => {
    await deleteProcess('');
    refreshData?.();
  };
  return (
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
            onClick={hanldeDeleteProcess}
          />
        </Spacings.Inline>
        <ProcessWorkspace />
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

export default ProcessDetails;
