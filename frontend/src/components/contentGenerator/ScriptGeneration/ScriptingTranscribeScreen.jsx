import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { MdArrowCircleDown } from 'react-icons/md';
import { sampleScriptContent } from '../../../utils/scriptGeneratorData';
import { EmptyState, LoadingView } from '../../imageGenerator/EmptyState';
import ScriptEditor from '../../scriptGenerator/ScriptEditor';
import Button from '../../common/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 150vh;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;
  flex-shrink: 0;
  
  @media (min-width: 640px) {
    font-size: 18px;
    padding: 14px 16px;
  }
  
  @media (min-width: 1024px) {
    font-size: 20px;
    padding: 16px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: ${props => props.$isNarrow ? 'column' : 'row'};
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  width: ${props => props.$isNarrow ? '100%' : '320px'};
  min-width: ${props => props.$isNarrow ? 'auto' : '280px'};
  max-width: ${props => props.$isNarrow ? 'none' : '380px'};
  padding: ${props => props.$isNarrow ? '12px' : '16px'};
  border-right: ${props => props.$isNarrow ? 'none' : '1px solid #e5e7eb'};
  border-bottom: ${props => props.$isNarrow ? '1px solid #e5e7eb' : 'none'};
  overflow-y: auto;
  flex-shrink: 0;
  height: ${props => props.$isNarrow ? 'auto' : '100%'};
  
  @media (min-width: 640px) {
    padding: ${props => props.$isNarrow ? '14px' : '16px'};
  }
  
  @media (min-width: 1200px) {
    width: ${props => props.$isNarrow ? '100%' : '350px'};
    max-width: ${props => props.$isNarrow ? 'none' : '400px'};
  }
`;

const VideoContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
  
  @media (min-width: 640px) {
    margin-bottom: 14px;
  }
  
  @media (min-width: 1024px) {
    margin-bottom: 16px;
  }
`;

const VideoThumbnail = styled.div`
  aspect-ratio: 16/9;
  max-height: 250px; // Adjust this value as needed
  background: linear-gradient(135deg, #000, #666);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  
  @media (min-width: 640px) {
    border-radius: 7px;
    max-height: 250px;
  }
  
  @media (min-width: 1024px) {
    border-radius: 8px;
    max-height: 250px;
  }
`;

const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoContent = styled.div`
  text-align: center;
  color: white;
`;

const VideoTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  
  @media (min-width: 640px) {
    font-size: 18px;
    margin-bottom: 7px;
  }
  
  @media (min-width: 1024px) {
    font-size: 20px;
    margin-bottom: 8px;
  }
`;

const VideoTag = styled.div`
  background-color: #000;
  color: white;
  padding: 3px 6px;
  border-radius: 3px;
  transform: rotate(-12deg);
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  
  @media (min-width: 640px) {
    padding: 3px 7px;
    font-size: 13px;
    gap: 3px;
  }
  
  @media (min-width: 1024px) {
    padding: 4px 8px;
    font-size: 14px;
    gap: 4px;
  }
`;

const VideoDetails = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  
  @media (min-width: 640px) {
    gap: 11px;
  }
  
  @media (min-width: 1024px) {
    gap: 12px;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background-color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
  
  @media (min-width: 640px) {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
  
  @media (min-width: 1024px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
`;

const VideoInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const VideoInfoTitle = styled.h3`
  font-weight: 600;
  font-size: 12px;
  margin: 0 0 3px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (min-width: 640px) {
    font-size: 13px;
    margin-bottom: 4px;
  }
  
  @media (min-width: 1024px) {
    font-size: 14px;
    margin-bottom: 4px;
  }
`;

const VideoInfoChannel = styled.p`
  font-size: 10px;
  color: #666;
  margin: 0 0 2px 0;
  
  @media (min-width: 640px) {
    font-size: 11px;
  }
  
  @media (min-width: 1024px) {
    font-size: 12px;
  }
`;

const VideoInfoStats = styled.p`
  font-size: 10px;
  color: #666;
  margin: 0;
  
  @media (min-width: 640px) {
    font-size: 11px;
  }
  
  @media (min-width: 1024px) {
    font-size: 12px;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const EditorContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  
  /* Ensure ScriptEditor gets proper scrollable area */
  & > * {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
`;

const BottomControls = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 12px;
  background-color: #fff;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  @media (min-width: 640px) {
    padding: 14px;
  }
  
  @media (min-width: 1024px) {
    padding: 16px;
  }
`;

const PrimaryButton = styled.button`
  background-color: black;
  color: white;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  
  @media (min-width: 640px) {
    font-size: 14px;
    border-radius: 7px;
    min-width: 160px;
  }
  
  @media (min-width: 1024px) {
    font-size: 15px;
    border-radius: 8px;
    min-width: 180px;
  }
  
  @media (max-width: 479px) {
    width: 100%;
    min-width: auto;
  }
  
  &:hover {
    background-color: #333;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ArrowIcon = styled(MdArrowCircleDown)`
  font-size: 14px;
  
  @media (min-width: 640px) {
    font-size: 15px;
  }
  
  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

// Custom hook for container width detection
const useContainerWidth = () => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Create ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver(updateWidth);

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Fallback for browsers that don't support ResizeObserver
    const handleResize = () => updateWidth();
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [ref, width];
};

const ScriptingTranscribeScreen = ({ onGenerateAudio }) => {
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mainContentRef, mainContentWidth] = useContainerWidth();

  // Determine if layout should be narrow based on container width
  const isNarrowLayout = mainContentWidth > 0 && mainContentWidth < 768;

  const generateAudio = () => {
    if (onGenerateAudio) {
      onGenerateAudio(generatedScript);
    } else {
      console.log('Generate audio for script');
    }
  };

  // Handle script generation
  const handleGenerateScript = () => {
    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      setGeneratedScript(sampleScriptContent);
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    handleGenerateScript();
  }, []);

  return (
    <Container>
      <Title>Scripting & Transcribe</Title>
      {/* Main Content */}
      <MainContent ref={mainContentRef} $isNarrow={isNarrowLayout}>
        {/* Left Side - Video Section */}
        <LeftPanel $isNarrow={isNarrowLayout}>
          <VideoContainer>
            <VideoThumbnail>
              <VideoOverlay>
                <VideoContent>
                  <VideoTitle>FIX THIS NOW!</VideoTitle>
                  <VideoTag>
                    <ArrowIcon />
                  </VideoTag>
                </VideoContent>
              </VideoOverlay>
            </VideoThumbnail>
          </VideoContainer>

          <VideoDetails>
            <Avatar>YT</Avatar>
            <VideoInfo>
              <VideoInfoTitle>
                How to EDIT Documentary Style Videos | After Effects Tutorial
              </VideoInfoTitle>
              <VideoInfoChannel>YasTutorialCoast</VideoInfoChannel>
              <VideoInfoStats>39K • 7 months</VideoInfoStats>
            </VideoInfo>
          </VideoDetails>
        </LeftPanel>

        {/* Right Side - Editor */}
        <RightPanel>
          <EditorContainer>
            {isGenerating ? (
              <LoadingView message="Generating your script... Please wait." />
            ) : generatedScript ? (
              <ScriptEditor initialContent={generatedScript} />
            ) : (
              <EmptyState title="No script generated" description="Please generate a script to see the editor" />
            )}
          </EditorContainer>
        </RightPanel>
      </MainContent>

      <BottomControls>
        {/* <ControlsContent> */}
        {/* <LeftControls> */}
        <PrimaryButton onClick={generateAudio}>
          Generate Audio for this script
        </PrimaryButton>
        {/* </LeftControls> */}
        {/* </ControlsContent> */}
      </BottomControls>
    </Container>
  );
};

export default ScriptingTranscribeScreen;