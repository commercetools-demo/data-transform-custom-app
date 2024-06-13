import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useProcess } from '../../hooks/use-process';
import { useAppStateContext } from '../../providers/process';
import { ProcessDraft } from '../../types/process/types';
import ProcessList from '../process/process-list';
import NewProcessForm from './new-process';
type Props = {};

const Processes = (props: Props) => {
  const drawerState = useModalState();
  const { createProcess } = useProcess();
  const { refreshData } = useAppStateContext();

  const handleCreateProcess = async (processDraft: ProcessDraft) => {
    const result = await createProcess(processDraft);
    if (!!result) {
      refreshData?.();
      drawerState.closeModal();
    }
  };

  return (
    <>
      <Spacings.Stack scale="xl">
        <Text.Headline as="h1">Data transform processes</Text.Headline>

        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <Text.Subheadline as="h4">List of processes</Text.Subheadline>
            <PrimaryButton
              iconLeft={<PlusBoldIcon />}
              label="Add new process"
              onClick={drawerState.openModal}
            />
          </Spacings.Inline>
          <ProcessList />
        </Spacings.Stack>
      </Spacings.Stack>
      <Drawer
        title="Add new process"
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
      >
        <NewProcessForm
          onSubmit={handleCreateProcess}
          onCancel={drawerState.closeModal}
        />
      </Drawer>
    </>
  );
};

export default Processes;
