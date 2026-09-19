import styled from "styled-components";
import { Heading, Lede } from "./shared";
import { colors } from "../../ui/theme";

import ch from "../../assets/chain.svg";
import sl from "../../assets/slip.svg";
import sc from "../../assets/singleCrochet.svg";
import hdc from "../../assets/halfDouble.svg";
import dc from "../../assets/double.svg";
import tr from "../../assets/treble.svg";
import mr from "../../assets/magicRing.svg";

const stitches = [
  {
    name: "Magic Ring",
    abbrev: "mr",
    icon: mr,
    description:
      "An adjustable loop technique for starting circular projects with no center hole. Allows you to tighten the center completely closed.",
  },
  {
    name: "Chain Stitch",
    abbrev: "ch",
    icon: ch,
    description:
      "The foundation of most crochet projects. Creates a series of interconnected loops that form the starting chain for rows and rounds.",
  },
  {
    name: "Slip Stitch",
    abbrev: "sl st",
    icon: sl,
    description:
      "The shortest stitch used for joining, moving across stitches without adding height, and creating smooth edges in circular projects.",
  },
  {
    name: "Single Crochet",
    abbrev: "sc",
    icon: sc,
    description:
      "A basic, tight stitch that creates dense fabric. Insert hook, yarn over, pull through, yarn over again and pull through both loops.",
  },
  {
    name: "Half Double Crochet",
    abbrev: "hdc",
    icon: hdc,
    description:
      "Medium-height stitch between single and double crochet. Yarn over first, then insert hook and work through in one fluid motion.",
  },
  {
    name: "Double Crochet",
    abbrev: "dc",
    icon: dc,
    description:
      "A tall, versatile stitch that works up quickly. Yarn over, insert hook, pull through, then work off loops two at a time.",
  },
  {
    name: "Treble Crochet",
    abbrev: "tr",
    icon: tr,
    description:
      "The tallest basic stitch, creating an open, lacy fabric. Yarn over twice before inserting hook, then work off loops systematically.",
  },
];

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 72px minmax(0, 3fr) minmax(0, 5fr);
  gap: 12px 32px;
  align-items: center;
  padding: 24px 0;
  border-top: 2px dashed ${colors.stitchLine};

  &:last-child {
    border-bottom: 2px dashed ${colors.stitchLine};
  }

  @media (max-width: 860px) {
    grid-template-columns: 72px minmax(0, 1fr);

    p {
      grid-column: 1 / -1;
    }
  }
`;

const SymbolBox = styled.div`
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  box-sizing: border-box;
  border: 2px solid ${colors.ink};
  border-radius: 10px;
  background-color: ${colors.surface};
  background-image: linear-gradient(${colors.grid} 1px, transparent 1px),
    linear-gradient(90deg, ${colors.grid} 1px, transparent 1px);
  background-size: 12px 12px;

  img {
    width: 44px;
    height: 44px;
    object-fit: contain;
  }
`;

const Name = styled.h2`
  margin: 0 0 8px;
  font-size: clamp(1.3rem, 2.2vw, 1.75rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
`;

const Abbrev = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 8px;
  background: ${colors.ink};
  color: ${colors.paper};
  font-size: 0.9rem;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.55;
  color: ${colors.muted};
`;

export default function CrochetBasicsComponent() {
  return (
    <>
      <Heading>Crochet basics</Heading>
      <Lede>The stitches you’ll meet in almost every pattern and chart.</Lede>
      <List>
        {stitches.map((stitch) => (
          <Row key={stitch.abbrev}>
            <SymbolBox>
              <img src={stitch.icon} alt={`${stitch.name} chart symbol`} />
            </SymbolBox>
            <div>
              <Name>{stitch.name}</Name>
              <Abbrev>{stitch.abbrev}</Abbrev>
            </div>
            <Description>{stitch.description}</Description>
          </Row>
        ))}
      </List>
    </>
  );
}