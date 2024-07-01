import React, { useState } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import { ImportIcon, EyeIcon, PageGearIcon } from '@commercetools-uikit/icons';
import Upload from '../../upload';
import { TabHeader } from '@commercetools-frontend/application-components';
import { Switch, useRouteMatch, Route, useHistory } from 'react-router-dom';
import Constraints from '@commercetools-uikit/constraints';
import Preview from '../../preview';
import Preprocess from '../../preprocess';
import { FileConfig } from '../../../types/process/file-config';

type Props = {
  linkToWelcome?: string;
};

interface Tab {
  label: string;
  url: string;
  icon: React.ReactElement;
  component?: React.ReactNode;
}

const ProcessSetup = ({ linkToWelcome }: Props) => {
  const match = useRouteMatch();
  const { push } = useHistory();

  const { key } = match.params as { key: string };

  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [selectedFilesConfig, setSelectedFilesConfig] = useState<FileConfig[]>(
    []
  );

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
          selectedFilesConfig={selectedFilesConfig}
          onSelectFiles={setSelectedFilesConfig}
        />
      ),
    },
    {
      label: 'Pre Process',
      url: 'preprocess',
      icon: <PageGearIcon />,
      component: (
        <Preprocess
          files={selectedFilesConfig}
          processKey={key}
          onNextStep={() => push(`${linkToWelcome}/${key}/wprkspace`)}
        />
      ),
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
