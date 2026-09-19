import { useSelector } from "react-redux";
import styled from "styled-components";
import Header from "../../ui/Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { colors, fontStack } from "../../ui/theme";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${colors.paper};
  color: ${colors.ink};
  font-family: ${fontStack};
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export default function Index() {
  const { isLoggedIn, userDetail } = useSelector((store) => store.user);
  const id = userDetail?._id;

  const navItems = isLoggedIn
    ? [
        { label: "Editor", path: "/editor" },
        { label: "Community", path: `/user/${id}/newsfeed` },
        { label: "Profile", path: `/user/${id}` },
      ]
    : [
        { label: "Editor", path: "/editor" },
        { label: "Home", path: "/" },
        { label: "Login", path: "/login" },
      ];

  return (
    <Page>
      <Header navItems={navItems} />
      <Body>
        <Sidebar />
        <MainContent />
      </Body>
    </Page>
  );
}