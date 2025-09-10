import React, { useState } from 'react';
import styled from 'styled-components';

// Components
import Layout from '../layout/Layout';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

// Data
import { toolResults } from '../../utils/dummyData';

const ToolContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
`;

const InputSection = styled(Card)`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.md};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary}30;
  }
`;

const OptionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const OptionLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Select = styled.select`
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.md};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary}30;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
`;

const ResultSection = styled(Card)``;

const ResultContent = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.lightGray};
  min-height: 200px;
  max-height: 600px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: ${({ theme }) => theme.fonts.body};
  line-height: 1.6;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.space[4]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[8]} 0;
  gap: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TextGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setResult(toolResults['text-generator'].result);
      setIsGenerating(false);
    }, 2000);
  };
  
  const handleReset = () => {
    setPrompt('');
    setResult('');
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    // You could add a toast notification here
    alert('Copied to clipboard!');
  };
  
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'generated-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout title="Text Generator">
      <ToolContainer>
        <InputSection>
          <Card.Body>
            <h2>Generate Text</h2>
            <p>Enter a prompt to generate creative and professional text content.</p>
            
            <TextArea
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Write a short story about a robot learning to paint..."
            />
            
            <OptionsRow>
              <OptionGroup>
                <OptionLabel>Style</OptionLabel>
                <Select>
                  <option>Creative</option>
                  <option>Professional</option>
                  <option>Academic</option>
                  <option>Conversational</option>
                </Select>
              </OptionGroup>
              
              <OptionGroup>
                <OptionLabel>Length</OptionLabel>
                <Select>
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Long</option>
                </Select>
              </OptionGroup>
              
              <OptionGroup>
                <OptionLabel>Format</OptionLabel>
                <Select>
                  <option>Paragraph</option>
                  <option>Bullet Points</option>
                  <option>Essay</option>
                  <option>Story</option>
                </Select>
              </OptionGroup>
            </OptionsRow>
            
            <ButtonRow>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={!prompt.trim() || isGenerating}
                isLoading={isGenerating}
                loadingText="Generating..."
              >
                Generate
              </Button>
            </ButtonRow>
          </Card.Body>
        </InputSection>
        
        {isGenerating ? (
          <LoadingContainer>
            <Spinner size="lg" />
            <p>Generating creative content...</p>
          </LoadingContainer>
        ) : result ? (
          <ResultSection>
            <Card.Body>
              <h2>Generated Text</h2>
              <ResultContent>
                {result}
              </ResultContent>
              
              <ActionBar>
                <div>
                  <p>AI-generated content may require review and editing.</p>
                </div>
                <ActionButtons>
                  <Button variant="outline" onClick={handleCopy}>
                    Copy
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    Download
                  </Button>
                  <Button onClick={handleGenerate}>
                    Regenerate
                  </Button>
                </ActionButtons>
              </ActionBar>
            </Card.Body>
          </ResultSection>
        ) : null}
      </ToolContainer>
    </Layout>
  );
};

export default TextGenerator; 