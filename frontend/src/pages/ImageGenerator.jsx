import React, { useState } from 'react';
import styled from 'styled-components';

// Layout Components
import SubSidebar from '../components/layout/SubSidebar';
import Layout from '../components/layout/Layout';

// Form Components
import PromptInput from '../components/common/PromptInput';
import RatioSelector from '../components/common/RatioSelector';
import Input from '../components/common/Input';

// Display Components
import ImageGrid from '../components/imageGenerator/ImageGrid';
import ImageActionsBar from '../components/imageGenerator/ImageActionsBar';
import HistoryMenu from '../components/imageGenerator/HistoryMenu';
import NavigationList from '../components/navigation/NavigationList';

// Data
import { historyItems, ImageGeneratorSettings } from '../utils/ImageGeneratorSettings';
import { EmptyState, LoadingView } from '../components/imageGenerator/EmptyState';
import SettingsSelector from '../components/imageGenerator/SettingsSelector';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';


const MainContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f9f9f9;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PromptFormContainer = styled.div`   
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 1rem;
  height: 100%;
`

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

const ImageGenerator = () => {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Form state
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [language, setLanguage] = useState('10');
  const [type, setType] = useState('Type');
  const [style, setStyle] = useState('Style');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  // Selection state
  const [selectedImages, setSelectedImages] = useState([]);
  const [downloadMode, setDownloadMode] = useState('none');

  // Navigation state
  const [activeNavItem, setActiveNavItem] = useState('text-to-image');

  // SubSidebar Updates
  const { isMobileView, isSubSidebarOpen, toggleSubSidebar } = useUI();

  // Generate images function
  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    if (isSubSidebarOpen && isMobileView) {
      toggleSubSidebar();
    }

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

  // Main form content
  const mainContent = (
    <PromptFormContainer>
      <PromptInput
        label="Image Generation Prompt"
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
          size="small"
          onChange={(e) => setReferenceLinks(e.target.value)}
          style={{ fontSize: "0.85rem" }}
          mb={"0px"}
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
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </SubmitButton>
    </PromptFormContainer>
  );

  // History content
  const historyContent = (
    <HistoryMenu
      items={historyItems}
      onItemClick={handleHistoryItemClick}
    />
  );

  return (
    <Layout title="Image Generation">
      <MainContainer>
        <SubSidebar
          contextName="Image Generation"
          mainContent={mainContent}
          navigationContent={<NavigationList activeItem={activeNavItem} onSelectItem={handleNavItemClick} />}
          showHistoryToggle={true}
          historyContent={historyContent}
        />

        <ContentArea>
          {isGenerating ? (
            <LoadingView message="Generating your images... Please wait." />
          ) : generatedImages.length > 0 ? (
            <>
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
          ) : (
            <EmptyState />
          )}
        </ContentArea>
      </MainContainer>
    </Layout>
  );
};

export default ImageGenerator;