import React from "react";
import styled from "styled-components";
import { Button } from "../../ui/LoginSignupStyles";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 20px;
`;

export default function DiscardChangesModal({ isOpen, onDiscard, onCancel }) {
  return (
    <Overlay $isOpen={isOpen}>
      <ModalContent>
        <Title>Are you sure you want to discard all the changes?</Title>
        <ButtonRow>
          <Button $variant="cancel" onClick={onDiscard}>Yes</Button>
          <Button onClick={onCancel}>No</Button>
        </ButtonRow>
      </ModalContent>
    </Overlay>
  );
}
