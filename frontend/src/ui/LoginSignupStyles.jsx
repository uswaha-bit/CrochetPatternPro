import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import {
  colors,
  fontStack,
  HEADER_HEIGHT,
  patchButton,
  ghostButton,
} from "./theme";

const { paper, surface, ink, muted, leaf, yarn, error, stitchLine, grid } =
  colors;

/* ---------- Page area under the header ---------- */
export const Container = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - ${HEADER_HEIGHT});
  padding: clamp(32px, 7vw, 88px) 20px 96px;
  background: ${paper};
  color: ${ink};
  font-family: ${fontStack};

  /* Graph paper, fading out downwards (same as the home hero) */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image: linear-gradient(${grid} 1px, transparent 1px),
      linear-gradient(90deg, ${grid} 1px, transparent 1px);
    background-size: 32px 32px;
    -webkit-mask-image: linear-gradient(#000 40%, transparent);
    mask-image: linear-gradient(#000 40%, transparent);
  }
`;

/* ---------- The form, drawn as a stitched swatch ---------- */
export const FieldsContainer = styled.form`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  max-width: 480px;
  padding: 40px 36px;
  border: 2px solid ${ink};
  border-radius: 20px;
  background: ${surface};
  box-shadow: 0 6px 0 ${ink};

  /* dashed seam just inside the edge */
  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 2px dashed ${stitchLine};
    border-radius: 13px;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.9rem, 5vw, 2.6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variation-settings: "opsz" 96;
  text-wrap: balance;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

/* ---------- Floating label ----------
   Idle: sits inside the field like a placeholder.
   Focused or filled: shrinks and rides on the top border. */
export const Label = styled.label`
  position: absolute;
  top: 26px; /* half of the 52px field height */
  left: 12px;
  z-index: 1;
  padding: 0 6px;
  transform: translateY(-50%);
  background: transparent;
  color: ${muted};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  pointer-events: none;
  transition: top 0.15s ease, font-size 0.15s ease, color 0.15s ease,
    background-color 0.15s ease;

  ${({ $isFocused, $hasContent }) =>
    ($isFocused || $hasContent) &&
    css`
      top: 0;
      background: ${surface};
      color: ${ink};
      font-size: 0.8rem;
      font-weight: 700;
    `}

  ${({ $hasError }) =>
    $hasError &&
    css`
      color: ${error};
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* ---------- Fields ---------- */
const field = css`
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 2px solid ${({ $hasError }) => ($hasError ? error : ink)};
  border-radius: 12px;
  background: ${surface};
  color: ${ink};
  font: inherit;
  font-size: 1rem;

  &:focus-visible {
    outline: 3px solid ${leaf};
    outline-offset: 2px;
  }

  /* keep browser autofill from painting its own colour */
  &:-webkit-autofill {
    box-shadow: 0 0 0 100px ${surface} inset;
    -webkit-text-fill-color: ${ink};
  }
`;

export const Input = styled.input`
  ${field}
  color-scheme: light;
`;

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='M1 1.5l6 6 6-6' fill='none' stroke='%23163020' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

export const Select = styled.select`
  ${field}
  padding-right: 44px;
  appearance: none;
  background-image: ${chevron};
  background-repeat: no-repeat;
  background-position: right 16px center;
  cursor: pointer;

  /* "Select …" placeholder option looks like a placeholder */
  &:has(option[value=""]:checked) {
    color: ${muted};
  }
`;

// Wraps the date input; the field itself fills the width
export const DatePickerWrapper = styled.div`
  width: 100%;

  & > * {
    width: 100%;
  }
`;

export const ErrorMessage = styled.p`
  margin: 6px 0 0;
  color: ${error};
  font-size: 0.9rem;
  font-weight: 500;
`;

/* ---------- Buttons ---------- */
export const ButtonsContainer = styled.div`
  display: flex;
  gap: 14px;
  padding-bottom: 4px; /* room for the patch button's shadow */
`;

// $variant="cancel" → outlined; anything else → the yarn patch
export const Button = styled.button`
  flex: 1 1 0;
  min-width: 0;
  white-space: nowrap;
  ${({ $variant }) => ($variant === "cancel" ? ghostButton : patchButton)}
`;

/* ---------- Footer link ---------- */
export const BottomLink = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  color: ${muted};
  font-size: 1rem;
`;

export const StyledLink = styled(Link)`
  color: ${ink};
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: ${leaf};
  text-decoration-thickness: 2px;
  text-underline-offset: 5px;

  &:hover {
    text-decoration-style: wavy;
    text-decoration-color: ${yarn};
  }

  &:focus-visible {
    outline: 3px solid ${leaf};
    outline-offset: 3px;
    border-radius: 4px;
  }
`;