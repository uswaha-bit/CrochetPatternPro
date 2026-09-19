import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMenu } from "./editorSlice";

const Menubar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--sixth-color);
  padding: 5px 30px;
  margin-bottom: 10px;
`;

const MenuItemsContainer = styled.div`
  display: flex;
  gap: 50px;
`;

const MenuItem = styled.div`
  font-size: 20px;
  cursor: pointer;
  padding: 8px 12px;
  border-bottom: ${({ selected }) => (selected ? "2px solid black" : "2px solid transparent")};
  transition: border-bottom 0.3s;
  &:hover{
    color:#5f645d
  }
`;

export default function MenuBar() {
  const selected = useSelector(state=>state.editor.selectedMenu)
  const pattern = useSelector(state=>state.editor.pattern)
  const dispatch = useDispatch()
  
  const exportPattern = () => {
    const dataStr = JSON.stringify(pattern, null, 2); // Pretty-print JSON
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "crochet-pattern.json"; // File name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };
  return (
    <Menubar>
      <MenuItemsContainer>
        {["File", "Edit", "View", "Stitch"].map((item) => (
          <MenuItem
            key={item}
            selected={selected === item}
            onClick={() => dispatch(setSelectedMenu(item))}
          >
            {item}
          </MenuItem>
        ))}
      </MenuItemsContainer>
      <MenuItem onClick={()=>exportPattern()}>
        Export
      </MenuItem>
    </Menubar>
  );
}
