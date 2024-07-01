import React, { useState } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import ViewSwitcher from '@commercetools-uikit/view-switcher';
import { ImportIcon, EyeIcon, PageGearIcon } from '@commercetools-uikit/icons';
import Upload from '../../upload';
import {
  TabularMainPage,
  TabHeader,
} from '@commercetools-frontend/application-components';
import { Switch, useRouteMatch, Route, useHistory } from 'react-router-dom';
import Constraints from '@commercetools-uikit/constraints';
import Preview from '../../preview';
import Preprocess from '../../preprocess';

type Props = {
  lastProgressedTab?: string;
};

interface Tab {
  label: string;
  url: string;
  icon: React.ReactElement;
  component?: React.ReactNode;
}

const ProcessSetup = (props: Props) => {
  const match = useRouteMatch();
  const { push } = useHistory();

  const { key } = match.params as { key: string };

  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [selectedJsons, setSelectedJsons] = useState<
    { json: any; name: string; index: number }[]
  >([]);

  const processSetupTabs: Tab[] = [
    {
      label: `Upload ${tempFiles.length > 0 ? `(${tempFiles.length})` : ''}`,
      url: 'upload',
      icon: <ImportIcon />,
      component: (
        <Upload
          onFilesChange={setTempFiles}
          onNextStep={() => push(`${match.url}/preview`)}
          initialFiles={tempFiles}
        />
      ),
    },
    {
      label: 'Preview',
      url: 'preview',
      icon: <EyeIcon />,
      component: (
        <Preview
          files={tempFiles}
          onNextStep={() => push(`${match.url}/preprocess`)}
          onSelectFiles={setSelectedJsons}
        />
      ),
    },
    {
      label: 'Pre Process',
      url: 'preprocess',
      icon: <PageGearIcon />,
      component: <Preprocess files={selectedJsons} processKey={key} />,
    },
  ];

  return (
    <Constraints.Horizontal max={'scale'}>
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

export default ProcessSetup;
