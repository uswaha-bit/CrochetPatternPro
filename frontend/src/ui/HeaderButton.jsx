import styled from "styled-components"
const Button = styled.button`
  background-color: var(--secondary-color);
  font-size: 20px;
  width: 130px;
  display: flex;
  border: none;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  &:hover{
    border: 2px solid black;
  }
`;
export default function HeaderButton({text, onPressButton}) {
  return (
    <Button onClick={onPressButton}>
        {text}
    </Button>
  )
}
