import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SetActiveTab, ToggleMenu } from "./learnSlice";
import { colors, HEADER_HEIGHT } from "../../ui/theme";

import BookOpenIcon from "../../assets/book-open.png";
import AskAIIcon from "../../assets/ask-ai.png";
import UsingEditorIcon from "../../assets/using-editor.png";
import PencilIcon from "../../assets/pencil.png";
import MenuIcon from "../../assets/menu-icon.png";

const TABS = [
  { id: "crochet-basics", label: "Crochet basics", icon: PencilIcon },
  { id: "using-editor", label: "Using the editor", icon: UsingEditorIcon },
  { id: "other-resources", label: "Other resources", icon: BookOpenIcon },
  { id: "ask-ai", label: "Ask AI", icon: AskAIIcon },
];

const Aside = styled.aside`
  position: sticky;
  top: ${HEADER_HEIGHT};
  align-self: flex-start;
  flex: none;
  box-sizing: border-box;
  width: ${({ $open }) => ($open ? "290px" : "88px")};
  min-height: calc(100vh - ${HEADER_HEIGHT});
  padding: 28px 16px;
  border-right: 2px dashed ${colors.stitchLine};
  transition: width 0.2s ease;

  @media (max-width: 800px) {
    position: static;
    width: 100%;
    min-height: 0;
    padding: 16px;
    border-right: none;
    border-bottom: 2px dashed ${colors.stitchLine};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Toggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $open }) => ($open ? "flex-start" : "center")};
  gap: 12px;
  width: 100%;
  margin-bottom: 24px;
  padding: 8px;
  border: 0;
  border-radius: 12px;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  @media (max-width: 800px) {
    display: none;
  }
`;

const Title = styled.span`
  display: ${({ $open }) => ($open ? "block" : "none")};
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
`;

const Icon = styled.img`
  flex: none;
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 800px) {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 6px; /* room for the active tab's shadow */
  }
`;

const TabButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ $open }) => ($open ? "flex-start" : "center")};
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border: 0;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? colors.yarn : "transparent")};
  box-shadow: ${({ $active }) => ($active ? `0 4px 0 ${colors.ink}` : "none")};
  color: ${colors.ink};
  font: inherit;
  font-size: 1.05rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: left;
  cursor: pointer;

  /* dashed seam on the active tab, like the patch button */
  &::after {
    content: "";
    position: absolute;
    inset: 4px;
    border: 2px dashed rgba(22, 48, 32, 0.5);
    border-radius: 8px;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    pointer-events: none;
  }

  &:hover span {
    text-decoration: underline wavy ${({ $active }) => ($active ? colors.ink : colors.yarn)};
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  @media (max-width: 800px) {
    justify-content: flex-start;
    width: auto;
    white-space: nowrap;
  }
`;

const Label = styled.span`
  display: ${({ $open }) => ($open ? "block" : "none")};

  @media (max-width: 800px) {
    display: block;
  }
`;

export default function Sidebar() {
  const dispatch = useDispatch();
  const { activeTab, openMenu } = useSelector((state) => state.learn);

  return (
    <Aside $open={openMenu}>
      <Toggle
        type="button"
        $open={openMenu}
        onClick={() => dispatch(ToggleMenu())}
        aria-expanded={openMenu}
        aria-label={openMenu ? "Collapse menu" : "Expand menu"}
      >
        <Icon src={MenuIcon} alt="" />
        <Title $open={openMenu}>Skill development</Title>
      </Toggle>

      <nav aria-label="Learn topics">
        <List>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <TabButton
                  type="button"
                  $active={active}
                  $open={openMenu}
                  aria-current={active ? "true" : undefined}
                  aria-label={tab.label}
                  title={tab.label}
                  onClick={() => dispatch(SetActiveTab(tab.id))}
                >
                  <Icon src={tab.icon} alt="" />
                  <Label $open={openMenu}>{tab.label}</Label>
                </TabButton>
              </li>
            );
          })}
        </List>
      </nav>
    </Aside>
  );
}