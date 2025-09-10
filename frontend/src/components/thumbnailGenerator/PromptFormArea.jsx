import React from 'react';
import styled from 'styled-components';

// Form Components
import PromptInput from '../common/PromptInput';
import RatioSelector from '../common/RatioSelector';
import Input from '../common/Input';
import SettingsSelector from '../imageGenerator/SettingsSelector';

// Data
import { ImageGeneratorSettings } from '../../utils/ImageGeneratorSettings';

const PromptFormContainer = styled.div`   
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 1rem;
  height: 100%;
`;

const FormGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
  color: #111827;
  
  .required {
    color: #e53e3e;
    margin-left: 2px;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: ${props => props.count > 2000 ? 'red' : '#666'};
`;

const SubmitButton = styled.button`
  width: 100%;
  margin: 0 auto;
  background: #000;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;

  &:hover{
    transform: scale(1.01);
    transition: transform 0.2s ease-in-out;
  }
`;

const PromptFormArea = ({
  prompt,
  setPrompt,
  selectedRatio,
  setSelectedRatio,
  referenceLinks,
  setReferenceLinks,
  language,
  setLanguage,
  type,
  setType,
  style,
  setStyle,
  handleGenerate,
  isGenerating
}) => {
  return (
    <PromptFormContainer>
      <PromptInput
        label="Thumbnail Generation Prompt" 
        prompt={prompt} 
        setPrompt={setPrompt} 
      />
      
      <RatioSelector 
        selectedRatio={selectedRatio} 
        setSelectedRatio={setSelectedRatio} 
        options={ImageGeneratorSettings.ratioOptions}
      />

      <FormGroup>
        <Label htmlFor="referenceLinks">Add Reference Youtube Thumbnail Link</Label>
        <Input
          checks={false}
          id="referenceLinks"
          name="referenceLinks"
          placeholder="Add Reference Youtube Thumbnail Link here..."
          value={referenceLinks}
          onChange={(e) => setReferenceLinks(e.target.value)}
          style={{fontSize: '0.9rem'}}
        />
        <CharCount count={referenceLinks.length}>
          {referenceLinks.length}/{1000}
        </CharCount>
      </FormGroup>
      
      <SettingsSelector 
        language={language} setLanguage={setLanguage}
        type={type} setType={setType}
        style={style} setStyle={setStyle}
        languageOptions={ImageGeneratorSettings.languageOptions}
        typeOptions={ImageGeneratorSettings.typeOptions}
        styleOptions={ImageGeneratorSettings.styleOptions}
      />
      
      <SubmitButton 
        type="submit" 
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Thumbnail'}
      </SubmitButton>
    </PromptFormContainer>
  );
};

export default PromptFormArea;