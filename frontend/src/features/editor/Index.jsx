import Canvas3D from "./Canvas3D";
import Canvas2D from "./Canvas2D";
import MenuBar from "./MenuBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Header from "../../ui/Header";
import styled from "styled-components";
import SubMenuBar from "./SubMenuBar";
import Spinner from "../../ui/Spinner";
import { useGetPatternById } from "../../hooks/usePattern";
import {
  setStitches,
  setLinks,
  setPatternName,
  setId,
  resetEditor,
} from "./editorSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { colors, fontStack } from "../../ui/theme";

// min-height (not height): the canvas heights are set in vh, so the page
// background only needs to cover whatever is left over
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${colors.paper};
  color: ${colors.ink};
  font-family: ${fontStack};
`;

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expanded = useSelector((state) => state.editor.expanded);
  const view3D = useSelector((state) => state.editor.view3D);
  const user = useSelector((store) => store.user);
  const _id = user.userDetail?._id;

  const navItemsForLggedIn = [
    { label: "Learn", path: "/learn" },
    { label: "Community", path: `/user/${_id}/newsfeed` },
    { label: "Profile", path: `/user/${_id}` },
  ];
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
  ];

  const { id } = useParams();
  const { data: pattern, isPending, error } = useGetPatternById(id || ""); // only if id exists
  const [isInitializing, setIsInitializing] = useState(!!id);

  // Initialize editor with pattern if available
  useEffect(() => {
    if (id && pattern) {
      dispatch(setStitches(pattern.stitches || []));
      dispatch(setLinks(pattern.links || []));
      dispatch(setPatternName(pattern.name));
      dispatch(setId(pattern._id));
      setIsInitializing(false);
    } else {
      dispatch(resetEditor());
    }
  }, [id, pattern, dispatch]);

  // Handle fetch error
  useEffect(() => {
    if (id && error) {
      toast.error("Failed to load pattern");
      navigate(user.isLoggedIn ? `/user/${_id}` : "/login");
    }
  }, [id, error, navigate, user.isLoggedIn, _id]);

  // Show spinner if loading a pattern
  if (id && (isPending || isInitializing)) return <Spinner overlay />;

  return (
    <Container>
      {!expanded && (
        <>
          <Header navItems={user.isLoggedIn ? navItemsForLggedIn : navItems} />
          <MenuBar />
          <SubMenuBar />
        </>
      )}
      {view3D ? <Canvas3D /> : <Canvas2D />}
    </Container>
  );
}