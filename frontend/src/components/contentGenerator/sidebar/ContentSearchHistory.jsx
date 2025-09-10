import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
`;

const SocialMediaBar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f0f0f0;
  padding: 12px;
`;

const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#000' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#666'};
  
  &:hover {
    background-color: ${props => props.active ? '#000' : '#e0e0e0'};
  }
`;

const HistorySection = styled.div`
  flex: 1;
`;

const HistoryTitle = styled.h3`
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

const HistoryDate = styled.div`
  font-size: 12px;
  color: #666;
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 24px;
  color: #666;
  font-style: italic;
`;

const ContentSearchHistory = ({ onSelectHistoryItem, searchDummyData }) => {
  const [activePlatform, setActivePlatform] = useState('youtube');
  
  const handlePlatformChange = (platform) => {
    setActivePlatform(platform);
  };
  
  const handleHistoryItemClick = (item) => {
    if (onSelectHistoryItem) {
      onSelectHistoryItem(item);
    }
  };
  
  const renderHistory = () => {
    const historyItems = searchDummyData && searchDummyData[activePlatform] 
      ? searchDummyData[activePlatform] 
      : [];
    
    if (historyItems.length === 0) {
      return <EmptyHistory>No history found for this platform</EmptyHistory>;
    }
    
    return (
      <HistoryList>
        {historyItems.map(item => (
          <HistoryItem key={item.id} onClick={() => handleHistoryItemClick(item)}>
            <ItemTitle>{item.title}</ItemTitle>
            <HistoryDate>{new Date(item.date).toLocaleDateString()}</HistoryDate>
          </HistoryItem>
        ))}
      </HistoryList>
    );
  };
  
  return (
    <Container>
      <SocialMediaBar>
        <SocialIcon 
          active={activePlatform === 'facebook'} 
          onClick={() => handlePlatformChange('facebook')}
        >
          <FaFacebook size={20} />
        </SocialIcon>
        <SocialIcon 
          active={activePlatform === 'linkedin'} 
          onClick={() => handlePlatformChange('linkedin')}
        >
          <FaLinkedin size={20} />
        </SocialIcon>
        <SocialIcon 
          active={activePlatform === 'twitter'} 
          onClick={() => handlePlatformChange('twitter')}
        >
          <FaTwitter size={20} />
        </SocialIcon>
        <SocialIcon 
          active={activePlatform === 'youtube'} 
          onClick={() => handlePlatformChange('youtube')}
        >
          <FaYoutube size={20} />
        </SocialIcon>
        <SocialIcon 
          active={activePlatform === 'instagram'} 
          onClick={() => handlePlatformChange('instagram')}
        >
          <FaInstagram size={20} />
        </SocialIcon>
      </SocialMediaBar>
      
      <HistorySection>
        <HistoryTitle>Workspace History</HistoryTitle>
        {renderHistory()}
      </HistorySection>
    </Container>
  );
};

export default ContentSearchHistory; 