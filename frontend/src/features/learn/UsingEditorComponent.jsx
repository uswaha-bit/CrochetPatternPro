import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 2rem;
`;

const InstructionList = styled.ol`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  list-style-position: inside;
  font-size: 1rem;
  color: #2d3748;
  line-height: 1.75;
`;

const ListItem = styled.li`
  margin-bottom: 1.2rem;

  &::marker {
    font-weight: bold;
    color: var(--primary-color, #6c5ce7);
  }
`;

export default function UsingEditorComponent() {
  return (
    <Container>
      <Heading>Using the Pattern Editor</Heading>
      <InstructionList>
        <ListItem>
          Begin by selecting a starting stitch from the available options to initialize your design.
        </ListItem>
        <ListItem>
          Click on a stitch in the stitch bar to activate it for placement on the canvas.
        </ListItem>
        <ListItem>
          For a refresher on stitch types and their meanings, visit the <strong>Crochet Basics</strong> section.
        </ListItem>
        <ListItem>
          Hover over the desired location in the pattern grid and click to insert the selected stitch.
        </ListItem>
        <ListItem>
          To change the color of an existing stitch, first deselect the active stitch tool.
        </ListItem>
        <ListItem>
          Then, click on the target stitch, open the Stitch Menu, and navigate to the Submenu Bar → Color Palette to apply a new color.
        </ListItem>
        <ListItem>
          Use the Edit Menu’s Submenu to <strong>undo</strong> or <strong>redo</strong> recent actions as needed.
        </ListItem>
        <ListItem>
          Seamlessly switch between <strong>2D</strong> and <strong>3D</strong> views for different visual perspectives of your pattern.
        </ListItem>
        <ListItem>
          Access the graphical visualization mode to better understand stitch connections and overall layout.
        </ListItem>
        <ListItem>
          Click the <strong>Download</strong> icon on the canvas to export your pattern as an image file.
        </ListItem>
        <ListItem>
          Use the zoom controls to magnify or minimize your view for detailed adjustments.
        </ListItem>
        <ListItem>
          Expand the canvas area by clicking the <strong>Expand</strong> icon for a larger working space.
        </ListItem>
        <ListItem>
          That’s it! You’re now ready to create and customize your own crochet designs with ease.
        </ListItem>
      </InstructionList>
    </Container>
  );
}
