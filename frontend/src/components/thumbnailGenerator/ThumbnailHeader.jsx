import React from 'react';
import styled from 'styled-components';
import { FaUserPlus, FaCog } from 'react-icons/fa';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  background-color: transparent;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: white;
  color: #000;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border: 1px solid #000;
    background-color: #f5f5f5;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ThumbnailHeader = ({ onCloneModelClick, onModelSettingsClick }) => {
  return (
    <HeaderContainer>
      <ActionButton onClick={onCloneModelClick}>
        <FaUserPlus />
        Clone Model
      </ActionButton>
      <ActionButton onClick={onModelSettingsClick}>
        <FaCog />
        Model Settings
      </ActionButton>
    </HeaderContainer>
  );
};

export default ThumbnailHeader; 