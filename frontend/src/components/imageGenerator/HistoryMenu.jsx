import React from 'react';
import styled from 'styled-components';

// ========================
// HISTORY COMPONENT
// ========================

const HistoryItem = styled.div`
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const HistoryPrompt = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HistoryDate = styled.div`
  font-size: 12px;
  color: #666;
`;

const HistoryMenu = ({ items = [], onItemClick }) => {
  return (
    <div>
      {items.map((item) => (
        <HistoryItem 
          key={item.id}
          onClick={() => onItemClick && onItemClick(item)}
        >
          <HistoryPrompt title={item.prompt}>{item.prompt}</HistoryPrompt>
          <HistoryDate>{item.date}</HistoryDate>
        </HistoryItem>
      ))}
    </div>
  );
};

export default HistoryMenu;