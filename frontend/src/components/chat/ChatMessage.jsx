import React, { useState } from 'react';
import styled from 'styled-components';
import { MdContentCopy, MdCheck } from 'react-icons/md';

const MessageContainer = styled.div`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
  animation: fadeIn 0.3s ease;
  width: 100%;

  @media (max-width: 768px) {
    padding: 12px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const UserMessageContainer = styled(MessageContainer)`
  background-color: #fff;
  flex-direction: row-reverse;
  justify-content: flex-start;
`;

const AIMessageContainer = styled(MessageContainer)`
  background-color: #f9f9f9;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ isAI }) => (isAI ? '#000' : '#6b57ff')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  flex-shrink: 0;
  color: #fff;
  font-weight: 600;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
    margin: 0 8px;
  }
`;

const MessageContent = styled.div`
  flex: 1;
  max-width: ${({ isUser }) => isUser ? '80%' : '90%'};
  ${({ isUser }) => isUser && `
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  `}

  @media (max-width: 768px) {
    max-width: ${({ isUser }) => isUser ? '85%' : '90%'};
  }
`;

const MessageText = styled.div`
  font-size: 0.9rem;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;

  ${({ isUser }) => isUser && `
    background-color: #6b57ff;
    color: white;
    padding: 12px 16px;
    border-radius: 18px 18px 4px 18px;
    max-width: 100%;
  `}
  ${({ isAI }) => isAI && `
    background-color: transparent;
  `}

  @media (max-width: 768px) {
    font-size: 0.85rem;
    ${({ isUser }) => isUser && `
      padding: 10px 14px;
    `}
  }
`;

const ThinkingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;

  span {
    width: 6px;
    height: 6px;
    background-color: #888;
    border-radius: 50%;
    margin-right: 4px;
    animation: thinking 1.4s infinite ease-in-out both;
  }

  span:nth-child(1) {
    animation-delay: -0.32s;
  }

  span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes thinking {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const MessageActions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
  ${({ isUser }) => isUser && `
    justify-content: flex-end;
  `}
  
  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }
  
  @media (max-width: 768px) {
    padding: 6px;
    font-size: 0;  /* Hide text on mobile */
  }

  svg {
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  &.copied {
    color: #2a9d8f;
  }
`;

const FileAttachment = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 12px;
  gap: 8px;
  width: fit-content;
  ${({ isUser }) => isUser && `
    align-self: flex-end;
  `}
  
  @media (max-width: 768px) {
    padding: 6px 10px;
    margin-top: 8px;
  }
`;

const FileIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

const FileName = styled.span`
  font-size: 0.9rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ChatMessage = ({
  message,
  isAI = false,
  isThinking = false,
  attachments = []
}) => {
  const [copied, setCopied] = useState(false);
  const MessageWrapper = isAI ? AIMessageContainer : UserMessageContainer;
  const isUser = !isAI;

  const handleCopy = () => {
    navigator.clipboard.writeText(message)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  return (
    <MessageWrapper>
      <Avatar isAI={isAI}>
        {isAI ? 'AI' : 'U'}
      </Avatar>

      <MessageContent isUser={isUser}>
        {isThinking ? (
          <ThinkingIndicator>
            <span></span>
            <span></span>
            <span></span>
          </ThinkingIndicator>
        ) : (
          <>
            <MessageText isUser={isUser} isAI={isAI}>{message}</MessageText>

            {attachments.length > 0 && attachments.map((file, index) => (
              <FileAttachment key={index} isUser={isUser}>
                <FileIcon>{file.icon || '📄'}</FileIcon>
                <FileName>{file.name}</FileName>
              </FileAttachment>
            ))}

            {isAI && (
              <MessageActions isUser={isUser} isActive={copied}>
                <ActionButton onClick={handleCopy} className={copied ? 'copied' : ''}>
                  {copied ? <MdCheck size={16} /> : <MdContentCopy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </ActionButton>
              </MessageActions>
            )}
          </>
        )}
      </MessageContent>
    </MessageWrapper>
  );
};

export default ChatMessage;