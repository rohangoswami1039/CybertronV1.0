import React from 'react';
import { FaCopy } from 'react-icons/fa';
import { ControlsBar, ControlButton } from './EditorComponents';

const EditorControls = ({
  handleParaphrasing,
  handleExport,
  handleCopyToClipboard,
  isCopied
}) => {
  return (
    <ControlsBar>
      <div style={{ display: 'flex', gap: '10px' }}>
        <ControlButton onClick={handleParaphrasing}>
          Paraphrase
        </ControlButton>
        <ControlButton onClick={handleCopyToClipboard}>
          <FaCopy style={{ marginRight: '5px' }} />
          {isCopied ? 'Copied!' : 'Copy All'}
        </ControlButton>
      </div>
      <ControlButton primary onClick={handleExport}>
        Export to PDF
      </ControlButton>
    </ControlsBar>
  );
};

export default EditorControls; 