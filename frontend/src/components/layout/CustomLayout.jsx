import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Components
import Sidebar from './Sidebar';
import Header from './Header';

const SIDEBAR_WIDTH = '68px';

const MainContent = styled.main`
  flex: 1;
  padding-top: 64px;
  transition: all 0.3s ease;
  margin-left: ${({ isMobile }) =>
    isMobile ? 0 : SIDEBAR_WIDTH};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: ${({ isMobile }) => isMobile ? '100%' : `calc(100% - ${SIDEBAR_WIDTH})`};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const CustomLayout = ({ children, title = 'Dashboard' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if window width is below mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Close sidebar when in mobile mode initially
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />
      <Header
        title={title}
        onMenuClick={toggleSidebar}
        sidebarWidth={SIDEBAR_WIDTH}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
      />

      <Overlay isOpen={isSidebarOpen && isMobile} onClick={closeSidebar} />

      <MainContent isSidebarOpen={isSidebarOpen} isMobile={isMobile}>
        {children}
      </MainContent>
    </>
  );
};

export default CustomLayout; 