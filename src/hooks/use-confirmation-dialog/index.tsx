import {
  ConfirmationDialog,
  useModalState,
} from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useState } from 'react';

interface Props {
  hideDeleteDialog?: boolean;
  hideActionDialog?: boolean;
  deleteButtonLabel?: string;
  deleteMessage?: string;
  deleteDetailsMessage?: string;
  saveButtonLabel?: string;
  saveMessage?: string;
}

export const useConfirmationDialog = ({
  revertAction,
  deleteAction,
  saveAction,
}: {
  revertAction?: (key: string) => void;
  deleteAction?: (key: string) => void;
  saveAction?: (key: string) => void;
}) => {
  const [tempSaveEntityKey, setTempSaveEntityKey] = useState<string>('');
  const [tempDeleteEntityKey, setTempDeleteEntityKey] = useState<string>('');
  const {
    closeModal: closeDeleteModal,
    openModal: openDeleteModal,
    isModalOpen: isDeleteModalOpen,
  } = useModalState();
  const {
    closeModal: closeSaveModal,
    openModal: openSaveModal,
    isModalOpen: isSaveModalOpen,
  } = useModalState();

  const handleCloseDeleteModal = () => {
    setTempDeleteEntityKey('');
    closeDeleteModal();
  };

  const handleCloseSaveModal = () => {
    revertAction?.(tempSaveEntityKey);
    setTempSaveEntityKey('');
    closeSaveModal();
  };

  const handleSave = (key: string) => {
    setTempSaveEntityKey(key);
    openSaveModal();
  };
  const handleDelete = (key: string) => {
    setTempDeleteEntityKey(key);
    openDeleteModal();
  };

  const handleSaveRuleConfirmed = () => {
    saveAction?.(tempSaveEntityKey);
    handleCloseSaveModal();
  };

  const handleDeleteRuleConfirmed = () => {
    deleteAction?.(tempDeleteEntityKey);
    handleCloseDeleteModal();
  };

  const ConfirmationModals = ({
    saveButtonLabel,
    saveMessage,
    deleteButtonLabel,
    deleteMessage,
    deleteDetailsMessage,
    hideActionDialog,
    hideDeleteDialog,
  }: Props) => {
    return (
      <>
        {hideActionDialog ? null : (
          <ConfirmationDialog
            title={saveButtonLabel}
            isOpen={isSaveModalOpen}
            onClose={handleCloseSaveModal}
            onCancel={handleCloseSaveModal}
            onConfirm={handleSaveRuleConfirmed}
            labelPrimary={saveButtonLabel}
          >
            <Spacings.Stack scale="m">
              <Text.Body>{saveMessage}</Text.Body>
            </Spacings.Stack>
          </ConfirmationDialog>
        )}
        {hideDeleteDialog ? null : (
          <ConfirmationDialog
            title={deleteButtonLabel}
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onCancel={handleCloseDeleteModal}
            onConfirm={handleDeleteRuleConfirmed}
            labelPrimary={deleteButtonLabel}
          >
            <Spacings.Stack scale="m">
              <Text.Body>{deleteMessage}</Text.Body>
              <Text.Detail>{deleteDetailsMessage}</Text.Detail>
            </Spacings.Stack>
          </ConfirmationDialog>
        )}
      </>
    );
  };
  return {
    ConfirmationModals,
    handleSave,
    handleDelete,
  };
};
