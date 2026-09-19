import styled from "styled-components";

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
    description: "Step-by-step beginner guide with photos and simple instructions.",
  },
  {
    title: "Reading Crochet Charts: A Helpful Beginners Guide",
    link: "https://joyofmotioncrochet.com/reading-crochet-charts/",
    description: "Understand how to read crochet charts and symbols easily.",
  },
  {
    title: "Easy Crochet Stitch Pattern",
    link: "https://www.creativecrochetcorner.com/post/easy-crochet-stitch-pattern",
    description: "Simple patterns for beginners to practice and master stitches.",
  },
];

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
`;

const Heading = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Section = styled.div`
  max-width: 1100px;
  margin: 0 auto 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #4a5568;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const VideoCard = styled.a`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: auto;
`;

const VideoTitle = styled.div`
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 1rem;
  color: #2d3748;
`;

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ArticleCard = styled.a`
  display: block;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  color: #2d3748;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
  }

  p {
    font-size: 0.925rem;
    color: #4a5568;
  }
`;

export default function OtherResourcesComponent() {
  return (
    <Container>
      <Heading>Other Learning Resources</Heading>

      <Section>
        <SectionTitle>Helpful Video Tutorials</SectionTitle>
        <VideoGrid>
          {videos.map((video, idx) => (
            <VideoCard key={idx} href={video.url} target="_blank" rel="noopener noreferrer">
              <Thumbnail src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} alt={video.title} />
              <VideoTitle>{video.title}</VideoTitle>
            </VideoCard>
          ))}
        </VideoGrid>
      </Section>

      <Section>
        <SectionTitle>Recommended Articles</SectionTitle>
        <ArticleGrid>
            {articles.map((article, idx) => (
                <ArticleCard key={idx} href={article.link} target="_blank" rel="noopener noreferrer">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                </ArticleCard>
            ))}
            </ArticleGrid>

      </Section>
    </Container>
  );
}
