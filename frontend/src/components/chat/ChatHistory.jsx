import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdAdd, MdOutlineChat, MdDelete, MdEdit } from 'react-icons/md';
import { BiRefresh } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../utils/chatService';
import { formatDistanceToNow } from 'date-fns';

const ChatHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #000;
  color: #fff;
  border-radius: 8px;
  border: 1px solid #000;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 16px 16px 24px 16px;
  
  &:hover {
    border-color: #000;
    background-color: #fff;
    color: #000;
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 8px 16px;
`;

const HistoryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #000;
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex-grow: 1;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ active }) => (active ? '#f0f0f0' : 'transparent')};
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #555;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ItemTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDate = styled.span`
  font-size: 0.8rem;
  color: #888;
  margin-top: 2px;
`;

const ItemActions = styled.div`
  display: flex;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${HistoryItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  font-size: 1rem;
  
  &:hover {
    color: ${props => props.delete ? '#e53e3e' : '#000'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: #666;
  text-align: center;
  
  p {
    margin-top: 8px;
    font-size: 0.9rem;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: #666;
`;

const EditTitleModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &.cancel {
    background: none;
    border: 1px solid #ddd;
  }
  
  &.save {
    background-color: #000;
    color: white;
    border: none;
  }
`;

/**
 * ChatHistory component that shows chat history and new chat button
 */
const ChatHistory = ({ onNewChat, activeChatId, onHistoryItemClick }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingConversation, setEditingConversation] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const { isAuthenticated } = useAuth();

  // Fetch conversations when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    } else {
      setConversations([]); // Clear history for non-authenticated users
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch conversations from API
  const fetchConversations = async () => {
    if (!isAuthenticated) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await chatService.getConversations({
        limit: 20,
        activeOnly: true
      });

      if (result.success && result.data.conversations) {
        // Format conversations
        const formattedConversations = (result.data.conversations.conversations || [])
          .map(conversation => ({
            id: conversation.id,
            title: conversation.title || 'Untitled Chat',
            date: formatDate(conversation.lastMessageAt || conversation.createdAt),
            timestamp: new Date(conversation.lastMessageAt || conversation.createdAt)
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // Most recent first

        setConversations(formattedConversations);
      } else {
        console.error('Failed to fetch conversations:', result.error);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    fetchConversations();
  };

  // Handle history item click
  const handleHistoryItemClick = (conversationId) => {
    if (onHistoryItemClick) {
      onHistoryItemClick(conversationId);
    }
  };

  // Handle delete conversation
  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation(); // Prevent triggering the parent click event

    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      setLoading(true);
      const result = await chatService.deleteConversation(conversationId);

      if (result.success) {
        // Remove from local state
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));

        // If the active conversation was deleted, trigger new chat
        if (activeChatId === conversationId) {
          onNewChat();
        }
      } else {
        console.error('Failed to delete conversation:', result.error);
        alert('Failed to delete conversation. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('An error occurred while deleting the conversation.');
    } finally {
      setLoading(false);
    }
  };

  // Open edit title modal
  const handleEditTitle = (e, conversation) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    setEditingConversation(conversation);
    setNewTitle(conversation.title);
  };

  // Save new title
  const handleSaveTitle = async () => {
    if (!editingConversation || !newTitle.trim()) {
      return;
    }

    try {
      setLoading(true);
      const result = await chatService.updateConversation(
        editingConversation.id,
        { title: newTitle.trim() }
      );

      if (result.success) {
        // Update local state
        setConversations(prev =>
          prev.map(conv =>
            conv.id === editingConversation.id
              ? { ...conv, title: newTitle.trim() }
              : conv
          )
        );

        // Close modal
        setEditingConversation(null);
        setNewTitle('');
      } else {
        console.error('Failed to update title:', result.error);
        alert('Failed to update title. Please try again.');
      }
    } catch (error) {
      console.error('Error updating title:', error);
      alert('An error occurred while updating the title.');
    } finally {
      setLoading(false);
    }
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <ChatHistoryContainer>
      <NewChatButton onClick={onNewChat} >
        <MdAdd size={20} />
        New Chat
      </NewChatButton>

      <HistoryHeader>
        <HistoryTitle>Chat History</HistoryTitle>
        <RefreshButton onClick={handleRefresh} disabled={loading || refreshing}>
          <BiRefresh size={18} />
        </RefreshButton>
      </HistoryHeader>

      <HistoryList>
        {loading ? (
          <LoadingState>Loading history...</LoadingState>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <HistoryItem
              key={conversation.id}
              active={conversation.id === activeChatId}
              onClick={() => handleHistoryItemClick(conversation.id)}
            >
              <ItemIcon>
                <MdOutlineChat />
              </ItemIcon>
              <ItemInfo>
                <ItemTitle>{conversation.title}</ItemTitle>
                <ItemDate>{conversation.date}</ItemDate>
              </ItemInfo>
              <ItemActions>
                <ActionButton onClick={(e) => handleEditTitle(e, conversation)}>
                  <MdEdit />
                </ActionButton>
                <ActionButton
                  delete
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                >
                  <MdDelete />
                </ActionButton>
              </ItemActions>
            </HistoryItem>
          ))
        ) : (
          <EmptyState>
            <MdOutlineChat size={24} />
            <p>No chat history yet. Start a new conversation!</p>
          </EmptyState>
        )}
      </HistoryList>

      {/* Edit Title Modal */}
      {editingConversation && (
        <EditTitleModal>
          <ModalContent>
            <ModalTitle>Edit Chat Title</ModalTitle>
            <TitleInput
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter a title"
              autoFocus
            />
            <ModalButtons>
              <ModalButton
                className="cancel"
                onClick={() => setEditingConversation(null)}
              >
                Cancel
              </ModalButton>
              <ModalButton
                className="save"
                onClick={handleSaveTitle}
                disabled={!newTitle.trim()}
              >
                Save
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </EditTitleModal>
      )}
    </ChatHistoryContainer>
  );
};

export default ChatHistory;
