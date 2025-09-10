import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [currentContextName, setCurrentContextName] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [sidebarView, setSidebarView] = useState('main'); // 'main', 'nav', 'history'

  // Check for mobile view on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      // Don't auto-close sidebar on resize - let user control it
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSubSidebar = () => {
    setIsSubSidebarOpen(!isSubSidebarOpen);
  };

  const activateChat = () => {
    setIsChatActive(true);
    setCurrentContextName('Chat with AI');
  };

  const deactivateChat = () => {
    setIsChatActive(false);
    setCurrentContextName('');
  };

  const setContext = (contextName) => {
    setCurrentContextName(contextName);
  };

  const toggleSidebarView = (view) => {
    if (sidebarView === view) {
      setSidebarView('main');
    } else {
      setSidebarView(view);
    }

    // Ensure sidebar is open when toggling views
    if (!isSubSidebarOpen) {
      setIsSubSidebarOpen(true);
    }
  };

  const value = {
    isSubSidebarOpen,
    setIsSubSidebarOpen,
    toggleSubSidebar,
    isChatActive,
    setIsChatActive,
    activateChat,
    deactivateChat,
    currentContextName,
    setContext,
    isMobileView,
    sidebarView,
    setSidebarView,
    toggleSidebarView
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export default UIContext; 