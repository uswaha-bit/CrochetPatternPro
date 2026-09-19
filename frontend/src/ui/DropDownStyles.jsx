import styled from "styled-components";
export const Icon = styled.img`
  width: 40px;
  cursor: pointer;
`;

export const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownMenuWrapper = styled.ul`
  position: absolute;
  top: ${({ $top }) => ($top)};
  right: ${({ $right }) => ($right)};
  list-style: none;
  margin: 0;
  padding: 10px;
  background-color: var(--third-color);
  border: 1px solid #ddd;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  z-index: 100;
`;

export const DropdownItem = styled.li`
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid var(--third-color);

  &:hover {
    border: 1px solid black;
  }
`;