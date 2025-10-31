const ChatMessage = require('../models/ChatMessage');
const Notification = require('../models/Notification');

const connectedUsers = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins with their userId
    socket.on('join', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    // Handle chat messages
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, receiver, message, messageType, fileUrl } = data;

        const chatMessage = new ChatMessage({
          sender,
          receiver,
          message,
          messageType,
          fileUrl
        });

        await chatMessage.save();

        const populatedMessage = await ChatMessage.findById(chatMessage._id)
          .populate('sender', 'name profilePicture')
          .populate('receiver', 'name profilePicture');

        // Emit to receiver
        io.to(receiver).emit('newMessage', populatedMessage);
        
        // Emit back to sender for confirmation
        socket.emit('messageSent', populatedMessage);

        // Create notification
        const notification = new Notification({
          recipient: receiver,
          sender: sender,
          title: 'New Message',
          message: `You have a new message from ${data.senderName || 'someone'}`,
          type: 'chat'
        });
        await notification.save();

        io.to(receiver).emit('newNotification', notification);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      io.to(data.receiver).emit('userTyping', {
        sender: data.sender,
        isTyping: data.isTyping
      });
    });

    // Handle notifications
    socket.on('sendNotification', async (data) => {
      try {
        const notification = new Notification(data);
        await notification.save();

        io.to(data.recipient).emit('newNotification', notification);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    });

    // Handle order updates
    socket.on('orderUpdate', (data) => {
      io.emit('orderStatusChanged', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove user from connected users
      for (let [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Broadcast function for announcements
  io.broadcastAnnouncement = async (announcement) => {
    io.emit('announcement', announcement);
  };

  return io;
};
