import styled from "styled-components";
import { Heading, Lede } from "./shared";
import { colors } from "../../ui/theme";

// One string per step. Wrap a word in **double asterisks** to make it bold.
const steps = [
  "Begin by selecting a starting stitch from the available options to initialize your design.",
  "Click on a stitch in the stitch bar to activate it for placement on the canvas.",
  "For a refresher on stitch types and their meanings, visit the **Crochet basics** section.",
  "Hover over the desired location in the pattern grid and click to insert the selected stitch.",
  "To change the color of an existing stitch, first deselect the active stitch tool.",
  "Then, click on the target stitch, open the Stitch Menu, and navigate to the Submenu Bar → Color Palette to apply a new color.",
  "Use the Edit Menu’s Submenu to **undo** or **redo** recent actions as needed.",
  "Seamlessly switch between **2D** and **3D** views for different visual perspectives of your pattern.",
  "Access the graphical visualization mode to better understand stitch connections and overall layout.",
  "Click the **Download** icon on the canvas to export your pattern as an image file.",
  "Use the zoom controls to magnify or minimize your view for detailed adjustments.",
  "Expand the canvas area by clicking the **Expand** icon for a larger working space.",
  "That’s it! You’re now ready to create and customize your own crochet designs with ease.",
];

// Splits on ** so every odd-numbered piece is bold
function renderStep(text) {
  return text
    .split("**")
    .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

/* Numbered steps joined by a dashed thread, like the home page */
const Steps = styled.ol`
  max-width: 720px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
`;

const Step = styled.li`
  position: relative;
  counter-increment: step;
  padding: 4px 0 28px 60px;
  font-size: 1.1rem;
  line-height: 1.6;

  /* number badge */
  &::before {
    content: counter(step);
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${colors.ink};
    color: ${colors.paper};
    font-size: 0.95rem;
    font-weight: 700;
  }

  /* the thread to the next step */
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 44px;
    bottom: 4px;
    left: 17px;
    border-left: 2px dashed ${colors.stitchLine};
  }

  strong {
    font-weight: 700;
    text-decoration: underline;
    text-decoration-color: ${colors.yarn};
    text-decoration-thickness: 3px;
    text-underline-offset: 3px;
  }
`;

export default function UsingEditorComponent() {
  return (
    <>
      <Heading>Using the pattern editor</Heading>
      <Lede>Everything you need to go from a blank grid to a finished chart.</Lede>
      <Steps>
        {steps.map((text, i) => (
          <Step key={i}>{renderStep(text)}</Step>
        ))}
      </Steps>
    </>
  );
}