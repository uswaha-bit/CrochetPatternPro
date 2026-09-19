import { useSelector } from "react-redux";
import styled from "styled-components";
import AskAIComponent from "./AskAIComponent";
import CrochetBasicsComponent from "./CrochetBasicsComponent";
import UsingEditorComponent from "./UsingEditorComponent";
import OtherResourcesComponent from "./OtherResourcesComponent";
import { Heading, Lede } from "./shared";
import { colors } from "../../ui/theme";

const PANELS = {
  "crochet-basics": CrochetBasicsComponent,
  "using-editor": UsingEditorComponent,
  "other-resources": OtherResourcesComponent,
  "ask-ai": AskAIComponent,
};

const Main = styled.main`
  position: relative;
  isolation: isolate;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  padding: clamp(28px, 5vw, 64px) clamp(20px, 5vw, 64px) 96px;

  /* Graph paper at the top of the page, fading out (same as the home hero) */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 420px;
    z-index: -1;
    background-image: linear-gradient(${colors.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${colors.grid} 1px, transparent 1px);
    background-size: 32px 32px;
    -webkit-mask-image: linear-gradient(#000, transparent);
    mask-image: linear-gradient(#000, transparent);
  }
`;

const Inner = styled.div`
  max-width: 1000px;
`;

const Notes = styled.div`
  max-width: 760px;
`;

const Note = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 6fr);
  gap: 8px 40px;
  padding: 28px 0;
  border-top: 2px dashed ${colors.stitchLine};

  &:last-child {
    border-bottom: 2px dashed ${colors.stitchLine};
  }

  h2 {
    margin: 0;
    font-size: clamp(1.4rem, 2.4vw, 1.9rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.5;
    color: ${colors.muted};
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

function Welcome() {
  return (
    <>
      <Heading>Welcome to skill development</Heading>
      <Lede>
        Here you’ll find helpful guides and tips to improve your crochet skills,
        use the pattern editor effectively, and explore more resources.
      </Lede>
      <Notes>
        <Note>
          <h2>Getting started</h2>
          <p>
            If you’re new to crochet, start with Crochet basics in the sidebar.
            We cover stitches, tools, and techniques step by step.
          </p>
        </Note>
        <Note>
          <h2>Need help?</h2>
          <p>
            Use Ask AI to get help with your crochet questions or with the
            editor, in real time.
          </p>
        </Note>
      </Notes>
    </>
  );
}

export default function MainContent() {
  const activeTab = useSelector((state) => state.learn.activeTab);
  const Panel = PANELS[activeTab] ?? Welcome;

  return (
    <Main>
      <Inner>
        <Panel />
      </Inner>
    </Main>
  );
}