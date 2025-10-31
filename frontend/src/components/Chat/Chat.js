import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      if (res.data.success) {
        setConversations(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await chatAPI.getAllUsers();
      if (res.data.success) {
        setAllUsers(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await chatAPI.getMessages(chatId);
      if (res.data.success) {
        setMessages(res.data.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const res = await chatAPI.sendMessage(selectedChat._id, { content: newMessage });
      if (res.data.success) {
        setMessages([...messages, res.data.data]);
        setNewMessage('');
        fetchConversations();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  const handleStartChat = async (recipientId) => {
    try {
      const res = await chatAPI.createChat(recipientId);
      if (res.data.success) {
        setSelectedChat(res.data.data);
        setShowUserList(false);
        fetchConversations();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create chat');
    }
  };

  const getOtherParticipant = (chat) => {
    if (!chat || !chat.participants) return null;
    return chat.participants.find(p => p && p._id && user && (p._id !== user.id && p._id.toString() !== user._id?.toString()));
  };

  const filteredUsers = allUsers.filter(u => {
    if (!u || !searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.role && u.role.toLowerCase().includes(query))
    );
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'student': return '#667eea';
      case 'faculty': return '#f093fb';
      case 'admin': return '#ff6b6b';
      case 'security': return '#4ecdc4';
      case 'canteen': return '#f9ca24';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Messages</h2>
          <button 
            className="new-chat-btn" 
            onClick={() => setShowUserList(!showUserList)}
            title="Start new conversation"
          >
            ✉️ New
          </button>
        </div>

        {showUserList && (
          <div className="user-list-modal">
            <div className="user-list-header">
              <h3>Start New Chat</h3>
              <button onClick={() => setShowUserList(false)}>×</button>
            </div>
            <input 
              type="text" 
              placeholder="Search users..." 
              className="user-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="user-list">
              {filteredUsers.map(u => (
                <div 
                  key={u._id} 
                  className="user-item"
                  onClick={() => handleStartChat(u._id)}
                >
                  <div className="user-avatar" style={{ background: getRoleBadgeColor(u.role) }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{u.name}</div>
                    <div className="user-role">{u.role}</div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="empty-state">No users found</div>
              )}
            </div>
          </div>
        )}

        <div className="conversations-list">
          {conversations.length > 0 ? (
            conversations.map(chat => {
              const otherUser = getOtherParticipant(chat);
              return (
                <div 
                  key={chat._id} 
                  className={`conversation-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="conversation-avatar" style={{ background: getRoleBadgeColor(otherUser?.role) }}>
                    {otherUser?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">{otherUser?.name}</div>
                    <div className="conversation-last-message">
                      {chat.lastMessage || 'No messages yet'}
                    </div>
                  </div>
                  <div className="conversation-meta">
                    <span className="role-badge" style={{ background: getRoleBadgeColor(otherUser?.role) }}>
                      {otherUser?.role}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <p>No conversations yet</p>
              <p style={{ fontSize: '14px', color: '#999' }}>Click "New" to start chatting</p>
            </div>
          )}
        </div>
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-user">
                <div className="chat-avatar" style={{ background: getRoleBadgeColor(getOtherParticipant(selectedChat)?.role) }}>
                  {getOtherParticipant(selectedChat)?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="chat-username">{getOtherParticipant(selectedChat)?.name}</div>
                  <div className="chat-user-role">{getOtherParticipant(selectedChat)?.role}</div>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.sender._id === user.id ? 'message-sent' : 'message-received'}`}
                >
                  <div className="message-content">
                    {msg.sender._id !== user.id && (
                      <div className="message-sender">{msg.sender.name}</div>
                    )}
                    <div className="message-text">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              {messages.length === 0 && (
                <div className="empty-state">
                  <p>No messages yet. Start the conversation! 💬</p>
                </div>
              )}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty-state">
            <div className="empty-icon">💬</div>
            <h2>Select a Conversation</h2>
            <p>Choose a conversation from the list or start a new chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
