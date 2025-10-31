const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const CanteenMenu = require('../models/CanteenMenu');
const Order = require('../models/Order');

// Get menu items
router.get('/menu', verifyToken, async (req, res) => {
  try {
    const { category, isVeg } = req.query;
    let query = { isAvailable: true };
    
    if (category) query.category = category;
    if (isVeg !== undefined) query.isVeg = isVeg === 'true';

    const menuItems = await CanteenMenu.find(query).populate('vendor', 'name');

    res.json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching menu', error: error.message });
  }
});

// Add menu item (Canteen vendor only)
router.post('/menu', verifyToken, authorize('canteen'), uploadSingle, async (req, res) => {
  try {
    // Handle file upload for item image
    const image = req.file ? 
      `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    const menuItem = new CanteenMenu({
      vendor: req.userId,
      ...req.body,
      image: image
    });

    await menuItem.save();

    res.status(201).json({ success: true, message: 'Menu item added successfully', data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding menu item', error: error.message });
  }
});

// Update menu item
router.put('/menu/:itemId', verifyToken, authorize('canteen'), uploadSingle, async (req, res) => {
  try {
    // Handle file upload for item image
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const menuItem = await CanteenMenu.findOneAndUpdate(
      { _id: req.params.itemId, vendor: req.userId },
      updateData,
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item updated successfully', data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating menu item', error: error.message });
  }
});

// Delete menu item
router.delete('/menu/:itemId', verifyToken, authorize('canteen'), async (req, res) => {
  try {
    await CanteenMenu.findOneAndDelete({ _id: req.params.itemId, vendor: req.userId });
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting menu item', error: error.message });
  }
});

// Place order
router.post('/orders', verifyToken, async (req, res) => {
  try {
    const orderNumber = 'ORD' + Date.now();
    
    const order = new Order({
      orderNumber,
      customer: req.userId,
      ...req.body
    });

    await order.save();

    // Emit socket event for new order
    const io = req.app.get('io');
    io.emit('newOrder', order);

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
  }
});

// Get orders (for customers)
router.get('/orders/my', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId })
      .populate('items.menuItem')
      .sort('-createdAt');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
});

// Get all orders (for canteen vendor)
router.get('/orders', verifyToken, authorize('canteen'), async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate('customer', 'name phone')
      .populate('items.menuItem')
      .sort('-createdAt');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
});

// Update order status
router.put('/orders/:orderId/status', verifyToken, authorize('canteen'), async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { 
        orderStatus,
        preparedBy: req.userId,
        ...(orderStatus === 'completed' && { completedAt: new Date() })
      },
      { new: true }
    );

    // Emit socket event for order update
    const io = req.app.get('io');
    io.emit('orderUpdate', order);

    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order', error: error.message });
  }
});

module.exports = router;
