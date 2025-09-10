import React from 'react';
import styled from 'styled-components';
import { MdDownload } from 'react-icons/md';

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  width: 18px;
  height: 18px;
  appearance: none; /* Remove default radio styling */
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid #000;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  position: relative;
  outline: none;
  margin: 0;
  
  /* Checked state - show black dot */
  &:checked {
    background-color: white;
    border: 2px solid #000;
  }
  
  /* Create the inner dot when checked */
  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #000;
  }
  
  /* Disabled state styling */
  &:disabled {
    cursor: not-allowed;
    border-color: #000;
  }
  
  &:disabled:checked::after {
    background-color: #000;
  }
  
  /* Hover effect for non-disabled radios */
  &:not(:disabled):hover {
    border-color: #333;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
  
  /* Focus state for accessibility */
  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
`;

const RadioLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.disabled ? '#666' : '#000'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  user-select: none;
`;

const DownloadAllButton = styled.button`
  background: ${props => props.disabled ? '#ccc' : '#000'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #333;
  }
`;

const ImageActionsBar = ({ 
  selectedImages, 
  totalImages, 
  downloadMode, 
  onDownloadModeChange, 
  onDownloadSelected,
}) => {
  return (
    <ActionsBar>
      <RadioGroup>
        <SelectionInfo disabled={downloadMode !== 'selected'}>
          <Radio 
            name="downloadMode"
            checked={downloadMode === 'selected'} 
            readOnly // Make it read-only
            disabled // Disable user interaction
            id="selected-only"
          />
          <RadioLabel htmlFor="selected-only" disabled={downloadMode !== 'selected'}>
            {`Selected (${selectedImages.length})`}
          </RadioLabel>
        </SelectionInfo>
        
        <SelectionInfo>
          <Radio 
            name="downloadMode"
            checked={downloadMode === 'all'} 
            onChange={() => {}} // Empty onChange to prevent React warnings
            id="all"
          />
          <RadioLabel 
            htmlFor="all"
            onClick={() => onDownloadModeChange('all')} // Also make label clickable
          >
            {`All (${totalImages})`}
          </RadioLabel>
        </SelectionInfo>
      </RadioGroup>
      
      <DownloadAllButton 
        disabled={downloadMode === 'none' || (downloadMode === 'selected' && selectedImages.length === 0)}
        onClick={onDownloadSelected}
      >
        <MdDownload size={18} />
        Download {downloadMode === 'selected' ? 'Selected' : downloadMode === 'all' ? 'All' : ''}
      </DownloadAllButton>
    </ActionsBar>
  );
};

export default ImageActionsBar;