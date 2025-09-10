import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  MdAttachFile,
  MdSend,
  MdKeyboardArrowDown,
  MdClose,
  MdImage
} from 'react-icons/md';
import { BiGlobe } from 'react-icons/bi';
import { MdHearing } from 'react-icons/md';

const InputContainer = styled.div`
  position: relative;
  border-top: 1px solid #eaeaea;
  padding: 16px 24px;
  background-color: #fff;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
`;

const TextAreaWrapper = styled.div`
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fff;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  
  &:focus-within {
    border-color: #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 16px;
  font-size: 1rem;
  line-height: 1.5;
  min-height: 60px;
  max-height: 200px;
  border-radius: 12px;
  background: transparent;
  color: #333;
    
  &::placeholder {
    color: #999;
  }
`;

const InputActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid #f0f0f0;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
    color: #000;
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const SendButton = styled(ActionButton)`
  color: ${({ disabled }) => (disabled ? '#ccc' : '#000')};
  font-size: 1.4rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const ModelSelector = styled.div`
  position: relative;
`;

const ModelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ModelLogo = styled.img`
  width: 18px;
  height: 18px;
`;

const ModelDropdown = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 200px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 8px;
  z-index: 100;
  overflow: hidden;
  animation: slideUp 0.2s ease;
  
  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModelOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  ${({ active }) => active && `
    background-color: #f0f0f0;
    font-weight: 500;
  `}
`;

const ModeSelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  overflow: hidden;
`;

const ModeButton = styled.button`
  background: ${({ active }) => (active ? '#000' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#666')};
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ active }) => (active ? '#000' : '#f0f0f0')};
  }
`;

const AttachmentsArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 0 16px;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f0f0f0;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.85rem;
`;

const AttachmentIcon = styled.div`
  color: #666;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
`;

const AttachmentName = styled.span`
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  
  &:hover {
    color: #000;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

// Available AI models
const aiModels = [
  { id: 'gpt-4', name: 'GPT-4', logo: '/logo/logo-black-no-bg.png' },
  { id: 'claude-3', name: 'Claude 3', logo: '/logo/logo-black-no-bg.png' },
  { id: 'gemini', name: 'Gemini', logo: '/logo/logo-black-no-bg.png' },
  { id: 'llama-3', name: 'Llama 3', logo: '/logo/logo-black-no-bg.png' },
];

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(aiModels[0]);
  const [mode, setMode] = useState('search'); // 'search' or 'think'
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;

    onSendMessage({
      text: message,
      attachments,
      model: selectedModel,
      mode
    });

    setMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 10),
      name: file.name,
      type: file.type,
      file,
      icon: file.type.startsWith('image/') ? <MdImage /> : null
    }));

    // Limit to 5 attachments
    const updatedAttachments = [...attachments, ...newFiles].slice(0, 5);
    setAttachments(updatedAttachments);

    // Reset the input
    e.target.value = null;
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  const toggleModelDropdown = () => {
    setIsModelDropdownOpen(!isModelDropdownOpen);
  };

  const selectModel = (model) => {
    setSelectedModel(model);
    setIsModelDropdownOpen(false);
  };

  return (
    <InputContainer>
      <InputWrapper>
        {attachments.length > 0 && (
          <AttachmentsArea>
            {attachments.map(attachment => (
              <AttachmentItem key={attachment.id}>
                <AttachmentIcon>
                  {attachment.icon || '📄'}
                </AttachmentIcon>
                <AttachmentName>{attachment.name}</AttachmentName>
                <RemoveButton onClick={() => handleRemoveAttachment(attachment.id)}>
                  <MdClose size={16} />
                </RemoveButton>
              </AttachmentItem>
            ))}
          </AttachmentsArea>
        )}

        <TextAreaWrapper>
          <StyledTextArea
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <InputActions>
            <ActionButton
              onClick={() => fileInputRef.current.click()}
              disabled={attachments.length >= 5}
              title={attachments.length >= 5 ? "Maximum 5 files allowed" : "Attach files"}
            >
              <MdAttachFile />
            </ActionButton>

            <OptionsContainer>
              <ModeSelector>
                <ModeButton
                  active={mode === 'search'}
                  onClick={() => setMode('search')}
                >
                  <BiGlobe size={16} />
                  Search
                </ModeButton>
                <ModeButton
                  active={mode === 'think'}
                  onClick={() => setMode('think')}
                >
                  <MdHearing size={16} />
                  Think
                </ModeButton>
              </ModeSelector>

              <ModelSelector>
                <ModelButton onClick={toggleModelDropdown}>
                  <ModelLogo src={selectedModel.logo} alt={selectedModel.name} />
                  {selectedModel.name}
                  <MdKeyboardArrowDown />
                </ModelButton>

                {isModelDropdownOpen && (
                  <ModelDropdown>
                    {aiModels.map(model => (
                      <ModelOption
                        key={model.id}
                        active={model.id === selectedModel.id}
                        onClick={() => selectModel(model)}
                      >
                        <ModelLogo src={model.logo} alt={model.name} />
                        {model.name}
                      </ModelOption>
                    ))}
                  </ModelDropdown>
                )}
              </ModelSelector>
            </OptionsContainer>

            <SendButton
              onClick={handleSend}
              disabled={!message.trim() && attachments.length === 0}
            >
              <MdSend />
            </SendButton>
          </InputActions>
        </TextAreaWrapper>

        <HiddenFileInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
        />
      </InputWrapper>
    </InputContainer>
  );
};

export default ChatInput; 