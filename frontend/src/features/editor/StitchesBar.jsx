import styled from "styled-components";

import SlipStitch from "../../assets/slip.svg?react";
import ChainStitch from "../../assets/chain.svg?react";
import SingleCrochet from "../../assets/singleCrochet.svg?react";
import DoubleCrochet from "../../assets/double.svg?react";
import HalfDoubleCrochet from "../../assets/halfDouble.svg?react";
import TrebleCrochet from "../../assets/treble.svg?react";

import { useDispatch, useSelector } from "react-redux";
import { selectStitch } from "./editorSlice";
import { colors } from "../../ui/theme";

const STITCHES = [
  { id: "ch", label: "Chain", Icon: ChainStitch },
  { id: "slip", label: "Slip stitch", Icon: SlipStitch },
  { id: "sc", label: "Single crochet", Icon: SingleCrochet },
  { id: "hdc", label: "Half double crochet", Icon: HalfDoubleCrochet },
  { id: "dc", label: "Double crochet", Icon: DoubleCrochet },
  { id: "tr", label: "Treble crochet", Icon: TrebleCrochet },
];

/* A stitched panel holding the symbols */
const Palette = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: flex-start;
  box-sizing: border-box;
  max-height: 75vh;
  margin: 10px 0 0 20px;
  padding: 10px;
  overflow-y: auto;
  border: 2px dashed ${colors.stitchLine};
  border-radius: 16px;
  background: ${colors.surface};
`;

const StitchButton = styled.button`
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  padding: 0;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  background: ${({ $selected }) => ($selected ? colors.yarn : colors.surface)};
  box-shadow: ${({ $selected }) =>
    $selected ? `0 3px 0 ${colors.ink}` : "none"};
  color: ${colors.ink};
  cursor: pointer;

  /* dashed seam on the selected stitch, like the patch button */
  &::after {
    content: "";
    position: absolute;
    inset: 3px;
    border: 2px dashed rgba(22, 48, 32, 0.5);
    border-radius: 7px;
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
    pointer-events: none;
  }

  &:hover {
    background: ${({ $selected }) =>
      $selected ? colors.yarn : "rgba(22, 48, 32, 0.08)"};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  svg {
    width: 36px;
    height: 36px;
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
    } else {
      dispatch(selectStitch({ stitch: null }));
    }
  };

  return (
    <Palette role="toolbar" aria-label="Stitches" aria-orientation="vertical">
      {STITCHES.map(({ id, label, Icon }) => (
        <StitchButton
          key={id}
          type="button"
          $selected={selectedStitch === id}
          aria-pressed={selectedStitch === id}
          aria-label={label}
          title={label}
          onClick={() => handleSelect(id)}
        >
          <Icon />
        </StitchButton>
      ))}
    </Palette>
  );
}