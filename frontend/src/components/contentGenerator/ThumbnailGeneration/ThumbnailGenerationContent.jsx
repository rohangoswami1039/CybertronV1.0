import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Display Components
import ImageGrid from '../../imageGenerator/ImageGrid';
import ImageActionsBar from '../../imageGenerator/ImageActionsBar';
import { LoadingView, EmptyState } from '../../imageGenerator/EmptyState';

// Thumbnail Components
import CloneModelModal from '../../thumbnailGenerator/CloneModelModal';
import ModelCreationForm from '../../thumbnailGenerator/ModelCreationForm';
import ProgressLoader from '../../common/ProgressLoader';
import SuccessMessage from '../../thumbnailGenerator/SuccessMessage';
import ThumbnailHeader from '../../thumbnailGenerator/ThumbnailHeader';

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

// App states for the face model flow
const APP_STATES = {
  INITIAL_MODAL: 'INITIAL_MODAL',
  NORMAL: 'NORMAL',
  MODEL_FORM: 'MODEL_FORM',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS'
};

const ThumbnailGenerationContent = ({
  prompt,
  selectedRatio,
  language,
  type,
  style,
  onAppStateChange,
  showInitialModal = false // New prop to control initial modal display
}) => {
  // App state
  const [appState, setAppState] = useState(showInitialModal ? APP_STATES.INITIAL_MODAL : APP_STATES.NORMAL);
  const [previousAppState, setPreviousAppState] = useState(APP_STATES.NORMAL);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [models, setModels] = useState([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  // Selection state
  const [selectedImages, setSelectedImages] = useState([]);
  const [downloadMode, setDownloadMode] = useState('none');

  // Track if we should auto-generate based on prompt changes
  const [lastProcessedPrompt, setLastProcessedPrompt] = useState('');

  // Handle initial modal actions
  const handleCloseModal = () => {
    setAppState(APP_STATES.NORMAL);
  };

  const handleProceedToModelCreation = () => {
    setPreviousAppState(APP_STATES.NORMAL);
    setAppState(APP_STATES.MODEL_FORM);
  };

  // Handle header button clicks
  const handleCloneModelClick = () => {
    // Save current state before transitioning
    if (appState !== APP_STATES.MODEL_FORM) {
      setPreviousAppState(appState);
      setAppState(APP_STATES.INITIAL_MODAL);
    }
  };

  const handleModelSettingsClick = () => {
    console.log('Model Settings clicked - functionality to be implemented');
  };

  // Handle model form submission
  const handleModelFormSubmit = (formData) => {
    setAppState(APP_STATES.LOADING);

    // Simulate API call with timeout
    setTimeout(() => {
      setIsProcessingComplete(true);

      // Add the new model to the list
      const newModel = {
        id: `model-${Date.now()}`,
        name: formData.modelName,
        createdAt: new Date().toISOString(),
        imageCount: formData.images.length
      };

      setModels(prev => [...prev, newModel]);
    }, 6000); // Simulate a 6-second processing time
  };

  // Handle back button in model form
  const handleModelFormBack = () => {
    setAppState(previousAppState);
  };

  // Handle success message dismissal
  const handleSuccessDismiss = () => {
    setAppState(previousAppState);
    setIsProcessingComplete(false);
  };

  // Generate images function
  const handleGenerate = () => {
    if (!prompt || !prompt.trim()) return;

    setIsGenerating(true);
    setLastProcessedPrompt(prompt);

    // Simulate API call with timeout
    setTimeout(() => {
      const images = Array(4).fill(0).map((_, i) => ({
        id: `img-${Date.now()}-${i}`,
        url: `https://picsum.photos/seed/${Date.now() + i}/600/600`,
        alt: `Generated image ${i + 1} based on prompt: ${prompt}`,
        prompt: prompt,
        settings: { ratio: selectedRatio, language, type, style }
      }));

      setGeneratedImages(images);
      setSelectedImages([]);
      setIsGenerating(false);

      // Ensure we're in NORMAL state to display the results
      if (appState !== APP_STATES.NORMAL) {
        setAppState(APP_STATES.NORMAL);
      }
    }, 3000);
  };

  // Image selection functions
  const handleSelectImage = (imageId) => {
    setSelectedImages(prev => {
      const newSelection = prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId];

      // Update selectAll state based on selection count
      const allSelected = newSelection.length === generatedImages.length;

      // Update downloadMode based on selection
      if (newSelection.length === 0) {
        // No images selected - no radio button should be active
        setDownloadMode('none');
      } else if (allSelected) {
        // All images selected - set to 'all' mode
        setDownloadMode('all');
      } else {
        // Some images selected - set to 'selected' mode
        setDownloadMode('selected');
      }

      return newSelection;
    });
  };

  // Download functions
  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  const handleDownloadModeChange = (mode) => {
    // Only handle 'all' mode (selected mode is read-only)
    if (mode === 'all') {
      // Toggle behavior: if already in 'all' mode, deselect all
      if (downloadMode === 'all') {
        // Deselect all images
        setSelectedImages([]);
        setDownloadMode('none');
      } else {
        // Select all images  
        setDownloadMode('all');
        setSelectedImages(generatedImages.map(img => img.id));
      }
    }
    // Note: 'selected' mode is now read-only and controlled by individual selections
  };

  const handleDownloadSelected = async () => {
    // Don't allow download if no mode is active
    if (downloadMode === 'none') return;

    const imagesToDownload = downloadMode === 'all'
      ? generatedImages
      : generatedImages.filter(img => selectedImages.includes(img.id));

    imagesToDownload.forEach((image, index) => {
      setTimeout(() => handleDownloadImage(image.url), 100 * index);
    });
  };

  // Watch for prompt changes to trigger generation
  useEffect(() => {
    // Only generate if we have a prompt and it's different from the last one we processed
    if (prompt && prompt.trim() && prompt !== lastProcessedPrompt) {
      // If in INITIAL_MODAL, switch to NORMAL before generating
      if (appState === APP_STATES.INITIAL_MODAL) {
        setAppState(APP_STATES.NORMAL);
        // Defer generation until state updates
        // Use a timeout to ensure state is updated before generating
        setTimeout(() => {
          handleGenerate();
        }, 0);
      } else if (appState === APP_STATES.NORMAL) {
        handleGenerate();
      }
    }
  }, [prompt, appState]);

  // Notify parent about app state changes that affect centering
  useEffect(() => {
    const shouldCenterContent = [
      APP_STATES.INITIAL_MODAL,
      APP_STATES.LOADING,
      APP_STATES.SUCCESS
    ].includes(appState);

    if (onAppStateChange) {
      onAppStateChange(shouldCenterContent);
    }
  }, [appState, onAppStateChange]);

  // Render content based on app state
  const renderContent = () => {
    switch (appState) {
      case APP_STATES.INITIAL_MODAL:
        return (
          <CloneModelModal
            onClose={handleCloseModal}
            onProceed={handleProceedToModelCreation}
          />
        );

      case APP_STATES.MODEL_FORM:
        return (
          <ModelCreationForm
            onBack={handleModelFormBack}
            onSubmit={handleModelFormSubmit}
          />
        );

      case APP_STATES.LOADING:
        return (
          <ProgressLoader
            title="Working on it..."
            isComplete={isProcessingComplete}
            onComplete={() => setAppState(APP_STATES.SUCCESS)}
          />
        );

      case APP_STATES.SUCCESS:
        return (
          <SuccessMessage
            onDismiss={handleSuccessDismiss}
          />
        );

      case APP_STATES.NORMAL:
      default:
        if (isGenerating) {
          return <LoadingView message="Generating your thumbnails... Please wait." />;
        } else if (generatedImages.length > 0) {
          return (
            <>
              <ThumbnailHeader
                onCloneModelClick={handleCloneModelClick}
                onModelSettingsClick={handleModelSettingsClick}
              />
              <ImageGrid
                images={generatedImages}
                selectedImages={selectedImages}
                onSelectImage={handleSelectImage}
                onDownloadImage={handleDownloadImage}
              />

              <ImageActionsBar
                selectedImages={selectedImages}
                totalImages={generatedImages.length}
                downloadMode={downloadMode}
                onDownloadModeChange={handleDownloadModeChange}
                onDownloadSelected={handleDownloadSelected}
              />
            </>
          );
        } else {
          return (
            <>
              <ThumbnailHeader
                onCloneModelClick={handleCloneModelClick}
                onModelSettingsClick={handleModelSettingsClick}
              />
              <EmptyState
                title="Create Stunning Thumbnails"
                description="Generate eye-catching YouTube thumbnails with AI. Use the sidebar to customize your settings and start creating."
              />
            </>
          );
        }
    }
  };

  // Determine if content should be centered
  const shouldCenterContent = [
    APP_STATES.INITIAL_MODAL,
    APP_STATES.LOADING,
    APP_STATES.SUCCESS
  ].includes(appState);

  return (
    <ContentContainer style={{
      justifyContent: shouldCenterContent ? 'center' : 'space-between',
      alignItems: shouldCenterContent ? 'center' : 'stretch'
    }}>
      {renderContent()}
    </ContentContainer>
  );
};

export default ThumbnailGenerationContent; 