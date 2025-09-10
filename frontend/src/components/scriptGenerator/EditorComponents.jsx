import styled from 'styled-components';

// Editor container and layout components
export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

export const Toolbar = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 5px;
  color: #000;
`;

export const ToolGroup = styled.div`
  display: flex;
  gap: 2px;
  margin-right: 10px;
  align-items: center;
`;

export const ToolButton = styled.button`
  background: ${props => props.active ? '#e0e0e0' : 'transparent'};
  border: 1px solid ${props => props.active ? '#ccc' : 'transparent'};
  border-radius: 4px;
  padding: 5px;
  cursor: ${props => props.nonInteractive ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #000;
  
  &:hover {
    background: ${props => props.nonInteractive ? 'transparent' : '#e0e0e0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextManipulationButton = styled(ToolButton)`
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  min-width: 80px;
  justify-content: center;
  
  svg {
    font-size: 14px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: #e0e0e0;
  margin: 0 8px;
`;

export const Select = styled.select`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  font-size: 14px;
  min-width: 80px;
  color: #000;
`;

export const FontSizeInput = styled.input`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  font-size: 14px;
  width: 60px;
  color: #000;
  text-align: center;
`;

export const EditorWrapper = styled.div`
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
  position: relative;
  
  .DraftEditor-root {
    height: 100%;
    min-height: 300px;
  }
  
  .public-DraftEditor-content {
    min-height: 300px;
    padding: 10px;
    font-size: ${props => props.fontSize || '16px'};
    font-family: ${props => props.fontFamily || 'Arial, sans-serif'};
    line-height: 1.6;
  }
  
  /* Remove the global highlighting - we'll handle it differently */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  
  ul, ol {
    margin-left: 1.5em;
  }
  
  /* Custom selection highlighting */
  .public-DraftEditor-content ::selection {
    background-color: #fff3cd;
  }
  
  .public-DraftEditor-content ::-moz-selection {
    background-color: #fff3cd;
  }
`;

export const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background: transparent;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ControlButton = styled.button`
  background: ${props => props.primary ? '#000' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#000'};
  border: 1px solid #000;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#333' : '#f0f0f0'};
  }
  
  &:disabled {
    background: #f5f5f5;
    color: #999;
    border-color: #ddd;
    cursor: not-allowed;
    
    &:hover {
      background: #f5f5f5;
    }
  }
`; 