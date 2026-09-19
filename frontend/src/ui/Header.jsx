import styled from "styled-components";
import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px clamp(20px, 5vw, 64px);
  background: #f2f7e7;
  color: #163020;
  border-bottom: 2px dashed rgba(22, 48, 32, 0.35); /* a stitch line */
  font-family: "Bricolage Grotesque", system-ui, -apple-system, "Segoe UI",
    sans-serif;

  .dropdown {
    display: none;
  }
  @media (max-width: 900px) {
    .dropdown {
      display: block;
    }
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;

   img {
    flex: none;
    height: 46px;
    width: auto;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;

    img {
      height: 38px;
    }
  }

  &:focus-visible {
    outline: 3px solid #4a8a3c;
    outline-offset: 3px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const Cont = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavItem = styled(Link)`
  padding: 8px 16px;
  border: 2px solid transparent;
  border-radius: 12px;
  color: inherit;
  font-size: 1.05rem;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline wavy #f2b33d;
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }

  &:focus-visible {
    outline: 3px solid #4a8a3c;
    outline-offset: 2px;
  }

  /* The last item is the main action (Register / Profile) */
  &:last-child {
    border-color: #163020;
    font-weight: 700;
  }
  &:last-child:hover {
    background: #163020;
    color: #f2f7e7;
    text-decoration: none;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;


function Header({ navItems }) {
  return (
    <HeaderBar>
      <Brand to="/" aria-label="Crochet Pattern Pro home">
        <img src="/crochet-pattern-pro-logo.svg" alt="" />
        Crochet Pattern Pro
      </Brand>
      <Cont aria-label="Main">
        <DropdownMenu items={navItems} />
        {navItems.map((item) => (
          <NavItem key={item.path} to={item.path}>
            {item.label}
          </NavItem>
        ))}
      </Cont>
    </HeaderBar>
  );
}

export default Header;