import styled from "styled-components";
import { Heading, Lede, SectionTitle } from "./shared";
import { colors } from "../../ui/theme";

const videos = [
  {
    title: "How to Crochet for Beginners",
    url: "https://youtu.be/aAxGTnVNJiE",
    videoId: "aAxGTnVNJiE",
  },
  {
    title: "How to read Crochet Charts and Symbols by Naztazia",
    url: "https://youtu.be/rRM5C7C2sFI",
    videoId: "rRM5C7C2sFI",
  },
  {
    title: "Crochet Symbol Charts Explained",
    url: "https://youtu.be/Zl64Ws8Ntc8",
    videoId: "Zl64Ws8Ntc8",
  },
];

const articles = [
  {
    title: "How to crochet for beginners",
    link: "https://sarahmaker.com/how-to-crochet/",
    description:
      "Step-by-step beginner guide with photos and simple instructions.",
  },
  {
    title: "Reading Crochet Charts: A Helpful Beginners Guide",
    link: "https://joyofmotioncrochet.com/reading-crochet-charts/",
    description: "Understand how to read crochet charts and symbols easily.",
  },
  {
    title: "Easy Crochet Stitch Pattern",
    link: "https://www.creativecrochetcorner.com/post/easy-crochet-stitch-pattern",
    description:
      "Simple patterns for beginners to practice and master stitches.",
  },
];

const wavyHover = `
  text-decoration: underline wavy ${colors.yarn};
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
`;

const Section = styled.section`
  margin-bottom: 64px;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px 24px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const VideoCard = styled.a`
  display: block;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 4px;
    border-radius: 6px;
  }

  &:hover span {
    ${wavyHover}
  }
`;

/* YouTube's hqdefault thumbnails have black bars; crop them to 16:9 */
const Thumbnail = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
`;

const VideoTitle = styled.span`
  display: inline-block;
  margin-top: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

const ArticleList = styled.div``;

const ArticleRow = styled.a`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: 8px 40px;
  padding: 24px 0;
  border-top: 2px dashed ${colors.stitchLine};
  color: inherit;
  text-decoration: none;

  &:last-child {
    border-bottom: 2px dashed ${colors.stitchLine};
  }

  h3 {
    margin: 0;
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    line-height: 1.5;
    color: ${colors.muted};
  }

  &:hover h3 {
    ${wavyHover}
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export default function OtherResourcesComponent() {
  return (
    <>
      <Heading>Other learning resources</Heading>
      <Lede>Videos and articles for learning to crochet and read charts.</Lede>

      <Section>
        <SectionTitle>Video tutorials</SectionTitle>
        <VideoGrid>
          {videos.map((video) => (
            <VideoCard
              key={video.videoId}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Thumbnail
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                alt=""
              />
              <VideoTitle>{video.title}</VideoTitle>
            </VideoCard>
          ))}
        </VideoGrid>
      </Section>

      <Section>
        <SectionTitle>Recommended articles</SectionTitle>
        <ArticleList>
          {articles.map((article) => (
            <ArticleRow
              key={article.link}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>{article.title}</h3>
              <p>{article.description}</p>
            </ArticleRow>
          ))}
        </ArticleList>
      </Section>
    </>
  );
}