import React, { useState } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import ViewSwitcher from '@commercetools-uikit/view-switcher';
import { ImportIcon, EyeIcon, PageGearIcon } from '@commercetools-uikit/icons';
import Upload from '../../upload';
import {
  TabularMainPage,
  TabHeader,
} from '@commercetools-frontend/application-components';
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import Constraints from '@commercetools-uikit/constraints';

type Props = {
  lastProgressedTab?: string;
};

interface Tab {
  label: string;
  url: string;
  icon: React.ReactElement;
  component?: React.ReactNode;
}

export const workspaceTabs: Tab[] = [
  {
    label: 'Upload',
    url: 'upload',
    icon: <ImportIcon />,
    component: <Upload />,
  },
  {
    label: 'Preview',
    url: 'preview',
    icon: <EyeIcon />,
  },
  {
    label: 'Pre Process',
    url: 'preprocess',
    icon: <PageGearIcon />,
  },
];

const ProcessWorkspace = (props: Props) => {
  const match = useRouteMatch();

  return (
    <Constraints.Horizontal max={'scale'}>
      <Spacings.Inline>
        {workspaceTabs.map((tab) => (
          <TabHeader
            key={tab.url}
            to={`${match.url}/${tab.url}`}
            label={tab.label}
          />
        ))}
      </Spacings.Inline>
      {workspaceTabs.map((tab) => (
        <Switch key={tab.url}>
          <Route path={`${match.url}/${tab.url}`}>{tab.component}</Route>
        </Switch>
      ))}
    </Constraints.Horizontal>
  );
};

export default ProcessWorkspace;
