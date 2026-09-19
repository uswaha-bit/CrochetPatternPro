
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from '../assets/menu-icon.png'
import { DropdownItem, DropdownMenuWrapper, MenuWrapper, Icon } from "./DropDownStyles";
function DropdownMenu({items = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleItemClick = (item) => {
    setIsOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <MenuWrapper className="dropdown">
      <Icon src={MenuIcon} onClick={toggleMenu} />
      <DropdownMenuWrapper $isOpen={isOpen} $top={'100%'} $right={'0%'}>
        {items.map((item, index) => (
          <DropdownItem key={index} onClick={() => handleItemClick(item)}>
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenuWrapper>
    </MenuWrapper>
  );
}

export default DropdownMenu;
