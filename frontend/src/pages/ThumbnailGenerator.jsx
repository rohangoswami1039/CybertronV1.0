import React, { useState } from 'react';
import styled from 'styled-components';

// Layout Components
import SubSidebar from '../components/layout/SubSidebar';
import Layout from '../components/layout/Layout';

// Navigation Components
import NavigationList from '../components/navigation/NavigationList';
import HistoryMenu from '../components/imageGenerator/HistoryMenu';

// Reusable Thumbnail Components
import ThumbnailGenerationContent from '../components/contentGenerator/ThumbnailGeneration/ThumbnailGenerationContent';
import ThumbnailSidebarContent from '../components/contentGenerator/ThumbnailGeneration/ThumbnailSidebarContent';

// Data
import { historyItems } from '../utils/ImageGeneratorSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.center ? 'center' : 'space-between'};
  align-items: ${props => props.center ? 'center' : 'stretch'};
  position: relative;
`;

const ThumbnailGenerator = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Form state for passing to ThumbnailSidebarContent
  const [thumbnailFormData, setThumbnailFormData] = useState(null);

  // Navigation state
  const [activeNavItem, setActiveNavItem] = useState('thumbnail-creation');

  // App state for determining content centering
  const [shouldCenterContent, setShouldCenterContent] = useState(false);

  // Handle thumbnail generation
  const handleGenerateThumbnail = (formData) => {
    setThumbnailFormData(formData);
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
    // Pass the history item data to the sidebar component
    if (historyItem && historyItem.prompt) {
      setThumbnailFormData({
        prompt: historyItem.prompt,
        // Add other properties if available in historyItem
        selectedRatio: historyItem.settings?.ratio || '16:9',
        language: historyItem.settings?.language || '10',
        type: historyItem.settings?.type || 'Type',
        style: historyItem.settings?.style || 'Style'
      });
    }
  };

  // Handle app state changes from child component
  const handleAppStateChange = (shouldCenter) => {
    setShouldCenterContent(shouldCenter);
  };

  // Main form content
  const mainContent = (
    <ThumbnailSidebarContent
      onGenerate={handleGenerateThumbnail}
      initialData={thumbnailFormData}
    />
  );

  // History content
  const historyContent = (
    <HistoryMenu
      items={historyItems}
      onItemClick={handleHistoryItemClick}
    />
  );

  return (
    <Layout title="Thumbnail Generator">
      <MainContainer>
        <SubSidebar
          contextName="Thumbnail Generation"
          mainContent={mainContent}
          navigationContent={<NavigationList activeItem={activeNavItem} onSelectItem={handleNavItemClick} />}
          showHistoryToggle={true}
          historyContent={historyContent}
        />

        <ContentArea center={shouldCenterContent}>
          <ThumbnailGenerationContent
            prompt={thumbnailFormData?.prompt || ''}
            selectedRatio={thumbnailFormData?.selectedRatio || '16:9'}
            language={thumbnailFormData?.language || '10'}
            type={thumbnailFormData?.type || 'Type'}
            style={thumbnailFormData?.style || 'Style'}
            onAppStateChange={handleAppStateChange}
            showInitialModal={true}
          />
        </ContentArea>
      </MainContainer>
    </Layout>
  );
};

export default ThumbnailGenerator;