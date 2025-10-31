import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        newSocket.emit('join', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('newMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on('newNotification', (notification) => {
        setNotifications((prev) => [...prev, notification]);
      });

      newSocket.on('orderStatusChanged', (order) => {
        console.log('Order status changed:', order);
      });

      newSocket.on('announcement', (announcement) => {
        console.log('New announcement:', announcement);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (messageData) => {
    if (socket && connected) {
      socket.emit('sendMessage', messageData);
    }
  };

  const sendNotification = (notificationData) => {
    if (socket && connected) {
      socket.emit('sendNotification', notificationData);
    }
  };

  const emitTyping = (receiverId, isTyping) => {
    if (socket && connected) {
      socket.emit('typing', {
        sender: user.id,
        receiver: receiverId,
        isTyping
      });
    }
  };

  const value = {
    socket,
    connected,
    messages,
    notifications,
    sendMessage,
    sendNotification,
    emitTyping,
    clearMessages: () => setMessages([]),
    clearNotifications: () => setNotifications([])
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
