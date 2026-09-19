import { useSelector } from "react-redux"
import styled from "styled-components"
import AskAIComponent from "./AskAIComponent"
import CrochetBasicsComponent from "./CrochetBasicsComponent"
import UsingEditorComponent from "./UsingEditorComponent"
import OtherResourcesComponent from "./OtherResourcesComponent"

const Container = styled.div`
font-family: var(--primary-font);
  display: flex;
  flex-direction: column;
  background-color: var(--primary-color);
  padding: 20px;
  flex: 1;
  border-radius: 10px;
  gap: 20px;
  color: var(--text-color, black);
`

const Section = styled.div`
  padding: 15px;
  border-radius: 8px;
  width: 100%;
`

const SectionTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 18px;
`

const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.9;
`

export default function MainContent() {
  const activeTab = useSelector(state => state.learn.activeTab)
  return (
    <Container>
      {
      // activeTab === "" ?
      // <>
      // <Section>
      //   <SectionTitle>Welcome to the Skill Development Section</SectionTitle>
      //   <Paragraph>
      //     Here you’ll find helpful guides and tips to improve your crochet
      //     skills, use the pattern editor effectively, and explore more resources.
      //   </Paragraph>
      // </Section>
      // <Section>
      //   <SectionTitle>Getting Started</SectionTitle>
      //   <Paragraph>
      //     If you're new to crochet, start with the "Crochet Basics" tab in the sidebar. We cover stitches, tools, and techniques step-by-step.
      //   </Paragraph>
      // </Section>
      // <Section>
      //   <SectionTitle>Need Help?</SectionTitle>
      //   <Paragraph>
      //     Use the "Ask AI" tab to get assistance with your crochet-related questions or editor usage in real time.
      //   </Paragraph>
      // </Section>
      // </> :
      activeTab === "ask-ai" ?
      <AskAIComponent />
      :
      activeTab === "crochet-basics" ?
      <CrochetBasicsComponent />
      :
      activeTab === "using-editor" ?
      <UsingEditorComponent />
      :
      activeTab === "other-resources" ?
      <OtherResourcesComponent />
      :
      <></>
    }
    </Container>
  )
}
