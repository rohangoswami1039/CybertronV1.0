import React from 'react';
import { FaCompressArrowsAlt, FaExpandArrowsAlt, FaRedo, FaSpinner, FaUndo } from 'react-icons/fa';
import { 
  Toolbar, 
  ToolGroup, 
  FontSizeInput, 
  Divider, 
  ToolButton,
  TextManipulationButton
} from './EditorComponents';

const EditorToolbar = ({ 
  fontSize, 
  setFontSize, 
  canUndo, 
  canRedo, 
  hasSelection, 
  wordCount, 
  isProcessing, 
  processingType,
  handleMakeShorter, 
  handleMakeLonger 
}) => {
  
  const handleFontSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 8 && value <= 72) {
      setFontSize(value);
    }
  };

  return (
    <Toolbar>        
      <ToolGroup>
        <FontSizeInput 
          type="number" 
          value={fontSize} 
          onChange={handleFontSizeChange}
          min="8"
          max="72"
          title="Font Size"
        />
        <span style={{ fontSize: '12px', color: '#666' }}>px</span>
      </ToolGroup>           

      <Divider />
      
      <ToolGroup>
        <ToolButton 
          disabled={!canUndo}
          nonInteractive
          title="Undo (Ctrl+Z)"
        >
          <FaUndo />
        </ToolButton>
        <ToolButton 
          disabled={!canRedo}
          nonInteractive
          title="Redo (Ctrl+Y)"
        >
          <FaRedo />
        </ToolButton>
      </ToolGroup>
      
      <ToolGroup>
        <TextManipulationButton 
          onClick={handleMakeShorter}
          disabled={!hasSelection || wordCount < 3 || isProcessing}
          title={!hasSelection ? "Select text first" : wordCount < 3 ? "Need at least 3 words" : "Make selected text shorter"}
        >
          {isProcessing && processingType === 'shorter' ? (
            <FaSpinner className="fa-spin" />
          ) : (
            <FaCompressArrowsAlt />
          )}
          {isProcessing && processingType === 'shorter' ? 'Processing...' : 'Shorter'}
        </TextManipulationButton>
        <TextManipulationButton 
          onClick={handleMakeLonger}
          disabled={!hasSelection || isProcessing}
          title={!hasSelection ? "Select text first" : "Make selected text longer"}
        >
          {isProcessing && processingType === 'longer' ? (
            <FaSpinner className="fa-spin" />
          ) : (
            <FaExpandArrowsAlt />
          )}
          {isProcessing && processingType === 'longer' ? 'Processing...' : 'Longer'}
        </TextManipulationButton>
      </ToolGroup>
      
      {hasSelection && (
        <ToolGroup>
          <span style={{ fontSize: '12px', color: '#666', padding: '5px' }}>
            {wordCount} word{wordCount !== 1 ? 's' : ''} selected
          </span>
        </ToolGroup>
      )}
    </Toolbar>
  );
};

export default EditorToolbar; 