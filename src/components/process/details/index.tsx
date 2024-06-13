import React from 'react';
import { BackIcon, BinLinearIcon } from '@commercetools-uikit/icons';
import Icon from '@commercetools-uikit/icon-button';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useRouteMatch } from 'react-router';
import { useProcess } from '../../../hooks/use-process';
import { useAppStateContext } from '../../../providers/process';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  linkToWelcome: string;
};

const ProcessDetails = (props: Props) => {
  const match = useRouteMatch();
  console.log(match);
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
        <Text.Headline as="h2">Back</Text.Headline>
      </Spacings.Stack>
      <Text.Headline as="h1">Title: </Text.Headline>

      <Spacings.Stack scale="l">
        <Spacings.Inline justifyContent="space-between">
          <Text.Subheadline as="h4">DE</Text.Subheadline>
          <Icon
            icon={<BinLinearIcon />}
            label="Delete"
            onClick={hanldeDeleteProcess}
          />
        </Spacings.Inline>
        DETAILS
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

export default ProcessDetails;
