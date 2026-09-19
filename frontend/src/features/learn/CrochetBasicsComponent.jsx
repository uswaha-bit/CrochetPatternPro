import styled from "styled-components";

// ✅ Import icons properly — adjust paths if needed
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

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  overflow-y: auto;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 1rem;
`;

const Info = styled.div``;

const Name = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const Abbrev = styled.span`
  font-size: 0.85rem;
  background-color: #edf2f7;
  color: #4a5568;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
`;

export default function CrochetBasicsComponent() {
  return (
    <Container>
      <Heading>Crochet Basics</Heading>
      <Grid>
        {stitches.map((stitch, index) => (
          <Card key={index}>
            <CardHeader>
              <Icon src={stitch.icon} alt={`${stitch.name} icon`} />
              <Info>
                <Name>{stitch.name}</Name>
                <Abbrev>{stitch.abbrev}</Abbrev>
              </Info>
            </CardHeader>
            <Description>{stitch.description}</Description>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
