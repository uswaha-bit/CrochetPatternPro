import styled from "styled-components";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalButtons,
  CancelButton,
} from "./ModalStyles";
import { colors, patchButton } from "./theme";

const Dialog = styled(ModalContent)`
  max-width: 440px;
`;

const Question = styled.h2`
  margin: 0 0 28px;
  font-size: clamp(1.4rem, 3.5vw, 1.8rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-wrap: balance;
`;

// Same patch as the primary button, in error red
const DangerButton = styled.button`
  ${patchButton}
  background: ${colors.error};
  color: ${colors.surface};

  &::after {
    border-color: rgba(251, 253, 246, 0.55);
  }
`;

export default function ConfirmDialog({
  isOpen,
  title,
  confirmLabel = "Delete",
  busyLabel = "Deleting...",
  onConfirm,
  onClose,
  isBusy = false,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      onClick={(e) => {
        if (e.target === e.currentTarget && !isBusy) onClose();
      }}
    >
      <Dialog
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <ModalBody>
          <Question id="confirm-title">{title}</Question>
          <ModalButtons>
            {/* Cancel is focused first: the safe choice for a destructive action */}
            <CancelButton
              type="button"
              autoFocus
              onClick={onClose}
              disabled={isBusy}
            >
              Cancel
            </CancelButton>
            <DangerButton type="button" onClick={onConfirm} disabled={isBusy}>
              {isBusy ? busyLabel : confirmLabel}
            </DangerButton>
          </ModalButtons>
        </ModalBody>
      </Dialog>
    </Modal>
  );
}