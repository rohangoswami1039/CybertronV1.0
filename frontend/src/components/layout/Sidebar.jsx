import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaMagic, FaCreditCard, FaUserCircle, FaHome, FaSignOutAlt, FaSignInAlt, FaTimes, FaUserPlus } from 'react-icons/fa';

// Context
import { useAuth } from '../../context/AuthContext';

const SidebarContainer = styled.div`
  width: ${({ isMobile, isOpen }) => (isMobile ? (isOpen ? '240px' : '0') : '68px')};
  padding-top: ${({ isMobile }) => (isMobile ? '0' : '64px')};
  height: 100vh;
  background: #181818;
  display: flex;
  flex-direction: column;
  align-items: ${({ isMobile }) => (isMobile ? 'flex-start' : 'center')};
  position: fixed;
  left: 0;
  top: 0;
  z-index: ${({ isMobile }) => (isMobile ? '1002' : '1000')};
  box-shadow: ${({ isMobile, isOpen }) => (isMobile && isOpen ? '0 0 15px rgba(0,0,0,0.1)' : '1px 0 0 #e5e7eb')};
  transition: width 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
`;

const MobileHeader = styled.div`
  display: ${({ isMobile }) => (isMobile ? 'flex' : 'none')};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 0 16px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImg = styled.img`
  width: 32px;
  height: 32px;
`;

const LogoText = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  padding: ${({ isMobile }) => (isMobile ? '0 12px' : '0 6px')};
  width: 100%;
`;

const NavButton = styled(Link)`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'row' : 'column')};
  align-items: center;
  justify-content: ${({ isMobile }) => (isMobile ? 'flex-start' : 'center')};
  border-radius: 6px;
  color: ${({ active, isMobile }) => (active ? '#000' : '#bdbdbd')};
  background: ${({ active, isMobile }) => (active ? '#fff' : 'transparent')};
  font-size: ${({ isMobile }) => (isMobile ? '1rem' : '1.2rem')};
  margin-bottom: ${({ isMobile }) => (isMobile ? '4px' : '2px')};
  transition: background 0.15s, color 0.15s;
  position: relative;
  padding: ${({ isMobile }) => (isMobile ? '0.75rem 1rem' : '0.5rem 5px')};
  text-decoration: none;
  width: 100%;

  span {
    font-size: ${({ isMobile }) => (isMobile ? '0.95rem' : '0.6rem')};
    font-weight: 500;
    color: ${({ active, isMobile }) => (active ? '#000' : '#bdbdbd')};
    margin-left: ${({ isMobile }) => (isMobile ? '12px' : '0')};
    margin-top: ${({ isMobile }) => (isMobile ? '0' : '4px')};
    display: ${({ isMobile, hideLabel }) => (isMobile || !hideLabel ? 'block' : 'none')};
  }

  &:hover {
    background: ${({ active, isMobile }) => (active ? '#fff' : '#232323')};
    color: ${({ active, isMobile }) => (active ? '#000' : '#fff')};
  }
`;

const Tooltip = styled.div`
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: #222;
  color: #fff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.95rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 999;
  display: ${({ isMobile }) => (isMobile ? 'none' : 'block')};

  ${NavButton}:hover & {
    opacity: 1;
  }
`;

const BottomSection = styled.div`
  margin-top: auto;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: ${({ isMobile }) => (isMobile ? 'flex-start' : 'center')};
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '0 12px' : '0')};
`;

const Divider = styled.div`
  width: 90%;
  height: 1px;
  background: #333;
  margin: 8px auto;
  display: ${({ isMobile }) => (isMobile ? 'block' : 'none')};
`;

const AuthButtons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SignUpButton = styled(NavButton)`
  background: #635bff;
  color: #fff;
  
  span {
    color: #fff;
  }
  
  &:hover {
    background: #4b44bb;
    color: #fff;
    
    span {
      color: #fff;
    }
  }
`;

const navItems = [
  { path: '/chat', icon: <FaHome />, label: 'Home' },
  { path: '/automation', icon: <FaMagic />, label: 'Automation' },
  { path: '/billing', icon: <FaCreditCard />, label: 'Billing' },
];

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) onClose();
  };

  return (
    <SidebarContainer isOpen={isOpen} isMobile={isMobile}>
      <MobileHeader isMobile={isMobile}>
        <Logo>
          <LogoImg src="/logo/logo-white-no-bg.png" alt="Cybertron.ai logo" />
          <LogoText>Cybertron.ai</LogoText>
        </Logo>
        <CloseButton onClick={onClose} isMobile={isMobile}>
          <FaTimes />
        </CloseButton>
      </MobileHeader>

      <NavSection isMobile={isMobile}>
        {navItems.map((item) => (
          <NavButton
            key={item.path}
            to={item.path}
            active={location.pathname.startsWith(item.path) ? 1 : 0}
            aria-label={item.label}
            isMobile={isMobile}
            onClick={isMobile ? onClose : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
            <Tooltip isMobile={isMobile}>{item.label}</Tooltip>
          </NavButton>
        ))}
      </NavSection>

      <Divider isMobile={isMobile} />

      <BottomSection isMobile={isMobile}>
        {isAuthenticated ? (
          <>
            <NavButton
              to="/account"
              active={location.pathname.startsWith('/account') ? 1 : 0}
              aria-label="Account"
              isMobile={isMobile}
              onClick={isMobile ? onClose : undefined}
            >
              <FaUserCircle />
              <span>{user?.name || 'Account'}</span>
              <Tooltip isMobile={isMobile}>{user?.name || 'Account'}</Tooltip>
            </NavButton>
            <NavButton
              as="button"
              onClick={handleLogout}
              aria-label="Logout"
              isMobile={isMobile}
            >
              <FaSignOutAlt />
              <span>Logout</span>
              <Tooltip isMobile={isMobile}>Logout</Tooltip>
            </NavButton>
          </>
        ) : (
          <AuthButtons>
            <NavButton
              to="/login"
              active={location.pathname.startsWith('/login') ? 1 : 0}
              aria-label="Login"
              isMobile={isMobile}
              onClick={isMobile ? onClose : undefined}
            >
              <FaSignInAlt />
              <span>Login</span>
              <Tooltip isMobile={isMobile}>Login</Tooltip>
            </NavButton>

            {isMobile && (
              <SignUpButton
                to="/signup"
                active={location.pathname.startsWith('/signup') ? 1 : 0}
                aria-label="Sign Up"
                isMobile={isMobile}
                onClick={onClose}
              >
                <FaUserPlus />
                <span>Sign Up</span>
              </SignUpButton>
            )}
          </AuthButtons>
        )}
      </BottomSection>
    </SidebarContainer>
  );
};

export default Sidebar; 