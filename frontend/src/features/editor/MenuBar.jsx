import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMenu } from "./editorSlice";
import { colors, fontStack, ghostButton } from "../../ui/theme";

const Bar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px clamp(16px, 3vw, 36px);
  overflow-x: auto;
  background: ${colors.paper};
  border-bottom: 2px dashed ${colors.stitchLine};
  color: ${colors.ink};
  font-family: ${fontStack};
`;

const Items = styled.div`
  display: flex;
  gap: 8px;
`;

/* Same yarn patch as the Learn and profile tabs */
const MenuButton = styled.button`
  position: relative;
  flex: none;
  padding: 8px 18px;
  border: 0;
  border-radius: 10px;
  background: ${({ $active }) => ($active ? colors.yarn : "transparent")};
  box-shadow: ${({ $active }) => ($active ? `0 3px 0 ${colors.ink}` : "none")};
  color: ${colors.ink};
  font: inherit;
  font-size: 1.05rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    inset: 3px;
    border: 2px dashed rgba(22, 48, 32, 0.5);
    border-radius: 7px;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    pointer-events: none;
  }

  &:hover span {
    text-decoration: underline wavy
      ${({ $active }) => ($active ? colors.ink : colors.yarn)};
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;

const ExportButton = styled.button`
  ${ghostButton}
  flex: none;
  padding: 6px 18px;
  border-radius: 10px;
  font-size: 1rem;
`;

export default function MenuBar() {
  const selected = useSelector((state) => state.editor.selectedMenu);
  const pattern = useSelector((state) => state.editor.pattern);
  const dispatch = useDispatch();

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
    <Bar aria-label="Editor menu">
      <Items>
        {["File", "Edit", "View", "Stitch"].map((item) => (
          <MenuButton
            key={item}
            type="button"
            $active={selected === item}
            aria-pressed={selected === item}
            onClick={() => dispatch(setSelectedMenu(item))}
          >
            <span>{item}</span>
          </MenuButton>
        ))}
      </Items>
      <ExportButton type="button" onClick={() => exportPattern()}>
        Export
      </ExportButton>
    </Bar>
  );
}