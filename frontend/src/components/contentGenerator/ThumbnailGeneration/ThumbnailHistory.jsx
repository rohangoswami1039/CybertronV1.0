import React from 'react';
import styled from 'styled-components';
import { historyItems } from '../../../utils/ImageGeneratorSettings';
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

const ItemPreview = styled.div`
  width: 100%;
  height: 80px;
  background-color: #f0f0f0;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 4px;
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 24px;
  color: #666;
  font-style: italic;
`;

const ThumbnailHistory = ({ onSelectHistoryItem, activeItemId }) => {
  // Format dates for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  const handleHistoryItemClick = (item) => {
    if (onSelectHistoryItem) {
      onSelectHistoryItem(item);
    }
  };
  
  return (
    <Container>
      <Title>Thumbnail History</Title>
      
      {historyItems.length > 0 ? (
        <HistoryList>
          {historyItems.map(item => (
            <HistoryItem 
              key={item.id} 
              onClick={() => handleHistoryItemClick(item)}
              style={{
                backgroundColor: activeItemId === item.id ? '#f0f0f0' : 'transparent'
              }}
            >
              <ItemTitle>{item.prompt.substring(0, 30)}{item.prompt.length > 30 ? '...' : ''}</ItemTitle>
              <ItemDetails>
                <span>{formatDate(item.date)}</span>
                <span>{item.imageCount || 4} images</span>
              </ItemDetails>
              {item.images && item.images[0] && (
                <ItemPreview imageUrl={item.images[0]} />
              )}
            </HistoryItem>
          ))}
        </HistoryList>
      ) : (
        <EmptyHistory>No thumbnail history found</EmptyHistory>
      )}
    </Container>
  );
};

export default ThumbnailHistory; 