import React from 'react';
import styled, { css } from 'styled-components';

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme, variant }) => 
    variant === 'rounded' ? theme.radii['2xl'] : theme.radii.lg};
  box-shadow: ${({ theme, elevation }) => 
    elevation === 'none' ? 'none' :
    elevation === 'sm' ? theme.shadows.sm :
    elevation === 'md' ? theme.shadows.md :
    elevation === 'lg' ? theme.shadows.lg :
    theme.shadows.base};
  overflow: hidden;
  
  ${({ bordered, theme }) => bordered && css`
    border: 1px solid ${theme.colors.mediumGray};
  `}
  
  ${({ hoverable, theme }) => hoverable && css`
    transition: transform ${theme.transitions.duration.fast} ${theme.transitions.easing.easeInOut},
                box-shadow ${theme.transitions.duration.fast} ${theme.transitions.easing.easeInOut};
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg};
    }
  `}
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[5]}`};
  border-bottom: ${({ divider, theme }) => divider ? `1px solid ${theme.colors.mediumGray}` : 'none'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardBody = styled.div`
  padding: ${({ theme, padding }) => 
    padding === 'none' ? '0' :
    padding === 'sm' ? `${theme.space[3]} ${theme.space[4]}` :
    padding === 'lg' ? `${theme.space[6]} ${theme.space[7]}` :
    `${theme.space[5]} ${theme.space[5]}`};
`;

const CardFooter = styled.div`
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[5]}`};
  border-top: ${({ divider, theme }) => divider ? `1px solid ${theme.colors.mediumGray}` : 'none'};
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => 
    align === 'left' ? 'flex-start' :
    align === 'center' ? 'center' :
    align === 'right' ? 'flex-end' :
    align === 'stretch' ? 'stretch' :
    'space-between'};
  gap: ${({ theme }) => theme.space[3]};
`;

const Card = ({
  children,
  variant = 'default',
  elevation = 'base',
  bordered = false,
  hoverable = false,
  ...props
}) => {
  return (
    <StyledCard
      variant={variant}
      elevation={elevation}
      bordered={bordered}
      hoverable={hoverable}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card; 
 