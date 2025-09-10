import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
`;

const IconContainer = styled.div`
  font-size: 64px;
  color: #10b981;
  margin-bottom: 24px;
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Title = styled.h3`
  font-size: 24px;
  margin-bottom: 16px;
  color: #111827;
`;

const Message = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
  max-width: 400px;
`;

const SuccessMessage = ({ title, message, autoDismiss = true, dismissTime = 3000, onDismiss }) => {
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, dismissTime);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime, onDismiss]);

  return (
    <SuccessContainer>
      <IconContainer>
        <FaCheckCircle />
      </IconContainer>
      <Title>{title || 'Model Generation Successful!'}</Title>
      <Message>
        {message || 'Your face model has been successfully created and is now available for use in thumbnail generation.'}
      </Message>
    </SuccessContainer>
  );
};

export default SuccessMessage; 