import styled from "styled-components";

import SlipStitch from "../../assets/slip.svg?react";
import ChainStitch from "../../assets/chain.svg?react";
import SingleCrochet from "../../assets/singleCrochet.svg?react";
import DoubleCrochet from "../../assets/double.svg?react";
import HalfDoubleCrochet from "../../assets/halfDouble.svg?react";
import TrebleCrochet from "../../assets/treble.svg?react";

import { useDispatch, useSelector } from "react-redux";
import { addStitch, selectStitch } from "./editorSlice";

const Stitchesbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
`;

const StitchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  background-color: ${(props) => (props.selected ? "var(--secondary-color)" : "var(--primary-color)")};
  width: fit-content;
  cursor: pointer;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const StitchSymbolWrapper = styled.div`
  width: 50px;
  height: 50px;
  color: ${(props) => props.color || "#171516"};

  & > svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 20;
  }
`;

export default function StitchesBar() {
  const dispatch = useDispatch();
  const selectedStitch = useSelector((state) => state.editor.selectedStitch);

  const handleSelect = (stitch) => {
    if (selectedStitch !== stitch) {
      dispatch(selectStitch({ stitch }));
    }
    else{
      dispatch(selectStitch({stitch:null}))
    }
  };

  return (
    <Stitchesbar>
      <StitchContainer selected={selectedStitch === "ch"}>
        <StitchSymbolWrapper onClick={() => handleSelect("ch")} color="black">
          <ChainStitch />
        </StitchSymbolWrapper>
      </StitchContainer>

      <StitchContainer selected={selectedStitch === "slip"}>
        <StitchSymbolWrapper onClick={() => handleSelect("slip")} color="black">
          <SlipStitch />
        </StitchSymbolWrapper>
      </StitchContainer>

      <StitchContainer selected={selectedStitch === "sc"}>
        <StitchSymbolWrapper onClick={() => handleSelect("sc")} color="black">
          <SingleCrochet />
        </StitchSymbolWrapper>
      </StitchContainer>

      <StitchContainer selected={selectedStitch === "hdc"}>
        <StitchSymbolWrapper onClick={() => handleSelect("hdc")} color="black">
          <HalfDoubleCrochet />
        </StitchSymbolWrapper>
      </StitchContainer>

      <StitchContainer selected={selectedStitch === "dc"}>
        <StitchSymbolWrapper onClick={() => handleSelect("dc")} color="black">
          <DoubleCrochet />
        </StitchSymbolWrapper>
      </StitchContainer>

      <StitchContainer selected={selectedStitch === "tr"}>
        <StitchSymbolWrapper onClick={() => handleSelect("tr")} color="black">
          <TrebleCrochet />
        </StitchSymbolWrapper>
      </StitchContainer>
    </Stitchesbar>
  );
}
