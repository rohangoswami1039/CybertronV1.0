import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
`;

const LoaderTitle = styled.h3`
  font-size: 14px;
  margin-bottom: 24px;
  color: #111827;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: #fff;
  border: 1px solid #000;
  margin-bottom: 16px;
  padding: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #000;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const StatusText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin-top: 8px;
  text-align: center;
`;

const ProgressLoader = ({ 
  title = "Working on it...", 
  initialProgress = 0,
  isComplete = false,
  onComplete,
  showDelayMessage = true,
  delayThreshold = 5000 // 5 seconds
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const [showDelay, setShowDelay] = useState(false);

  useEffect(() => {
    // Initial quick progress to 33%
    let timer;
    if (progress < 33) {
      timer = setTimeout(() => {
        setProgress(33);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show delay message after threshold
    let delayTimer;
    if (showDelayMessage && progress >= 33 && progress < 90) {
      delayTimer = setTimeout(() => {
        setShowDelay(true);
      }, delayThreshold);
    }

    return () => clearTimeout(delayTimer);
  }, [progress, showDelayMessage, delayThreshold]);

  useEffect(() => {
    // When isComplete is true, animate to 100%
    let completeTimer;
    if (isComplete && progress < 100) {
      setProgress(90);
      
      completeTimer = setTimeout(() => {
        setProgress(100);
        
        // Call onComplete after a short delay to show 100%
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }, 1000);
    }

    return () => clearTimeout(completeTimer);
  }, [isComplete, progress, onComplete]);

  return (
    <LoaderContainer>
      <StatusText>{progress} %</StatusText>
      <ProgressBarContainer>
        <ProgressBar progress={progress} />
      </ProgressBarContainer>
      <LoaderTitle>{title}</LoaderTitle>
      {showDelay && progress < 90 && (
        <StatusText>This is taking longer than expected. Please wait...</StatusText>
      )}
    </LoaderContainer>
  );
};

export default ProgressLoader; 