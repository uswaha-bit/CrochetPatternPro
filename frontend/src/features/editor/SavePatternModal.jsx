import { useState } from "react";
import styled from "styled-components";
import { Button } from "../../ui/LoginSignupStyles";
import { useSelector } from "react-redux";

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

const Input = styled.input`
  padding: 0.6rem 1rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
`;

export default function SavePatternModal({ isOpen, onClose, onSave, isLoading }) {
  const name = useSelector(state => state.editor.name);
  const id = useSelector(state => state.editor.id);
  const [patternName, setPatternName] = useState(name);

  const handleSave = () => {
    if (patternName.trim()) {
      onSave(patternName.trim(), id);
      onClose();
      setPatternName("");
    }
  };

  const handleCancel = () => {
    onClose();
    setPatternName(name); // Reset to original
  };

  return (
    <Overlay $isOpen={isOpen}>
      <ModalContent>
        <Title>Enter Pattern Name</Title>
        <Input
          type="text"
          value={patternName}
          onChange={(e) => setPatternName(e.target.value)}
          placeholder="My Pattern"
          disabled={isLoading}
        />
        <ButtonGroup>
          <Button $variant="cancel"  onClick={handleCancel} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading}>Save</Button>
        </ButtonGroup>
      </ModalContent>
    </Overlay>
  );
}
