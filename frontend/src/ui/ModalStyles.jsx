import styled from "styled-components";
import { colors, fontStack, patchButton, ghostButton } from "./theme";

/* ---------- Dialog: the same stitched swatch as the login card ---------- */
export const Modal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(22, 48, 32, 0.55);
  color: ${colors.ink};
  font-family: ${fontStack};
`;

export const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 520px;
  max-height: calc(100dvh - 48px);
  border: 2px solid ${colors.ink};
  border-radius: 20px;
  background: ${colors.surface};
  box-shadow: 0 6px 0 ${colors.ink};

  /* dashed seam just inside the edge */
  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 2px dashed ${colors.stitchLine};
    border-radius: 13px;
    pointer-events: none;
  }
`;

/* The seam stays put; only this part scrolls */
export const ModalBody = styled.div`
  overflow-y: auto;
  padding: 36px;

  @media (max-width: 480px) {
    padding: 28px 22px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variation-settings: "opsz" 96;
`;

export const CloseButton = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 2px solid ${colors.ink};
  border-radius: 10px;
  background: transparent;
  color: ${colors.ink};
  font: inherit;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${colors.ink};
    color: ${colors.paper};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* ---------- Fields ---------- */
export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.95rem;
  font-weight: 700;
`;

const fieldBorder = ({ $error }) => ($error ? colors.error : colors.ink);

export const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 2px solid ${fieldBorder};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.ink};
  font: inherit;
  font-size: 1rem;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='M1 1.5l6 6 6-6' fill='none' stroke='%23163020' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

export const Select = styled.select`
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 0 44px 0 16px;
  border: 2px solid ${fieldBorder};
  border-radius: 12px;
  background-color: ${colors.surface};
  background-image: ${chevron};
  background-repeat: no-repeat;
  background-position: right 16px center;
  color: ${colors.ink};
  font: inherit;
  font-size: 1rem;
  appearance: none;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  /* the "Select …" placeholder option looks like a placeholder */
  &:has(option[value=""]:checked) {
    color: ${colors.muted};
  }
`;

export const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border: 2px solid ${fieldBorder};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.ink};
  font: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;

export const FileInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 14px 16px;
  border: 2px dashed ${({ $error }) => ($error ? colors.error : colors.stitchLine)};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.muted};
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    border-color: ${colors.ink};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  &::file-selector-button {
    margin-right: 14px;
    padding: 6px 14px;
    border: 2px solid ${colors.ink};
    border-radius: 10px;
    background: transparent;
    color: ${colors.ink};
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  &::file-selector-button:hover {
    background: ${colors.ink};
    color: ${colors.paper};
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 6px;
  color: ${colors.error};
  font-size: 0.9rem;
  font-weight: 500;
`;

export const FilePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

export const FileItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 4px 6px 4px 12px;
  border: 2px solid ${colors.ink};
  border-radius: 999px;
  background: ${colors.paper};
  font-size: 0.875rem;
  font-weight: 500;

  span {
    overflow: hidden;
    max-width: 220px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const RemoveFileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  color: ${colors.ink};
  font: inherit;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${colors.error};
    color: ${colors.surface};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 1px;
  }
`;

/* ---------- Buttons ---------- */
export const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 32px;
  padding-bottom: 4px; /* room for the patch button's shadow */
`;

export const CancelButton = styled.button`
  ${ghostButton}
`;

export const SubmitButton = styled.button`
  ${patchButton}
`;