import React from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 24px 16px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
  color: #111827;

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;

  &:hover {
    border: 1px solid #000;
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #000;
  color: white;
  border: none;

  &:hover {
    background-color: #333;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: #000;
  border: 1px solid #000;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #333;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CloneModelModal = ({ onClose, onProceed }) => {
  return (
    <ModalContainer>
      <ModalTitle>Do you want to clone your face model?</ModalTitle>
      <Paragraph>
        Creating your own face model will allow you to generate personalized thumbnails with your likeness.
      </Paragraph>

      <ButtonContainer>
        <PrimaryButton onClick={onProceed}>Yes, let's do it</PrimaryButton>
        <SecondaryButton onClick={onClose}>I'll do it later</SecondaryButton>
      </ButtonContainer>
    </ModalContainer>
  );
};

export default CloneModelModal;
