import React from 'react';
import styled from 'styled-components';
import { FaVolumeUp, FaDownload, FaPlay, FaPause } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const AudioContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;

const AudioCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const AudioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const AudioTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

const AudioActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover {
    color: #000;
  }
`;

const AudioPlayer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #000;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #333;
    transform: scale(1.05);
  }
`;

const ProgressContainer = styled.div`
  flex: 1;
`;

const ProgressBar = styled.div`
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  position: relative;
  margin-bottom: 8px;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 35%;
    background-color: #000;
    border-radius: 2px;
  }
`;

const TimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
`;

const BottomControls = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 16px 0 0;
  margin-top: 24px;
`;

const ControlsContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PrimaryButton = styled.button`
  background-color: #000;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #333;
  }
`;

const GenerateAudio = ({ onNext }) => {
  return (
    <Container>
      <Header>
        <Title>Generated Audio</Title>
      </Header>
      
      <AudioContainer>
        <AudioCard>
          <AudioHeader>
            <AudioTitle>Script Audio</AudioTitle>
            <AudioActions>
              <ActionButton title="Download">
                <FaDownload />
              </ActionButton>
            </AudioActions>
          </AudioHeader>
          
          <AudioPlayer>
            <PlayButton>
              <FaPlay />
            </PlayButton>
            <ProgressContainer>
              <ProgressBar />
              <TimeInfo>
                <span>1:23</span>
                <span>3:45</span>
              </TimeInfo>
            </ProgressContainer>
          </AudioPlayer>
        </AudioCard>
      </AudioContainer>
      
      <BottomControls>
        <ControlsContent>
          <PrimaryButton>
            Regenerate Audio
          </PrimaryButton>
          <PrimaryButton onClick={onNext}>
            Next
          </PrimaryButton>
        </ControlsContent>
      </BottomControls>
    </Container>
  );
};

export default GenerateAudio; 