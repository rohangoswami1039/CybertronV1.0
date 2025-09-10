import React from 'react';
import styled from 'styled-components';
import { scriptHistory } from '../../utils/scriptGeneratorData';
import { formatDistanceToNow } from 'date-fns';

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HistoryItem = styled.div`
  background: ${props => props.active ? '#f0f0f0' : 'transparent'};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const Title = styled.h3`
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
`;

const Type = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const Snippet = styled.p`
  margin: 0;
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const DateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
  margin-top: 8px;
`;

const NoHistory = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
`;

const ScriptHistory = ({ onSelectScript, activeScriptId }) => {
  // Format dates for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  return (
    <HistoryContainer>
      {scriptHistory.length > 0 ? (
        scriptHistory.map(script => (
          <HistoryItem 
            key={script.id} 
            onClick={() => onSelectScript(script.id)}
            active={activeScriptId === script.id}
          >
            <Title>{script.title}</Title>
            <Type>{script.type}</Type>
            <Snippet>{script.snippet}</Snippet>
            <DateInfo>
              <span>Created: {formatDate(script.dateCreated)}</span>
              <span>Edited: {formatDate(script.lastEdited)}</span>
            </DateInfo>
          </HistoryItem>
        ))
      ) : (
        <NoHistory>No script history found</NoHistory>
      )}
    </HistoryContainer>
  );
};

export default ScriptHistory; 