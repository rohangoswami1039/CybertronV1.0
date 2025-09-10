import React from 'react';
import styled from 'styled-components';
import { FaCheck } from 'react-icons/fa';
import { MdDownload } from 'react-icons/md';

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  background: #f0f0f0;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.2s;
`;

const SelectImageButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${props => props.selected ? '#000' : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.selected ? 'white' : '#000'};
  border: 1px solid #000;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
`;

const DownloadButton = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #000;
  color: #fff;

  &:hover {
    background-color: #fff;
    color: #000;
  }
`;

const ImageGrid = ({ images, selectedImages, onSelectImage, onDownloadImage }) => {
  return (
    <ImagesGrid>
      {images.map((image) => (
        <ImageCard key={image.id} onClick={() => onSelectImage(image.id)}>
          <ImageContainer>
            <StyledImage src={image.url} alt={image.alt} />
              <SelectImageButton 
                selected={selectedImages.includes(image.id)}
                onClick={() => onSelectImage(image.id)}
              >
                {selectedImages.includes(image.id) && <FaCheck size={16} />}
              </SelectImageButton>
              <DownloadButton onClick={() => onDownloadImage(image.url)}>
                <MdDownload size={16}/>
              </DownloadButton>
          </ImageContainer>
        </ImageCard>
      ))}
    </ImagesGrid>
  );
};

export default ImageGrid;