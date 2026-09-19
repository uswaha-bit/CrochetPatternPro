import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { SetActiveTab, ToggleMenu } from './learnSlice';

import BookOpenIcon from '../../assets/book-open.png';
import AskAIIcon from '../../assets/ask-ai.png';
import UsingEditorIcon from '../../assets/using-editor.png';
import PencilIcon from '../../assets/pencil.png';
import MenuIcon from '../../assets/menu-icon.png';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--primary-color);
  padding: 10px;
  align-items: center;
  border-radius: 10px;
`;

const TitleContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-top: 10px;
`;

const Title = styled.div`
  font-size: 26px;
  text-transform: capitalize;
  text-align: center;
  padding: 10px;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-inline: ${({ $openMenu }) => ($openMenu ? '30px' : '10px')};
  margin-top: 20px;
  gap: 10px;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ $active }) => ($active ? 'green' : 'black')};
  background-color: ${({ $active }) => ($active ? 'var(--secondary-color)' : 'transparent')};
  padding: 20px;
  gap: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
`;

const MenuText = styled.div`
  text-transform: capitalize;
  padding-inline: 20px;
  display: ${({ $openMenu }) => ($openMenu ? 'block' : 'none')};
`;

const Icon = styled.img``;

export default function Sidebar() {
  const dispatch = useDispatch();
  const { activeTab, openMenu } = useSelector((state) => state.learn);

  const handleToggleMenu = () => {
    dispatch(ToggleMenu());
  };

  const handleTabClick = (tab) => {
    dispatch(SetActiveTab(tab));
  };

  return (
    <SidebarContainer>
      <TitleContainer onClick={handleToggleMenu}>
        {openMenu ? (
          <Title>skill development</Title>
        ) : (
          <Icon src={MenuIcon} width={50} />
        )}
      </TitleContainer>

      <MenuContainer $openMenu={openMenu}>
        <Menu onClick={() => handleTabClick('crochet-basics')} $active={activeTab === 'crochet-basics'}>
          <Icon src={PencilIcon} width={18} alt='crochet basics icon' />
          <MenuText $openMenu={openMenu}>crochet basics</MenuText>
        </Menu>

        <Menu onClick={() => handleTabClick('using-editor')} $active={activeTab === 'using-editor'}>
          <Icon src={UsingEditorIcon} width={18} alt='using editor icon' />
          <MenuText $openMenu={openMenu}>using editor</MenuText>
        </Menu>

        <Menu onClick={() => handleTabClick('other-resources')} $active={activeTab === 'other-resources'}>
          <Icon src={BookOpenIcon} width={18} alt='other resources icon' />
          <MenuText $openMenu={openMenu}>other resources</MenuText>
        </Menu>

        <Menu onClick={() => handleTabClick('ask-ai')} $active={activeTab === 'ask-ai'}>
          <Icon src={AskAIIcon} width={20} alt='ask AI icon' />
          <MenuText $openMenu={openMenu}>ask AI</MenuText>
        </Menu>
      </MenuContainer>
    </SidebarContainer>
  );
}
