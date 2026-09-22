import styled, { css } from "styled-components";
import { colors } from "../../ui/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CanvasContainer = styled.div`
  flex: 1;
  min-width: 0; /* prevents flex overflow, the actual bug */
  box-sizing: border-box;
  margin: ${({ $expanded }) => ($expanded ? "0px" : "10px 20px 16px")};
  height: ${({ $expanded, $selectedMenu }) =>
    $expanded ? "100%" : $selectedMenu ? "65dvh" : "75dvh"};
  overflow: hidden;
  border: ${({ $expanded }) => ($expanded ? "0" : `2px solid ${colors.ink}`)};
  border-radius: ${({ $expanded }) => ($expanded ? "0" : "16px")};
  background: ${colors.surface};
  box-shadow: ${({ $expanded }) => ($expanded ? "none" : `0 6px 0 ${colors.ink}`)};

  @media (max-width: 480px) {
    margin: 8px 10px 12px;
    height: ${({ $expanded, $selectedMenu }) =>
      $expanded ? "100%" : $selectedMenu ? "55dvh" : "60dvh"};
  }
`;

/* ---------- Floating controls ---------- */
const floating = css`
  position: absolute;
  right: 40px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.ink};
  cursor: pointer;
  box-shadow: 0 3px 0 ${colors.ink};
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;

  &:hover {
    background: ${colors.yarn};
    transform: translateY(-2px);
    box-shadow: 0 5px 0 ${colors.ink};
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 ${colors.ink};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 3px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    right: 16px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ExportButton = styled.button`
  ${floating}
  bottom: 85px;

  @media (max-width: 480px) {
    bottom: 70px;
  }
`;

export const ExpandButton = styled.button`
  ${floating}
  bottom: 35px;

  @media (max-width: 480px) {
    bottom: 24px;
  }
`;

export const ZoomButtonsContainer = styled.div`
  position: absolute;
  top: 28px;
  right: 40px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  background: ${colors.surface};
  box-shadow: 0 3px 0 ${colors.ink};

  @media (max-width: 480px) {
    top: 16px;
    right: 16px;
  }
`;

export const ZoomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${colors.ink};
  cursor: pointer;

  & + & {
    border-top: 2px solid ${colors.ink};
  }

  &:hover {
    background: ${colors.yarn};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: -3px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;