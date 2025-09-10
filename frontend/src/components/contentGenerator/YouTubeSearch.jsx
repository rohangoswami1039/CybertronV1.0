import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlay, FaClock, FaEye } from 'react-icons/fa';
import Input from '../common/Input';
import Button from '../common/Button';
import { dummyVideos } from '../../utils/dummyData';
import Spinner from '../common/Spinner';
import { EmptyState } from '../imageGenerator/EmptyState';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  width: 100%;
  background-color: #fff;
  
  @media (min-width: 768px) {
    padding: 16px;
    gap: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  color: #111827;
  text-align: center;
  font-weight: 600;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 20px;
  }
  
  @media (min-width: 1024px) {
    font-size: 22px;
  }
`;

const SearchForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  
  @media (min-width: 640px) {
    gap: 12px;
  }
`;

const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 0.75rem;
  width: 100%;
  gap: 0.5rem;
  
  @media (min-width: 640px) {
    padding: 1rem;
    gap: 0.75rem;
    border-radius: 20px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
  
  &::placeholder {
    color: #999;
    font-size: 13px;
  }
  
  @media (min-width: 640px) {
    font-size: 15px;
    
    &::placeholder {
      font-size: 14px;
    }
  }
  
  @media (min-width: 1024px) {
    font-size: 16px;
    
    &::placeholder {
      font-size: 15px;
    }
  }
`;

const VideoResults = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;

const VideoList = styled.div`
  display: grid;
  gap: 12px;
  padding: 8px 4px;
  grid-template-columns: 1fr;
  
  @media (min-width: 640px) {
    gap: 14px;
    padding: 12px 6px;
  }
  
  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px 8px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    padding: 16px 8px;
  }
  
  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
`;

const VideoCard = styled.div`
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.selected ? '#000' : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  
  @media (min-width: 768px) {
    border-radius: 10px;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
  }
`;

const VideoThumbnail = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  background: ${props => props.bgGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  
  @media (min-width: 640px) {
    font-size: 24px;
  }
  
  @media (min-width: 1024px) {
    font-size: 28px;
  }
`;

const PlayIcon = styled(FaPlay)`
  background: rgba(0, 0, 0, 0.7);
  padding: 8px;
  border-radius: 50%;
  
  @media (min-width: 640px) {
    padding: 10px;
  }
  
  @media (min-width: 1024px) {
    padding: 12px;
  }
`;

const ThumbnailOverlay = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  
  @media (min-width: 640px) {
    top: 8px;
    right: 8px;
    gap: 4px;
  }
`;

const OverlayBadge = styled.div`
  background: ${props => props.bg || 'rgba(0, 0, 0, 0.7)'};
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    padding: 3px 7px;
    font-size: 11px;
    border-radius: 4px;
  }
  
  @media (min-width: 1024px) {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

const VideoInfo = styled.div`
  padding: 8px;
  
  @media (min-width: 640px) {
    padding: 10px;
  }
  
  @media (min-width: 1024px) {
    padding: 12px;
  }
`;

const VideoTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 30px;
  
  @media (min-width: 640px) {
    font-size: 13px;
    height: 32px;
    margin-bottom: 5px;
  }
  
  @media (min-width: 1024px) {
    font-size: 14px;
    height: 36px;
    margin-bottom: 6px;
  }
`;

const VideoChannel = styled.p`
  font-size: 10px;
  color: #666;
  margin: 0 0 4px 0;
  
  @media (min-width: 640px) {
    font-size: 11px;
    margin-bottom: 5px;
  }
  
  @media (min-width: 1024px) {
    font-size: 12px;
    margin-bottom: 6px;
  }
`;

const VideoStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  color: #666;
  
  @media (min-width: 640px) {
    font-size: 10px;
    gap: 10px;
  }
  
  @media (min-width: 1024px) {
    font-size: 11px;
    gap: 12px;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  
  @media (min-width: 640px) {
    gap: 3px;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 12px;
  margin: 4px 0 0 0;
  text-align: center;
  
  @media (min-width: 640px) {
    font-size: 13px;
    margin-top: 6px;
  }
  
  @media (min-width: 1024px) {
    font-size: 14px;
    margin-top: 8px;
  }
`;

const BottomButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
  
  @media (min-width: 640px) {
    gap: 12px;
  }
  
  @media (min-width: 1024px) {
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchButton = styled(Button)`
  width: fit-content;
  min-width: 80px;
  margin-top: 0;
  padding: 0.75rem 1rem;
  font-size: 13px;
  
  @media (min-width: 640px) {
    min-width: 100px;
    padding: 0.75rem 1.25rem;
    font-size: 14px;
  }
  
  @media (min-width: 1024px) {
    min-width: 120px;
    padding: 0.75rem 1.5rem;
    font-size: 15px;
  }
`;

const BottomButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 12px;
  border: none;
  min-width: 80px;
  
  @media (min-width: 640px) {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 100px;
    border-radius: 7px;
  }
  
  @media (min-width: 1024px) {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 120px;
    border-radius: 8px;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (min-width: 1024px) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`;

const ScriptButton = styled(BottomButton)`
  background-color: #000;
  color: #fff;
  
  &:hover:not(:disabled) {
    background-color: #333;
  }
`;

const NextButton = styled(BottomButton)`
  background-color: #000;
  color: #fff;
  
  &:hover:not(:disabled) {
    background-color: #333;
  }
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  
  @media (min-width: 640px) {
    font-size: 16px;
  }
  
  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const YouTubeSearch = ({ onVideoSelect, onHavePrompt }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const validateYoutubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

  const handleSubmit = async () => {
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL or search term');
      return;
    }

    setError('');
    setIsSearching(true);

    // Simulate API call delay
    setTimeout(() => {
      setShowResults(true);
      setIsSearching(false);
    }, 1000);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleNext = () => {
    if (selectedVideo) {
      onVideoSelect(`https://youtube.com/watch?v=${selectedVideo.id}`);
    }
  };

  return (
    <Container>
      <SearchForm>
        <Title>Search Topic</Title>
        <InputGroup>
          <SearchBarRow>
            <SearchInput
              type="search"
              placeholder="Search YouTube video"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <SearchIconWrapper>
              <FaSearch />
            </SearchIconWrapper>
          </SearchBarRow>
          <SearchButton onClick={handleSubmit} disabled={!youtubeUrl.trim() || isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </SearchButton>
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SearchForm>

      {isSearching ? <Spinner size="lg" /> : showResults ? (
        <VideoResults>
          <VideoList>
            {dummyVideos.map((video) => (
              <VideoCard
                key={video.id}
                selected={selectedVideo?.id === video.id}
                onClick={() => handleVideoSelect(video)}
              >
                <VideoThumbnail bgGradient={video.bgGradient}>
                  <PlayIcon />
                  <ThumbnailOverlay>
                    <OverlayBadge bg="rgba(0, 0, 0, 0.7)">{video.views}</OverlayBadge>
                    <OverlayBadge bg="#10b981">{video.percentage}</OverlayBadge>
                  </ThumbnailOverlay>
                </VideoThumbnail>
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoChannel>{video.channel}</VideoChannel>
                  <VideoStats>
                    <StatItem>
                      <FaEye />
                      <span>{video.views} views</span>
                    </StatItem>
                    <StatItem>
                      <FaClock />
                      <span>{video.duration}</span>
                    </StatItem>
                  </VideoStats>
                </VideoInfo>
              </VideoCard>
            ))}
          </VideoList>
        </VideoResults>
      ) :
        <EmptyState
          title="Find Video for Reference"
          description="Search for a YouTube video to use as reference for your content"
        />}

      <BottomButtonContainer>
        <ScriptButton onClick={onHavePrompt}>
          I have Script & Prompt
        </ScriptButton>
        <NextButton onClick={handleNext} disabled={!selectedVideo}>
          Next
        </NextButton>
      </BottomButtonContainer>
    </Container>
  );
};

export default YouTubeSearch;