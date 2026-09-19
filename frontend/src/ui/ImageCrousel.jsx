import React, { useState } from "react";
import styled from "styled-components";

// Styled Components
const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CrochetImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
  object-position: center;
`;
const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-50%) scale(1.1);
  }

  ${(props) =>
    props.direction === "prev" &&
    `
    left: 10px;
  `}

  ${(props) =>
    props.direction === "next" &&
    `
    right: 10px;
  `}

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 16px;

    ${(props) =>
      props.direction === "prev" &&
      `
      left: 5px;
    `}

    ${(props) =>
      props.direction === "next" &&
      `
      right: 5px;
    `}
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 2;
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${(props) => (props.active ? "#007bff" : "#ccc")};
  cursor: pointer;
  transition: all 0.3s ease;
  transform: ${(props) => (props.active ? "scale(1.2)" : "scale(1)")};

  &:hover {
    background: ${(props) => (props.active ? "#007bff" : "#666")};
  }
`;

const ImageCarousel = ({ images, alt = "Post image" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  // Single image - no carousel needed
  if (images.length === 1) {
    return (
      <CrochetImage
        src={images[0].url}
        alt={alt}
        key={images[0]._id}
        style={{
          objectFit: "cover", // This prevents cropping and fits the image
          objectPosition: "center",
        }}
      />
    );
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <CarouselWrapper>
      {/* Main image display */}
      <CarouselContainer>
        <CrochetImage
          src={images[currentIndex].url}
          alt={`${alt} ${currentIndex + 1}`}
          key={images[currentIndex]._id}
        />

        {/* Navigation arrows */}
        <CarouselButton
          direction="prev"
          onClick={prevImage}
          aria-label="Previous image"
        >
          &#8249;
        </CarouselButton>
        <CarouselButton
          direction="next"
          onClick={nextImage}
          aria-label="Next image"
        >
          &#8250;
        </CarouselButton>

        {/* Image counter */}
        <ImageCounter>
          {currentIndex + 1} / {images.length}
        </ImageCounter>
      </CarouselContainer>

      {/* Thumbnail dots */}
      <DotsContainer>
        {images.map((_, index) => (
          <Dot
            key={index}
            active={index === currentIndex}
            onClick={() => goToImage(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </DotsContainer>
    </CarouselWrapper>
  );
};

export default ImageCarousel;
