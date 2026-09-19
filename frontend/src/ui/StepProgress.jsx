// src/ui/StepProgress.jsx
// A short thread that fills in as the person moves through the register steps.

import styled from "styled-components";
import { colors } from "./theme";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: -8px;
`;

const Track = styled.div`
  display: flex;
  flex: 1;
  gap: 6px;
`;

// Finished and current steps are solid; upcoming ones are dashed stitches
const Segment = styled.span`
  flex: 1;
  height: 0;
  border-top: 4px ${({ $done }) => ($done ? "solid" : "dashed")}
    ${({ $done }) => ($done ? colors.leaf : colors.stitchLine)};
  border-radius: 2px;
`;

const Text = styled.span`
  color: ${colors.muted};
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
`;

export default function StepProgress({ step, total }) {
  return (
    <Wrap>
      <Track aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <Segment key={i} $done={i <= step} />
        ))}
      </Track>
      <Text>
        Step {step + 1} of {total}
      </Text>
    </Wrap>
  );
}