import React, { useRef, useState } from 'react';
import { createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

// Components
import Layout from '../components/layout/Layout';
import SubSidebar from '../components/layout/SubSidebar';
import ChatHistory from '../components/chat/ChatHistory';
import NavigationList from '../components/navigation/NavigationList';
import ChatInterface from '../components/chat/ChatInterface';
import AskBox from '../components/chat/AskBox';
import { mainTools } from '../utils/dummyData';
import { BiExpandAlt } from 'react-icons/bi';
import CustomLayout from '../components/layout/CustomLayout';

const HomeContainer = styled.div`
  display: ${({ isChatActive }) => isChatActive ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  flex: 1;
  width: 100%;
  align-self: stretch;
  padding: ${({ isChatActive }) => isChatActive ? '0' : '1.5rem'};

  @media screen and (max-width: 450px){
    padding: ${({ isChatActive }) => isChatActive ? '0' : '1rem'};
  }  
`;

const FlexRow = styled.div`
  display: ${({ isChatActive }) => isChatActive ? 'none' : 'flex'}; 
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
  transition: all 0.5s ease;
  opacity: ${({ isChatActive }) => isChatActive ? 0 : 1};
  height: ${({ isChatActive }) => isChatActive ? 0 : 'auto'};
`;

const Logo = styled.img`
  width: 100px;

  @media screen and (max-width: 450px){
    width: 70px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 500;
  color: #000;

  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media screen and (max-width: 450px){
    font-size: 1.5rem;
  }

`;

const ToolGrid = styled.div`
  display: ${({ isChatActive }) => isChatActive ? 'none' : 'grid'};
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 900px;
  transition: all 0.5s ease;
  opacity: ${({ isChatActive }) => isChatActive ? 0 : 1};
  height: ${({ isChatActive }) => isChatActive ? 0 : 'auto'};

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  @media screen and (max-width: 450px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
`;


const ToolCard = styled.div`
  background: #eee;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.15s;
  color: #333;
  min-height: 60px;
  width: 100%;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }

  &:hover {
    transform: translateY(-3px) scale(1.03);
  }
`;

const ToolIcon = styled.div`
  font-size: 1.2rem;
  color: #000;
`;

const ViewAllBtn = styled.button`
  display: ${({ isChatActive }) => isChatActive ? 'none' : 'block'};
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  width: 350px;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.5s ease;
  opacity: ${({ isChatActive }) => isChatActive ? 0 : 1};
  height: ${({ isChatActive }) => isChatActive ? 0 : 'auto'};
  
  &:hover {
    transform: translateY(-3px) scale(1.03);
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 350px;
  }
`;

const ProductBy = styled.div`
  margin: 0 auto;
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  transition: all 0.5s ease;
  display: ${({ isChatActive }) => isChatActive ? 'none' : 'block'};
  opacity: ${({ isChatActive }) => isChatActive ? 0 : 1};
  height: ${({ isChatActive }) => isChatActive ? 0 : 'auto'};
`;

const ChatContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;  
  height: 100%;
  opacity: ${({ isChatActive }) => isChatActive ? 1 : 0};
  transition: all 0.5s ease;
  overflow: hidden;
`;

const MainContainer = styled.div`
  display: ${({ isChatActive }) => isChatActive ? 'flex' : 'none'};
  width: 100%;
  height: 100%;
  position: relative;
`;

const SidebarContainer = styled.div`
  height: 100%;
  z-index: 1001;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  position: relative;
  z-index: 1000;
`;

const ExpandIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 10px;
  cursor: pointer;
  color: #000;
  font-size: 24px;
  transition: all 0.3s ease;
  background-color: #000;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  .icon{
    transition: all 0.3s ease;
  }
    
  &:hover {
    .icon{
      transform: scale(1.1);
    }
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: ${({ isVisible }) => isVisible ? 'block' : 'none'};
  cursor: pointer;
  transition: opacity 0.3s ease;
`;

const AiChat = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isChatActive, setIsChatActive, isSubSidebarOpen, isMobileView, toggleSubSidebar } = useUI();
  const chatInterfaceRef = useRef(null);
  const [activeNavItem, setActiveNavItem] = useState('text-generator');
  const [activeConversationId, setActiveConversationId] = useState(null);

  // Handle tool click with auth check
  const handleToolClick = (route) => {
    if (isAuthenticated) {
      if (route) {
        navigate(route);
      }
    } else {
      navigate('/login', { state: { from: { pathname: route || '/chat' } } });
    }
  };

  // View All handler with auth check
  const handleViewAll = () => {
    if (isAuthenticated) {
      navigate('/explore');
    } else {
      navigate('/login', { state: { from: { pathname: '/explore' } } });
    }
  };

  // Handle send message
  const handleSendMessage = (message) => {
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.handleSendMessage(message);
      setIsChatActive(true); // Show chat interface when sending message
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.resetChat();
      if (isSubSidebarOpen && isMobileView) {
        toggleSubSidebar();
      }
      setIsChatActive(false);
      setActiveConversationId(null);
    }
  };

  // Handle conversation item click
  const handleConversationClick = (conversationId) => {
    if (chatInterfaceRef.current && conversationId) {
      chatInterfaceRef.current.loadChatById(conversationId);
      setActiveConversationId(conversationId);
      // console.log("Clicking History", isSubSidebarOpen, isMobileView);
      if (isSubSidebarOpen && isMobileView) {
        toggleSubSidebar();
      }
      setIsChatActive(true); // Show chat interface when selecting conversation
    }
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

  const handleExpand = () => {
    setIsChatActive(false);
  };

  // Handler to close sidebar when overlay is clicked
  const handleOverlayClick = (e) => {
    // Stop propagation to prevent other click handlers from firing
    e.stopPropagation();
    if (isSubSidebarOpen && isMobileView) {
      toggleSubSidebar();
    }
  };

  return (
    <CustomLayout>
      {isMobileView && isSubSidebarOpen && (
        <MobileOverlay
          isVisible={true}
          onClick={handleOverlayClick}
          data-testid="mobile-overlay"
        />
      )}
      {isMobileView && <SidebarContainer>
        <SubSidebar
          contextName="Chat with AI"
          mainContent={
            <ChatHistory
              onNewChat={handleNewChat}
              activeChatId={activeConversationId}
              onHistoryItemClick={handleConversationClick}
            />
          }
          navigationContent={<NavigationList activeItem={activeNavItem} onSelectItem={handleNavItemClick} />}
          showHistoryToggle={false}
        />
      </SidebarContainer>
      }

      {/* Chat Interface Container */}
      <MainContainer isChatActive={isChatActive}>
        {!isMobileView && <SidebarContainer>
          <SubSidebar
            contextName="Chat with AI"
            mainContent={
              <ChatHistory
                onNewChat={handleNewChat}
                activeChatId={activeConversationId}
                onHistoryItemClick={handleConversationClick}
              />
            }
            navigationContent={<NavigationList activeItem={activeNavItem} onSelectItem={handleNavItemClick} />}
            showHistoryToggle={false}
          />
        </SidebarContainer>
        }
        <ContentArea>
          <ChatContent isChatActive={isChatActive}>
            <ChatInterface ref={chatInterfaceRef} />
            <AskBox
              onSendMessage={handleSendMessage}
              isFixed={isChatActive}
            />
            <ExpandIcon onClick={handleExpand}>
              <BiExpandAlt className='icon' size={24} />
            </ExpandIcon>
          </ChatContent>
        </ContentArea>
      </MainContainer>

      <HomeContainer className='home-wrapper' isChatActive={isChatActive}>
        <FlexRow isChatActive={isChatActive}>
          <Logo src="/logo/logo-black-no-bg.png" alt="Cybertron.ai logo" />
          <Title>Cybertron.ai</Title>
        </FlexRow>

        <AskBox
          onSendMessage={handleSendMessage}
          isFixed={false}
        />

        <ToolGrid isChatActive={isChatActive} isMobileView={isMobileView}>
          {mainTools.map((tool, idx) => (
            <ToolCard
              isMobileView={isMobileView}
              key={`${tool.name}-${idx}`}
              color={tool.color}
              onClick={() => handleToolClick(tool.route)}
            >
              <ToolIcon>{createElement(tool.icon)}</ToolIcon>
              {tool.name}
            </ToolCard>
          ))}
        </ToolGrid>

        <ViewAllBtn
          onClick={handleViewAll}
          isChatActive={isChatActive}
        >
          {isAuthenticated ? 'View all' : 'Login to view all'}
        </ViewAllBtn>

        <ProductBy isChatActive={isChatActive}>
          product by <strong>ZooQ inc.</strong>
        </ProductBy>
      </HomeContainer>
    </CustomLayout>
  );
};

export default AiChat;