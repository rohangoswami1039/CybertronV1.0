import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 100%;
  max-width: 250px;
  background: #000;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 0.5rem;

  &:hover{
    transform: scale(1.01);
    transition: transform 0.2s ease-in-out;
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText = 'Loading...',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="loading-spinner"></span>
          {loadingText}
        </>
      ) : (
        <>
          {leftIcon && <span className="button-icon left">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="button-icon right">{rightIcon}</span>}
        </>
      )}
    </StyledButton>
  );
};

export default Button; 