import React, { useState } from 'react';
import styled from 'styled-components';
import { scriptLanguage, scriptType, scriptIndustry } from '../../utils/scriptGeneratorData';
import PromptInput from '../common/PromptInput';
import Input from '../common/Input';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  width: 100%;
  height: 100%;
`;

const FormGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.8rem;
  color: #111827;
  
  .required {
    color: #e53e3e;
    margin-left: 2px;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 10px;
  color: ${props => props.count > 2000 ? 'red' : '#666'};
`;

const SettingsContainer = styled.div`
  border-radius: 8px;
`;

const SettingsTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
`;

const SelectorsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const GenerateButton = styled.button`
  width: 100%;
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const PromptForm = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [keywordsList, setKeywordsList] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedScriptType, setSelectedScriptType] = useState('educational');
  const [selectedIndustry, setSelectedIndustry] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleKeywordListChange = (e) => {
    setKeywordsList(e.target.value);
  };

  const handleReferenceLinkChange = (e) => {
    setReferenceLink(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleScriptTypeChange = (e) => {
    setSelectedScriptType(e.target.value);
  };

  const handleIndustryChange = (e) => {
    setSelectedIndustry(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);

    // In a real app, this would call an API
    setTimeout(() => {
      onGenerate({
        prompt: prompt.trim(),
        keywordsList: keywordsList.trim(),
        referenceLink: referenceLink.trim(),
        language: selectedLanguage,
        scriptType: selectedScriptType,
        industry: selectedIndustry,
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <FormContainer>
      <PromptInput
        label="Topics & Keywords & Prompts"
        prompt={prompt}
        setPrompt={setPrompt}
        maxLength={2000}
      />

      <FormGroup>
        <Label htmlFor="keywordsList">Add Keywords for rank</Label>
        <Input
          checks={false}
          id="keywordsList"
          name="keywordsList"
          placeholder="Enter keywords separated by commas..."
          value={keywordsList}
          onChange={handleKeywordListChange}
          style={{ fontSize: '0.9rem' }}
        />
        <CharCount count={keywordsList.length}>
          {keywordsList.length}/1000
        </CharCount>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="referenceLink">Add Reference Youtube Link</Label>
        <Input
          checks={false}
          id="referenceLink"
          name="referenceLink"
          placeholder="Add Reference Youtube Link here..."
          value={referenceLink}
          onChange={handleReferenceLinkChange}
          style={{ fontSize: '0.9rem' }}
        />
        <CharCount count={referenceLink.length}>
          {referenceLink.length}/1000
        </CharCount>
      </FormGroup>

      <SettingsContainer>
        <SettingsTitle>Language & Type & Industry</SettingsTitle>
        <SelectorsRow>
          <Selector
            id="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {scriptLanguage && scriptLanguage.map(language => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </Selector>
          <Selector
            id="scriptType"
            value={selectedScriptType}
            onChange={handleScriptTypeChange}
          >
            {scriptType && scriptType.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Selector>
          <Selector
            id="industry"
            value={selectedIndustry}
            onChange={handleIndustryChange}
          >
            {scriptIndustry && scriptIndustry.map(ind => (
              <option key={ind.id} value={ind.id}>
                {ind.name}
              </option>
            ))}
          </Selector>
        </SelectorsRow>
      </SettingsContainer>

      <GenerateButton
        onClick={handleSubmit}
        disabled={!prompt.trim() || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Script'}
      </GenerateButton>
    </FormContainer>
  );
};

export default PromptForm;