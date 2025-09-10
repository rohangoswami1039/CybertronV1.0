import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { BiGlobe } from 'react-icons/bi';
import { IoIosSend } from 'react-icons/io';
import { useUI } from '../../context/UIContext';

// Future Update - Icons
// import { MdCreateNewFolder, MdHearing, MdOutlineKeyboardArrowDown } from 'react-icons/md';
// import { CgAttachment } from 'react-icons/cg';

const AskBoxContainer = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 16px 24px;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  transition: all 0.5s ease;
  margin: 0 auto;
  padding-top: 0;

  ${({ isChatActive, isFixed }) => isChatActive && isFixed && `
    position: sticky;
    bottom: 0;
    z-index: 100;
    width: 100%;
    max-width: 100%;
    border-radius: 0;
    padding: 1rem 2rem;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
    margin-top: 0;
    background-color: #fff;
  `}

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const AskInputRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

const AskInput = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  max-height: 200px;
  border-radius: 12px;
  background: transparent;
  color: #333;
  padding: 0.5rem 0.5rem;
  outline: none;
  color: #333;
  resize: none;
  outline: none;
  width: 100%;
  
  &::placeholder {
    color: #999;
  }
`;

const AskButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #999;
  cursor: pointer;
  margin-left: auto;
  padding:0;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    border: 1px solid #6666;
    width: 40px;
    height: 40px;
    color: #666;
    transition: all 0.2s;
    background: ${props => props.inputValue ? '#000' : 'transparent'};
    color: ${props => props.inputValue ? '#fff' : '#999'};
  }
`;

const AskActions = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.active ? '#000' : '#eee'};
  color: ${props => props.active ? '#fff' : '#000'};
  border: none;
  border-radius: 25px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.3rem 0.8rem;
  }
`;

// Future Update

// const IconsWrapper = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-right: 1rem;

//   @media (max-width: 768px) {
//     gap: 0.5rem;
//     margin-right: 0.5rem;
//   }
// `;

// const Logo = styled.img`
//   width: ${({ width }) => width ? width : "24px"};
// `;

const AskBox = ({ onSendMessage, isFixed = false }) => {
  const { isChatActive, activateChat } = useUI();
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState('search'); // 'search' or 'think'
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Activate chat interface if not already active
    if (!isChatActive) {
      activateChat();
    }

    // Create message object
    const message = {
      text: inputValue,
      mode,
      attachments: []
    };

    // Pass message to parent
    if (onSendMessage) {
      onSendMessage(message);
    }

    // Clear input
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <AskBoxContainer isChatActive={isChatActive} isFixed={isFixed}>
      <AskInputRow>
        <AskInput
          placeholder="Ask Anything"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          ref={inputRef}
        />
      </AskInputRow>
      <AskActions>
        {/* Future Update - Icons */}
        {/*
        <IconsWrapper>
          <CgAttachment size={28} color='#000' />
          <MdCreateNewFolder size={28} color='#000' />
        </IconsWrapper> 
        */}
        <ActionButton
          active={mode === 'search'}
          onClick={() => handleModeChange('search')}
        >
          <BiGlobe size={24} /> Search
        </ActionButton>
        {/* Future Update - Think Mode */}
        {/*         
        <ActionButton
          active={mode === 'think'}
          onClick={() => handleModeChange('think')}
        >
          <MdHearing size={24} /> Think
        </ActionButton>
        <ActionButton>
          <Logo src='/logo/logo-black-no-bg.png' width={"24px"} />
          GPT-04 <MdOutlineKeyboardArrowDown />
        </ActionButton> 
        */}
        <AskButton onClick={handleSendMessage} inputValue={inputValue}>
          <span><IoIosSend size={24} /></span>
        </AskButton>
      </AskActions>
    </AskBoxContainer>
  );
};

export default AskBox; 