import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import { BrainIcon } from '@commercetools-uikit/icons';
import { TabHeader } from '@commercetools-frontend/application-components';
import { Switch, useRouteMatch, Route, useHistory } from 'react-router-dom';
import Constraints from '@commercetools-uikit/constraints';
import Transform from '../transfrom';
import WorkspaceOptionsView, {
  WorkspaceOptions,
} from './workspace-preview-options';
import { ProcessRawFile } from '../../../types/process/process-raw-file';
import { ProcessTransformFileObject } from '../../../types/process/process-transform-file';
import Merge from '../merge';

type Props = {
  linkToWelcome?: string;
  options: WorkspaceOptions;
  onOptionsChange: (options: WorkspaceOptions) => void;
  sampleData?: ProcessTransformFileObject[];
};

interface Tab {
  label: string;
  url: string;
  icon: React.ReactElement;
  component?: React.ReactNode;
}

const WorkspaceTabularView = ({
  linkToWelcome,
  options,
  onOptionsChange,
  sampleData,
}: Props) => {
  const match = useRouteMatch();
  const { push } = useHistory();

  const { key } = match.params as { key: string };

  const processSetupTabs: Tab[] = [
    {
      label: `Transform data bits`,
      url: 'transform',
      icon: <BrainIcon />,
      component: (
        <Transform
          sampleData={sampleData}
          onNextStep={() => push(`${linkToWelcome}/${key}/workspace/next`)}
        />
      ),
    },
    {
      label: `Merge data rows`,
      url: 'merge',
      icon: <BrainIcon />,
      component: (
        <Merge
          sampleData={sampleData}
          onNextStep={() => push(`${linkToWelcome}/${key}/workspace/next`)}
        />
      ),
    },
  ];

  return (
    <Constraints.Horizontal max={'scale'}>
      <WorkspaceOptionsView
        options={options}
        onOptionsChange={onOptionsChange}
      />
      <Spacings.Inline>
        {processSetupTabs.map((tab) => (
          <TabHeader
            key={tab.url}
            to={`${match.url}/${tab.url}`}
            label={tab.label}
          />
        ))}
      </Spacings.Inline>
      {processSetupTabs.map((tab) => (
        <Switch key={tab.url}>
          <Route path={`${match.url}/${tab.url}`}>{tab.component}</Route>
        </Switch>
      ))}
    </Constraints.Horizontal>
  );
};

export default WorkspaceTabularView;
