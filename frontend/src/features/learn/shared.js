import styled from "styled-components";
import { colors } from "../../ui/theme";

export { patchButton } from "../../ui/theme";

export const Heading = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(2.4rem, 5.5vw, 4.25rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-variation-settings: "opsz" 96;
  text-wrap: balance;
`;

export const Lede = styled.p`
  margin: 0 0 48px;
  max-width: 46ch;
  font-size: 1.15rem;
  line-height: 1.5;
  color: ${colors.muted};
`;

export const SectionTitle = styled.h2`
  margin: 0 0 20px;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
`;