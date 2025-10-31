const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Get all conversations for logged-in user
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const userId = req.userId || req.user._id;
    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'name email role')
    .sort({ lastMessageTime: -1 });

    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations'
    });
  }
});

// Get messages for a specific chat
router.get('/:chatId/messages', verifyToken, async (req, res) => {
  try {
    const userId = req.userId || req.user._id;
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name email role')
      .populate('messages.sender', 'name email role');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === userId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    // Mark messages as read
    chat.messages.forEach(msg => {
      if (msg.sender._id.toString() !== userId.toString()) {
        msg.isRead = true;
      }
    });
    await chat.save();

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
});

// Send a message
router.post('/:chatId/send', verifyToken, async (req, res) => {
  try {
    const userId = req.userId || req.user._id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this chat'
      });
    }

    const newMessage = {
      sender: userId,
      content: content.trim(),
      timestamp: new Date(),
      isRead: false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = content.trim();
    chat.lastMessageTime = new Date();
    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name email role')
      .populate('messages.sender', 'name email role');

    // Emit socket event for real-time messaging
    const io = req.app.get('io');
    if (io) {
      chat.participants.forEach(participantId => {
        if (participantId.toString() !== userId.toString()) {
          io.to(participantId.toString()).emit('new-message', {
            chatId: chat._id,
            message: populatedChat.messages[populatedChat.messages.length - 1]
          });
        }
      });
    }

    res.json({
      success: true,
      data: populatedChat.messages[populatedChat.messages.length - 1]
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
});

// Create or get one-on-one chat
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID is required'
      });
    }

    // Validate recipient ID format
    if (!recipientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipient ID format'
      });
    }

    const userId = req.userId || req.user._id;
    
    // Convert to string for comparison
    const userIdString = userId.toString();
    const recipientIdString = recipientId.toString();

    // Check if trying to chat with self
    if (recipientIdString === userIdString) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create chat with yourself'
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientIdString);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [userIdString, recipientIdString] }
    })
    .populate('participants', 'name email role')
    .populate('messages.sender', 'name email role');

    if (!chat) {
      // Create new chat with valid ObjectId participants
      chat = new Chat({
        participants: [userIdString, recipientIdString],
        messages: [],
        isGroupChat: false,
        lastMessage: '',
        lastMessageTime: new Date()
      });
      await chat.save();
      
      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email role')
        .populate('messages.sender', 'name email role');
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating chat'
    });
  }
});

// Get all users (for starting new chats)
router.get('/users/all', verifyToken, async (req, res) => {
  try {
    const userId = req.userId || req.user._id;
    const users = await User.find({
      _id: { $ne: userId }
    }).select('name email role');

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get unread message count
router.get('/unread/count', verifyToken, async (req, res) => {
  try {
    const userId = req.userId || req.user._id;
    const chats = await Chat.find({
      participants: userId
    });

    let unreadCount = 0;
    chats.forEach(chat => {
      chat.messages.forEach(msg => {
        if (msg.sender.toString() !== userId.toString() && !msg.isRead) {
          unreadCount++;
        }
      });
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
});

module.exports = router;
