
import React, { useState } from "react";
import styled from "styled-components";
import { Button, Select } from "../../ui/LoginSignupStyles";
import { useDispatch } from "react-redux";
import { startPattern } from "./editorSlice";
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
export default function BeginningModal({ isOpen, onClose }) { 
    const [startStitch, setStartStitch] = useState('mr');
    const dispatch = useDispatch();
  
    function handleStart(){
      dispatch(startPattern({stitch: startStitch}));
      onClose();
    }
  
    return (
      <Overlay $isOpen={isOpen}>
        <ModalContent>
          <Title>Choose a method to start:</Title>
          <Select value={startStitch} onChange={(e) => setStartStitch(e.target.value)}>
            <option value="mr">Magic Ring</option>
            <option value="ch">Chain Stitch</option>
          </Select>
          <Button onClick={handleStart}>Start</Button>
        </ModalContent>
      </Overlay>
    );
  }
  