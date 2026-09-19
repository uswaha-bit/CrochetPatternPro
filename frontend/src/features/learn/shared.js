import styled, { css } from "styled-components";
import { colors } from "../../ui/theme";

export const Heading = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(2.4rem, 5.5vw, 4.25rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-variation-settings: "opsz" 96;
  text-wrap: balance;
`;

export const Lede = styled.p`
  margin: 0 0 48px;
  max-width: 46ch;
  font-size: 1.15rem;
  line-height: 1.5;
  color: ${colors.muted};
`;

export const SectionTitle = styled.h2`
  margin: 0 0 20px;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
`;

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