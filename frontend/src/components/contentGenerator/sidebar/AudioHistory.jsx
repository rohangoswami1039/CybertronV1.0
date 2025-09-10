import React from 'react';
import styled from 'styled-components';
import { audioGenerationHistory } from '../../../utils/audioGeneratedData';
import { formatDistanceToNow } from 'date-fns';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  padding: 12px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }
`;

const ItemTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const ItemDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const ScriptPreview = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 24px;
  color: #666;
  font-style: italic;
`;

const AudioHistory = ({ onSelectAudio, activeAudioId }) => {
  // Format dates for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  const handleAudioSelect = (audioId) => {
    if (onSelectAudio) {
      const selectedAudio = audioGenerationHistory.find(audio => audio.id === audioId);
      onSelectAudio(selectedAudio);
    }
  };
  
  return (
    <Container>
      <Title>Audio History</Title>
      
      {audioGenerationHistory.length > 0 ? (
        <HistoryList>
          {audioGenerationHistory.map(audio => (
            <HistoryItem 
              key={audio.id} 
              onClick={() => handleAudioSelect(audio.id)}
              active={activeAudioId === audio.id}
            >
              <ItemTitle>{audio.title}</ItemTitle>
              <ItemDetails>
                <span>Duration: {audio.duration}</span>
                <span>{formatDate(audio.dateCreated)}</span>
              </ItemDetails>
              <ScriptPreview>{audio.scriptPreview}</ScriptPreview>
            </HistoryItem>
          ))}
        </HistoryList>
      ) : (
        <EmptyHistory>No audio history found</EmptyHistory>
      )}
    </Container>
  );
};

export default AudioHistory; 