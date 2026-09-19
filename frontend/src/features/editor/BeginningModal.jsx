import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { startPattern } from "./editorSlice";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalTitle,
  FormGroup,
  Label,
  Select,
  ModalButtons,
  SubmitButton,
} from "../../ui/ModalStyles";

const Dialog = styled(ModalContent)`
  max-width: 440px;
`;

export default function BeginningModal({ isOpen, onClose }) {
  const [startStitch, setStartStitch] = useState("mr");
  const dispatch = useDispatch();

  function handleStart() {
    dispatch(startPattern({ stitch: startStitch }));
    onClose();
  }

  if (!isOpen) return null;

  return (
    <Modal>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="beginning-title"
      >
        <ModalBody>
          <ModalHeader>
            <ModalTitle id="beginning-title">Choose a method to start</ModalTitle>
          </ModalHeader>

          <FormGroup>
            <Label htmlFor="start-method">Start with</Label>
            <Select
              id="start-method"
              value={startStitch}
              onChange={(e) => setStartStitch(e.target.value)}
            >
              <option value="mr">Magic Ring</option>
              <option value="ch">Chain Stitch</option>
            </Select>
          </FormGroup>

          <ModalButtons>
            <SubmitButton type="button" onClick={handleStart}>
              Start
            </SubmitButton>
          </ModalButtons>
        </ModalBody>
      </Dialog>
    </Modal>
  );
}