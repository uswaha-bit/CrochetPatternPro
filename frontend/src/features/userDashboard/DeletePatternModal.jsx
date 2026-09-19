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
  gap: 20px;
`;

const Title = styled.div`
  font-size: 20px;
  padding-inline: 10px;
  align-self: flex-start;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`;

export default function DeletePatternModal({ isOpen, onClose, onDelete, isDeleting }) {
  return (
    <Overlay $isOpen={isOpen}>
      <ModalContent>
        <Title>Are you sure you want to delete this pattern?</Title>
        <ButtonRow>
          <Button onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button onClick={onClose} disabled={isDeleting} style={{ backgroundColor: "#ccc", color: "#000" }}>
            Cancel
          </Button>
        </ButtonRow>
      </ModalContent>
    </Overlay>
  );
}
