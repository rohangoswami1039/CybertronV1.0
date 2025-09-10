import React from 'react';
import styled from 'styled-components';

const RatioContainer = styled.div`
  width: 100%;
`;

const RatioTitle = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  color: #111827;
  margin-bottom: 8px;
`;

const RatioOptions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const RatioOption = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  gap: 4px;
  padding: 4px 16px;
  border-radius: 4px;
  color: ${props => props.selected ? '#fff' : '#000'};
  border: 1px solid ${props => props.selected ? '#000' : '#e0e0e0'};
  background-color: ${props => props.selected ? '#000' : '#6666'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #000;
  }
  
  input {
    display: none;
  }
`;

const RatioSelector = ({ selectedRatio, setSelectedRatio, options = [] }) => {
  return (
    <RatioContainer>
      <RatioTitle>Ratio</RatioTitle>
      <RatioOptions>
        {options.map((option) => (
          <RatioOption key={option.value} selected={selectedRatio === option.value}>
            <input
              type="radio"
              name="ratio"
              value={option.value}
              checked={selectedRatio === option.value}
              onChange={() => setSelectedRatio(option.value)}
            />
            {option.label}
          </RatioOption>
        ))}
      </RatioOptions>
    </RatioContainer>
  );
};

export default RatioSelector;