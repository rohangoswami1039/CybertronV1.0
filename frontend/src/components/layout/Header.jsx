import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AiOutlineDown, AiOutlineGlobal, AiOutlineMenu } from 'react-icons/ai';
import { BiObjectsHorizontalLeft } from 'react-icons/bi';

// Context
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

const HeaderContainer = styled.header`
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #333;
  cursor: pointer;
  display: ${({ isMobile }) => (isMobile ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  padding-right: 0;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const SubSidebarToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const LogoSection = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    margin: 0;
  }
`;

const LogoImg = styled.img`
  width: 32px;
  height: 32px;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 500;
  color: #111;
`;

const NavLinks = styled.nav`
  display: ${({ isMobile }) => (isMobile ? 'none' : 'flex')};
  align-items: center;
  margin-left: 1rem;
  margin-right: auto;
  gap: 1rem;
  
  @media (min-width: 1120px) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  color: #111;
  font-size: .9rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s;
  white-space: nowrap;
  
  &:hover {
    background: #f3f3f3;
  }
`;

const Dropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: #111;
  font-size: .9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s;
  white-space: nowrap;
  
  &:hover {
    background: #f3f3f3;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 110%;
  left: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  min-width: 160px;
  padding: 0.5rem 0;
  z-index: 1001;
  list-style: none;
`;

const DropdownItem = styled.li`
  padding: 0.5rem 1.2rem;
  color: #111;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: #f3f3f3;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const LangSection = styled.div`
  display: ${({ isMobile }) => (isMobile ? 'none' : 'flex')};
  align-items: center;
  gap: 0.3rem;
  margin-right: 1.2rem;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const LangIcon = styled(AiOutlineGlobal)`
  font-size: 1.2rem;
  color: #888;
`;

const LangText = styled.span`
  font-size: 1rem;
  color: #111;
`;

const AuthSection = styled.div`
  display: ${({ isMobile }) => (isMobile ? 'none' : 'flex')};
  align-items: center;
  gap: 0.7rem;
  
  @media (min-width: 1024px) {
    display: flex;
  }
`;

const LoginLink = styled(Link)`
  color: #111;
  font-size: .9rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.4rem 1.1rem;
  border-radius: 8px;
  transition: background 0.15s;
  &:hover {
    background: #f3f3f3;
  }
`;

const SignupBtn = styled(Link)`
  background: #111;
  color: #fff;
  font-size: .9rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1.3rem;
  text-decoration: none;
  transition: background 0.15s;
  display: block;

  &:hover {
    background: #232323;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  transition: background 0.15s;
  &:hover {
    background: #f3f3f3;
  }
`;

const navLinks = [
  { label: 'AI', path: '/ai' },
  { label: 'Automation', path: '/automation' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'API', path: '/api' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
];

const productsDropdown = [
  { label: 'Studio', path: '/products/studio' },
  { label: 'Chatbot', path: '/products/chatbot' },
  { label: 'Image AI', path: '/products/image-ai' },
  { label: 'Audio AI', path: '/products/audio-ai' },
];

const Header = ({ onMenuClick, isMobile }) => {
  const { isAuthenticated } = useAuth();
  const { toggleSubSidebar } = useUI();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSubSidebarToggle = (e) => {
    e.stopPropagation();
    toggleSubSidebar();
  };

  return (
    <HeaderContainer>
      {isMobile && (
        <SubSidebarToggleButton onClick={handleSubSidebarToggle}>
          <BiObjectsHorizontalLeft size={24} />
        </SubSidebarToggleButton>
      )}

      <LogoSection to="/chat">
        <LogoImg src="/logo/logo-black-no-bg.png" alt="Cybertron.ai logo" />
        <LogoText>Cybertron.ai</LogoText>
      </LogoSection>

      <NavLinks isMobile={isMobile}>
        <Dropdown
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <DropdownButton>
            Products <AiOutlineDown style={{ fontSize: '1rem' }} />
          </DropdownButton>
          {showDropdown && (
            <DropdownMenu>
              {productsDropdown.map((item) => (
                <DropdownItem key={item.path} onClick={() => navigate(item.path)}>
                  {item.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </Dropdown>
        {navLinks.map((item) => (
          <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
        ))}
      </NavLinks>

      <RightSection>
        <LangSection isMobile={isMobile}>
          <LangIcon />
          <LangText>EN</LangText>
        </LangSection>

        {isAuthenticated ? (
          <UserSection>
            {/* User profile section could go here */}
          </UserSection>
        ) : (
          <AuthSection isMobile={isMobile}>
            <LoginLink to="/login">Login</LoginLink>
            <SignupBtn to="/signup">Sign Up</SignupBtn>
          </AuthSection>
        )}
        <MenuButton isMobile={isMobile} onClick={onMenuClick}>
          <AiOutlineMenu />
        </MenuButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header; 