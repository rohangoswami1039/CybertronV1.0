import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${(mb) => mb};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ size }) =>
    size === 'small' ? '0.5rem 0.75rem' :
      size === 'large' ? '0.75rem 1rem' :
        '0.625rem 0.875rem'};
  font-size: 0.85rem;
  border-radius: 8px;
  border: 1px solid ${({ error }) => error ? '#e53e3e' : '#d1d5db'};
  background-color: #ffffff;
  color: #333333;
  transition: all 0.2s ease;
  
  ${({ leftIcon }) => leftIcon && css`
    padding-left: 2.5rem;
  `}
  
  ${({ rightIcon }) => rightIcon && css`
    padding-right: 2.5rem;
  `}
  
  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? '#e53e3e' : '#635bff'};
    box-shadow: 0 0 0 2px ${({ error }) => error ? 'rgba(229, 62, 62, 0.2)' : 'rgba(99, 91, 255, 0.2)'};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #333333;
  
  .required {
    color: #e53e3e;
    margin-left: 2px;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
  opacity: ${({ show }) => show ? 1 : 0};
  height: ${({ show }) => show ? 'auto' : '0'};
  overflow: hidden;
`;

const HelperText = styled.div`
  color: #6b7280;
  font-size: 0.65rem;
  margin-top: 0.25rem;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  
  &.left-icon {
    left: 0.75rem;
  }
  
  &.right-icon {
    right: 0.75rem;
  }
`;

const Input = forwardRef(({
  label,
  error,
  required = false,
  helperText,
  leftIcon,
  rightIcon,
  checks = true,
  size = 'medium',
  mb = "1rem",
  ...props
}, ref) => {
  return (
    <InputContainer mb={mb}>
      {label && (
        <Label htmlFor={props.id}>
          {label}
          {required && <span className="required">*</span>}
        </Label>
      )}

      {leftIcon && (
        <IconContainer className="left-icon">
          {leftIcon}
        </IconContainer>
      )}

      <StyledInput
        ref={ref}
        size={size}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        error={error}
        {...props}
      />

      {rightIcon && (
        <IconContainer className="right-icon">
          {rightIcon}
        </IconContainer>
      )}

      {helperText && !error && <HelperText>{helperText}</HelperText>}
      {checks && <ErrorMessage show={!!error}>{error || ''}</ErrorMessage>}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input; 