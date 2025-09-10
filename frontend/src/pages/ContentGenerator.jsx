import React, { useState } from 'react';
import styled from 'styled-components';

// Layout Components
import SubSidebar from '../components/layout/SubSidebar';
import Layout from '../components/layout/Layout';

// Display Components
import NavigationList from '../components/navigation/NavigationList';

// Content Generator Components
import ScriptingTranscribeScreen from '../components/contentGenerator/ScriptGeneration/ScriptingTranscribeScreen';
import WorkflowHeader from '../components/contentGenerator/WorkflowHeader';
import YouTubeSearch from '../components/contentGenerator/YouTubeSearch';
import GenerateAudio from '../components/contentGenerator/AudioGeneration/GenerateAudio';
import PromptBasedEditor from '../components/contentGenerator/ScriptGeneration/PromptBasedEditor';
import ContentSearchHistory from '../components/contentGenerator/sidebar/ContentSearchHistory';
import AudioHistory from '../components/contentGenerator/sidebar/AudioHistory';
import ThumbnailGenerationContent from '../components/contentGenerator/ThumbnailGeneration/ThumbnailGenerationContent';
import ThumbnailSidebarContent from '../components/contentGenerator/ThumbnailGeneration/ThumbnailSidebarContent';
import ThumbnailHistory from '../components/contentGenerator/ThumbnailGeneration/ThumbnailHistory';

// Data
import { LoadingView } from '../components/imageGenerator/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PromptForm from '../components/scriptGenerator/PromptForm';
import ScriptHistory from '../components/scriptGenerator/ScriptHistory';
import { searchDummyData } from '../utils/searchDummyData';
import { sampleScriptContent } from '../utils/scriptGeneratorData';

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #fff;
  height: calc(100vh - 64px);
  max-height: calc(100vh - 64px);  // ADD THIS LINE
  display: flex;
  flex-direction: column;
  position: relative;
`;

// Content generator workflow steps
const WORKFLOW_STEPS = {
  YOUTUBE_SEARCH: 'YOUTUBE_SEARCH',
  SCRIPT_GENERATION: 'SCRIPT_GENERATION',
  PROMPT_BASED_EDITOR: 'PROMPT_BASED_EDITOR',
  AUDIO_GENERATION: 'AUDIO_GENERATION',
  THUMBNAIL_CREATION: 'THUMBNAIL_CREATION'
};

const ContentGenerator = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Workflow state
  const [currentStep, setCurrentStep] = useState(WORKFLOW_STEPS.YOUTUBE_SEARCH);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    type: null,
    message: ''
  });
  const [generatedScript, setGeneratedScript] = useState('');
  const [activeScriptId, setActiveScriptId] = useState(null);
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [activeThumbnailId, setActiveThumbnailId] = useState(null);
  const [thumbnailFormData, setThumbnailFormData] = useState(null);

  // Form state
  const [prompt, setPrompt] = useState('');

  // Navigation state
  const [activeNavItem, setActiveNavItem] = useState('content-generator');

  // Handle YouTube search
  const handleVideoSelect = (youtubeUrl) => {
    setLoadingState({
      isLoading: true,
      type: 'video',
      message: 'Fetching video information...'
    });

    // Simulate API call to fetch video info
    setTimeout(() => {
      setSelectedVideo({
        url: youtubeUrl,
        title: 'How to EDIT Documentary Style Videos | After Effects Tutorial',
        channel: 'YasTutorialCoast',
        views: '39K',
        publishedAt: '7 months ago'
      });
      setLoadingState({
        isLoading: false,
        type: 'script',
        message: 'Generating script...'
      });
      setCurrentStep(WORKFLOW_STEPS.SCRIPT_GENERATION);
    }, 1500);
  };

  // Handle "I have a prompt" button
  const handleHavePrompt = () => {
    setCurrentStep(WORKFLOW_STEPS.PROMPT_BASED_EDITOR);
  };

  // Handle generating audio from script
  const handleGenerateAudio = (script) => {
    setGeneratedScript(script);
    setLoadingState({
      isLoading: true,
      type: 'audio',
      message: 'Generating audio from your script...'
    });

    // Simulate API call to generate audio
    setTimeout(() => {
      setLoadingState({
        isLoading: false,
        type: 'audio',
        message: 'Audio generated successfully!'
      });
      setCurrentStep(WORKFLOW_STEPS.AUDIO_GENERATION);
    }, 2000);
  };

  // Handle next button in audio generation
  const handleNextFromAudio = () => {
    setCurrentStep(WORKFLOW_STEPS.THUMBNAIL_CREATION);
  };

  // Handle script generation from prompt form
  const handleGenerateScript = (formData) => {
    setLoadingState({
      isLoading: true,
      type: 'script',
      message: 'Generating script from your prompt....'
    });

    // Simulate API call
    setTimeout(() => {
      setGeneratedScript(sampleScriptContent);
      setLoadingState({
        isLoading: false,
        type: 'script',
        message: 'Script generated successfully!'
      });
      // Don't change step, just update the script
    }, 2000);
  };

  // Handle script selection from history
  const handleScriptSelect = (scriptId) => {
    setActiveScriptId(scriptId);
    // In a real app, you would fetch the script content here
  };

  // Handle audio selection from history
  const handleAudioSelect = (audio) => {
    setActiveAudioId(audio.id);
    // In a real app, you would load the audio here
  };

  // Handle thumbnail generation
  const handleGenerateThumbnail = (formData) => {
    setThumbnailFormData(formData);
    setLoadingState({
      isLoading: true,
      type: 'thumbnail',
      message: 'Generating thumbnails...'
    });

    // Simulate API call
    setTimeout(() => {
      setLoadingState({
        isLoading: false,
        type: 'thumbnail',
        message: 'Thumbnails generated successfully!'
      });
    }, 1000);
  };

  // Handle thumbnail selection from history
  const handleThumbnailSelect = (thumbnail) => {
    setActiveThumbnailId(thumbnail.id);
    // In a real app, you would load the thumbnail here
  };

  // Handle step click in the workflow header
  const handleStepClick = (step) => {
    // Reset state when going back to the beginning
    if (step === WORKFLOW_STEPS.YOUTUBE_SEARCH) {
      setSelectedVideo(null);
      setGeneratedScript('');
    }

    setCurrentStep(step);
  };

  // Navigation functions
  const handleNavItemClick = (itemId, route) => {
    setActiveNavItem(itemId);
    // Add navigation logic here
    if (isAuthenticated) {
      if (route) {
        navigate(route);
      }
    } else {
      navigate('/login', { state: { from: { pathname: route || '/chat' } } });
    }
  };

  const handleHistoryItemClick = (historyItem) => {
    setPrompt(historyItem.prompt);
    // Optionally restore other settings if they were saved with history
  };

  // Render sidebar content based on current step
  const renderSidebarContent = () => {
    switch (currentStep) {
      case WORKFLOW_STEPS.YOUTUBE_SEARCH:
      case WORKFLOW_STEPS.SCRIPT_GENERATION:
        return {
          mainContent: <ContentSearchHistory onSelectHistoryItem={handleHistoryItemClick} searchDummyData={searchDummyData} />,
          historyContent: null,
          showHistoryToggle: false
        };

      case WORKFLOW_STEPS.PROMPT_BASED_EDITOR:
        return {
          mainContent: <PromptForm onGenerate={handleGenerateScript} />,
          historyContent: <ScriptHistory onSelectScript={handleScriptSelect} activeScriptId={activeScriptId} />,
          showHistoryToggle: true
        };

      case WORKFLOW_STEPS.AUDIO_GENERATION:
        return {
          mainContent: <AudioHistory onSelectAudio={handleAudioSelect} activeAudioId={activeAudioId} />,
          historyContent: null,
          showHistoryToggle: false
        };

      case WORKFLOW_STEPS.THUMBNAIL_CREATION:
        return {
          mainContent: <ThumbnailSidebarContent onGenerate={handleGenerateThumbnail} />,
          historyContent: <ThumbnailHistory onSelectHistoryItem={handleThumbnailSelect} activeItemId={activeThumbnailId} />,
          showHistoryToggle: true
        };

      default:
        return {
          mainContent: <ContentSearchHistory onSelectHistoryItem={handleHistoryItemClick} searchDummyData={searchDummyData} />,
          historyContent: null,
          showHistoryToggle: false
        };
    }
  };

  // Render content based on current workflow step
  const renderContent = () => {
    if (loadingState.isLoading) {
      return <LoadingView message={loadingState.message} />;
    }

    switch (currentStep) {
      case WORKFLOW_STEPS.YOUTUBE_SEARCH:
        return (
          <YouTubeSearch
            onVideoSelect={handleVideoSelect}
            onHavePrompt={handleHavePrompt}
          />
        );

      case WORKFLOW_STEPS.SCRIPT_GENERATION:
        return (
          <ScriptingTranscribeScreen
            onGenerateAudio={handleGenerateAudio}
          />
        );

      case WORKFLOW_STEPS.PROMPT_BASED_EDITOR:
        return (
          <PromptBasedEditor
            onGenerateAudio={handleGenerateAudio}
            initialContent={generatedScript}
          />
        );

      case WORKFLOW_STEPS.AUDIO_GENERATION:
        return (
          <GenerateAudio
            onNext={handleNextFromAudio}
          />
        );

      case WORKFLOW_STEPS.THUMBNAIL_CREATION:
        return (
          <ThumbnailGenerationContent
            prompt={thumbnailFormData?.prompt || ''}
            selectedRatio={thumbnailFormData?.selectedRatio || '16:9'}
            language={thumbnailFormData?.language || '10'}
            type={thumbnailFormData?.type || 'Type'}
            style={thumbnailFormData?.style || 'Style'}
            showInitialModal={false}
          />
        );

      default:
        return null;
    }
  };

  const sidebarContent = renderSidebarContent();

  return (
    <Layout title="Content Generation">
      <MainContainer>
        <SubSidebar
          contextName="Content Generation"
          mainContent={sidebarContent.mainContent}
          navigationContent={<NavigationList activeItem={activeNavItem} onSelectItem={handleNavItemClick} />}
          showHistoryToggle={sidebarContent.showHistoryToggle}
          historyContent={sidebarContent.historyContent}
        />

        <ContentArea>
          <WorkflowHeader
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
          {renderContent()}
        </ContentArea>
      </MainContainer>
    </Layout>
  );
};

export default ContentGenerator;