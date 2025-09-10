import React from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  width: 100%;
`;

const SettingsTitle = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  color: #111827;
  margin-bottom: 8px;
`;

const SelectorsRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Selector = styled.select`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  min-width: 100px;
  flex: 1;
  font-weight: 500;
  font-size: 0.8rem;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SettingsSelector = ({
  language, setLanguage,
  type, setType,
  style, setStyle,
  languageOptions = [],
  typeOptions = [],
  styleOptions = []
}) => {
  return (
    <SettingsContainer>
      <SettingsTitle>Language & Type & Industry</SettingsTitle>
      <SelectorsRow>
        <Selector value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languageOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Selector>
        <Selector value={type} onChange={(e) => setType(e.target.value)}>
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Selector>
        <Selector value={style} onChange={(e) => setStyle(e.target.value)}>
          {styleOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Selector>
      </SelectorsRow>
    </SettingsContainer>
  );
};

export default SettingsSelector;