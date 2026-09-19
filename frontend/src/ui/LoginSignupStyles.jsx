import styled from "styled-components";
import { Link } from "react-router-dom";

export const FieldsContainer = styled.form`
  background-color: var(--primary-color);
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  padding: 50px;
  margin-top: 20px;

  @media (max-width: 990px) {
    width: 55%;
  }

  @media (max-width: 700px) {
    width: 85%;
  }
`;


export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 1;
`;

export const Title = styled.div`
  font-size: 34px;
  width: 100%;
  text-align: center;
  padding-block: 10px 30px;
`;

export const InputsContainer = styled.div`
  margin-bottom: 20px;
  width: 90%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 10px 0;
`;
export const Input = styled.input`
  background-color: var(--secondary-color) !important;
    border: ${({ $hasError }) => ($hasError ? "1px solid red" : "1px solid transparent")} !important;
  border-radius: 10px !important;
  padding: 20px 15px !important;
  width: 90% !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;

  &:focus,
  &:active {
    outline: none !important;
    box-shadow: none !important;
    border: ${({ $hasError }) => ($hasError ? "1px solid red" : "var(--fifth-color)")} !important;
    background-color: var(--secondary-color) !important;
  }

  &::placeholder {
    color: transparent !important;
  }
`;
export const Select = styled.select`
  width: 98%;
  padding: 20px 15px !important;
  border: 1px solid ${props => props.$hasError ? 'red' : 'transparent'};
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
  background-color: var(--secondary-color) !important;

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border: ${({ $hasError }) => ($hasError ? "1px solid red" : "var(--fifth-color)")} !important;
    background-color: var(--secondary-color) !important;
  }
`;
export const RadioTitleLabel = styled.label`
  font-size: 16px !important;
  color: ${({ $hasError }) => ($hasError ? "red" : "var(--fourth-color)")} !important;
`;
export const Label = styled.label`
  position: absolute !important;
  left: 15px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  transition: 0.3s ease-in-out !important;
  pointer-events: none !important;
  color: ${({ $hasError }) => ($hasError ? "red" : "var(--fourth-color)")} !important;

  ${({ $isFocused, $hasContent, $isAutofilled, $isInvalid }) =>
    ($isFocused || $hasContent || $isAutofilled) &&
    `
    top: -23% !important;
  color: ${({ $hasError }) => ($hasError ? "red" : "var(--fifth-color)")}!important;
  `}
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 70%;
`;

export const Button = styled.button`
  background-color: ${(props) =>
    props.$variant === "cancel" ? "var(--secondary-color)" : "var(--fifth-color)"};
  font-size: 18px;
  padding: 12px 24px;
  min-width: 100px;
  display: flex;
  border: none;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.variant === "cancel"
        ? "var(--hovered-grey-button)"
        : "var(--hovered-green-button)"};
  }
`;

export const BottomLink = styled.div`
  display: flex;
  font-size: 14px;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: #281562;
  font-weight: bold;
  margin-left: 5px;
`;


export const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid ${props => props.$hasError ? '#ff4d4f' : '#d9d9d9'};
    border-radius: 4px;
    font-size: 16px;
    transition: all 0.3s;

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      outline: none;
    }
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
`;