import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerCircle = styled.div`
  width: ${({ size }) => 
    size === 'xs' ? '1rem' :
    size === 'sm' ? '1.5rem' :
    size === 'lg' ? '3rem' :
    size === 'xl' ? '4rem' :
    '2rem'};
  height: ${({ size }) => 
    size === 'xs' ? '1rem' :
    size === 'sm' ? '1.5rem' :
    size === 'lg' ? '3rem' :
    size === 'xl' ? '4rem' :
    '2rem'};
  border: ${({ size }) => 
    size === 'xs' ? '2px' :
    size === 'sm' ? '2px' :
    size === 'lg' ? '4px' :
    size === 'xl' ? '5px' :
    '3px'} solid rgba(0, 0, 0, 0.1);
  border-top-color: ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Spinner = ({
  size = 'md',
  color,
  ...props
}) => {
  return (
    <SpinnerContainer {...props}>
      <SpinnerCircle size={size} color={color} />
    </SpinnerContainer>
  );
};

export default Spinner; 