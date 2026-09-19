import { css } from "styled-components";

export const colors = {
  paper: "#f2f7e7", // graph-paper green, page background
  surface: "#fbfdf6", // a lighter paper for panels and inputs
  ink: "#163020", // deep forest, text and borders
  muted: "#4b5d4e", // secondary text
  leaf: "#4a8a3c", // the green from the leaf illustrations
  yarn: "#f2b33d", // marigold accent
  error: "#b3261e", // form errors
  stitchLine: "rgba(22, 48, 32, 0.35)", // dashed dividers
  grid: "rgba(74, 138, 60, 0.13)", // graph-paper lines
};

export const fontStack = `"Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", sans-serif`;

export const HEADER_HEIGHT = "72px";

export const patchButton = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 28px;
  border: 0;
  border-radius: 14px;
  background: ${colors.yarn};
  color: ${colors.ink};
  font: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 0 ${colors.ink};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &::after {
    content: "";
    position: absolute;
    inset: 5px;
    border: 2px dashed rgba(22, 48, 32, 0.5);
    border-radius: 9px;
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 ${colors.ink};
  }

  &:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 ${colors.ink};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ghostButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 26px;
  border: 2px solid ${colors.ink};
  border-radius: 14px;
  background: transparent;
  color: ${colors.ink};
  font: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${colors.ink};
    color: ${colors.paper};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;