import React from 'react';
import styled from 'styled-components';
import { FaImage, FaLightbulb, FaYoutube, FaMagic } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 16px;
  color: #111827;
`;

const Description = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
  max-width: 600px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  width: 100%;
  margin-top: 16px;
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const IconContainer = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
  color: #000;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f9f9f9;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
  color: #111827;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
`;

const ImprovedEmptyState = () => {
  return (
    <Container>
      <Title>Create Stunning Thumbnails</Title>
      <Description>
        Generate eye-catching YouTube thumbnails with AI. Use the sidebar to customize your settings and start creating.
      </Description>
    </Container>
  );
};

export default ImprovedEmptyState; 