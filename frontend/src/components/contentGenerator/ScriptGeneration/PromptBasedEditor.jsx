import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { EmptyState } from '../../imageGenerator/EmptyState';
import ScriptEditor from '../../scriptGenerator/ScriptEditor';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const EditorContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const BottomControls = styled.div`
  border-top: 1px solid #6666;
  padding: 16px;
  background-color: white;
`;

const ControlsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  
  @media (min-width: 640px) {
    flex-direction: row;
    gap: 0;
  }
`;

const LeftControls = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 16px;
`;

const PrimaryButton = styled.button`
  background-color: black;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
  
  @media (max-width: 640px) {
    width: 100%;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
  &:hover {
    background-color: #333;
  }
`;

const PromptBasedEditor = ({ onGenerateAudio, initialContent = '' }) => {
  const [generatedScript, setGeneratedScript] = useState(initialContent);

  // Update script when initialContent changes
  useEffect(() => {
    if (initialContent) {
      setGeneratedScript(initialContent);
    }
  }, [initialContent]);

  const generateAudio = () => {
    if (onGenerateAudio) {
      onGenerateAudio(generatedScript);
    } else {
      console.log('Generate audio for script');
    }
  };


  return (
    <Container>
      <EditorContainer>
        {generatedScript ? (
          <ScriptEditor initialContent={generatedScript} />
        ) : (
          <EmptyState 
            title="No script generated" 
            description="Please generate a script to see the editor"
          />
        )}
      </EditorContainer>

      <BottomControls>
        <ControlsContent>
          <LeftControls>
            <PrimaryButton onClick={generateAudio} disabled={!generatedScript}>
              Generate Audio for this script
            </PrimaryButton>
          </LeftControls>
        </ControlsContent>
      </BottomControls>
    </Container>
  );
};

export default PromptBasedEditor; 