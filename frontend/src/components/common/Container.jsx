import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ fluid, theme }) => fluid ? '0' : theme.space[4]};
  padding-right: ${({ fluid, theme }) => fluid ? '0' : theme.space[4]};
  max-width: ${({ size, fluid }) => {
    if (fluid) return '100%';
    
    switch (size) {
      case 'sm':
        return '640px';
      case 'md':
        return '768px';
      case 'lg':
        return '1024px';
      case 'xl':
        return '1280px';
      case '2xl':
        return '1536px';
      default:
        return '1280px';
    }
  }};
`;

const Container = ({
  children,
  size = 'xl',
  fluid = false,
  ...props
}) => {
  return (
    <StyledContainer
      size={size}
      fluid={fluid}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

export default Container; 