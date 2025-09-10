import React from 'react';
import styled from 'styled-components';
import Spinner from '../common/Spinner';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 16px;
  color: #000;
  text-align: center;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  max-width: 600px;
`;

export const LoadingView = ({ message = "Generating your images... Please wait." }) => {
  return (
    <LoadingContainer>
      <Spinner size="lg" />
      <p>{message}</p>
    </LoadingContainer>
  );
};

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  gap: 16px;
`;

export const EmptyState = ({ 
  title = "Create Stunning Images", 
  description = "Enter a prompt and generate images to see results here" 
}) => {
  return (
    <EmptyStateContainer>
      <Title>{title}</Title>
      <Description>
        {description}
      </Description>
    </EmptyStateContainer>
  );
};