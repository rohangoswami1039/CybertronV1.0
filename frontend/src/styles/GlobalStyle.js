import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    font-family: ${props => props.theme.fonts.body};
    font-size: 16px;
    line-height: 1.5;
    color: ${props => props.theme.colors.textPrimary};
    background-color: ${props => props.theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    height: 100%;
    width: 100%;
  }
  
  a {
    text-decoration: none;
    color: ${props => props.theme.colors.primary};
    transition: color ${props => props.theme.transitions.duration.fast} ${props => props.theme.transitions.easing.easeInOut};
    
    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }
  
  button {
    font-family: ${props => props.theme.fonts.body};
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
  
  input, textarea, select {
    font-family: ${props => props.theme.fonts.body};
    font-size: ${props => props.theme.fontSizes.md};
    outline: none;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: ${props => props.theme.fontWeights.bold};
    line-height: ${props => props.theme.lineHeights.shorter};
    margin: 0;
  }
  
  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
  }
  
  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
  
  h3 {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }
  
  h4 {
    font-size: ${props => props.theme.fontSizes.xl};
  }
  
  h5 {
    font-size: ${props => props.theme.fontSizes.lg};
  }
  
  h6 {
    font-size: ${props => props.theme.fontSizes.md};
  }
  
  p {
    margin: 0;
  }
  
  ul, ol {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.lightGray};
    border-radius: ${props => props.theme.radii.full};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.darkGray};
    border-radius: ${props => props.theme.radii.full};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;

export default GlobalStyle; 