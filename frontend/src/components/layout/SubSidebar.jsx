import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdChevronLeft, MdHistory } from 'react-icons/md';
import { useUI } from '../../context/UIContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BiObjectsHorizontalLeft } from 'react-icons/bi';

const SubSidebarContainer = styled.div`
  height: calc(100vh - 64px);  // Change this line
  position: ${({ isMobileView }) => isMobileView ? 'fixed' : 'sticky'};  // Change 'relative' to 'sticky'
  top: ${({ isMobileView }) => isMobileView ? '64px' : '0'};
  left: ${({ isMobileView }) => isMobileView ? '0' : 'auto'};
  z-index: ${({ isMobileView }) => isMobileView ? '1001' : '1'};
  width: ${({ isOpen, isMobileView }) => (isOpen && isMobileView) ? '100%' : isOpen ? '350px' : '48px'};
  max-width: ${({ isMobileView }) => isMobileView ? '100%' : '350px'};
  background: ${({ currentView }) => currentView === 'nav' ? '#181818' : '#ffffff'};
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: ${({ isOpen }) => (isOpen ? '2px 0 5px rgba(0, 0, 0, 0.05)' : 'none')};
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eeee;
  transform: ${({ isOpen, isMobileView }) => (!isOpen && isMobileView) ? 'translateX(-100%)' : 'translateX(0)'};
`;

const SubSidebarHeader = styled.div`
  padding: ${({ isOpen }) => (isOpen ? '16px' : '16px 0')};
  border-bottom: 1px solid ${({ currentView }) => currentView === 'nav' ? '#333' : '#e0e0e0'};
  display: flex;
  align-items: center;
  justify-content: ${({ isOpen }) => (isOpen ? 'space-between' : 'center')};
  height: 64px;
  min-width: 0;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
  color: ${({ currentView }) => currentView === 'nav' ? '#000' : '#fff'};
  padding: 0;
  border-radius: 4px;
`;

const HistoryButton = styled(ActionButton)`
  color: ${({ currentView }) => currentView === 'nav' ? '#fff' : '#000'};
`;

const HeaderTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 600;
  background-color: ${({ currentView }) => currentView === 'nav' ? '#fff' : '#181818'};
  color: ${({ currentView }) => currentView === 'nav' ? '#000' : '#fff'};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: opacity 0.3s ease;
  width: ${({ isOpen }) => (isOpen ? 'auto' : '0')};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${({ isOpen }) => (isOpen ? '0.5rem' : '0')};
  border: 1px solid ${({ currentView }) => currentView === 'nav' ? '#fff' : '#000'};
  border-radius: 25px;
  margin-right: ${({ isOpen }) => (isOpen ? '8px' : '0')};
  flex: 1;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    background-color: ${({ currentView }) => currentView === 'nav' ? '#181818' : '#fff'};
    color: ${({ currentView }) => currentView === 'nav' ? '#fff' : '#000'};

    ${ActionButton}{
      color: ${({ currentView }) => currentView === 'nav' ? '#fff' : '#000'}; 
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  width: ${({ isOpen }) => (isOpen ? 'auto' : '0')};
  transition: opacity 0.3s ease;
`;

const ToggleButton = styled.button`
  background: ${({ currentView }) => currentView === 'nav' ? '#181818' : 'transparent'};
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ currentView }) => currentView === 'nav' ? '#fff' : '#000'};
  padding: 0;
  width: 48px;
  height: 48px;
  transition: all 0.2s;  

  &:hover {
    transform: scale(1.2); 
  }
  
  @media (max-width: 767px) {
    display: none; /* Hide on mobile as we're using the header button instead */
  }
`;

const ContentContainer = styled.div`
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: opacity 0.3s ease;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: ${({ isOpen }) => (isOpen ? 'auto' : '0')};
  flex: 1;
`;

/**
 * SubSidebar Component
 * @param {Object} props
 * @param {string} props.contextName - Name of the current context (e.g. "Chat with AI")
 * @param {React.ReactNode} props.mainContent - Component to show in main view
 * @param {React.ReactNode} props.navigationContent - Component to show in navigation view
 * @param {React.ReactNode} props.historyContent - Component to show in history view (optional)
 * @param {boolean} props.showHistoryToggle - Whether to show history toggle button (optional)
 */
const SubSidebar = ({
  contextName = "Context",
  mainContent,
  navigationContent,
  historyContent,
  showHistoryToggle = false
}) => {
  const { isSubSidebarOpen, toggleSubSidebar, setIsSubSidebarOpen, isMobileView } = useUI();
  const [currentView, setCurrentView] = useState('main'); // 'main', 'nav', 'history'

  // Prevent sidebar from auto-closing on resize
  useEffect(() => {
    const handleClick = (e) => {
      // Check if click is outside sidebar when it's open on mobile
      if (isMobileView && isSubSidebarOpen) {
        // Check if the click is outside the sidebar
        const sidebarEl = document.querySelector('[data-sidebar="true"]');
        if (sidebarEl && !sidebarEl.contains(e.target)) {
          const toggleBtn = document.querySelector('[data-toggle-button="true"]');
          // Only close if the click wasn't on the toggle button
          if (!toggleBtn || !toggleBtn.contains(e.target)) {
            setIsSubSidebarOpen(false);
          }
        }
      }
    };

    // Add click listener to handle clicks outside sidebar
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isMobileView, isSubSidebarOpen, setIsSubSidebarOpen]);

  const handleViewToggle = () => {
    setCurrentView(currentView === 'main' ? 'nav' : 'main');
  };

  const handleHistoryToggle = () => {
    setCurrentView(currentView === 'history' ? 'main' : 'history');
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'nav':
        return "Navigate To";
      case 'history':
        return "History";
      default:
        return contextName;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'nav':
        return navigationContent;
      case 'history':
        return historyContent;
      default:
        return mainContent;
    }
  };

  return (
    <SubSidebarContainer
      isOpen={isSubSidebarOpen}
      currentView={currentView}
      isMobileView={isMobileView}
      data-sidebar="true"
    >
      <SubSidebarHeader isOpen={isSubSidebarOpen} currentView={currentView} isMobileView={isMobileView}>
        <HeaderTitle isOpen={isSubSidebarOpen} onClick={handleViewToggle} currentView={currentView}>
          {getHeaderTitle()}
          <ActionButton currentView={currentView}>
            {currentView === 'nav' ? <FaChevronUp /> : <FaChevronDown />}
          </ActionButton>
        </HeaderTitle>

        {isSubSidebarOpen && (
          <HeaderActions isOpen={isSubSidebarOpen}>
            {showHistoryToggle && (
              <HistoryButton onClick={handleHistoryToggle} currentView={currentView}>
                <MdHistory size={24} /> History
              </HistoryButton>
            )}
          </HeaderActions>
        )}

        <ToggleButton
          onClick={toggleSubSidebar}
          currentView={currentView}
          isMobileView={isMobileView}
          isOpen={isSubSidebarOpen}
        >
          {isSubSidebarOpen ? <MdChevronLeft /> : <BiObjectsHorizontalLeft />}
        </ToggleButton>
      </SubSidebarHeader>

      <ContentContainer isOpen={isSubSidebarOpen} className="scrollable-content">
        {renderContent()}
      </ContentContainer>
    </SubSidebarContainer>
  );
};

export default SubSidebar; 