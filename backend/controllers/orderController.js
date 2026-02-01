const Order = require('../models/Order');

const generateKOT = async () => {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  if (!lastOrder) return 'K1001';

  const num = parseInt(lastOrder.kot.replace(/[^0-9]/g, ''), 10);
  return `K${num + 1}`;
};

const getTimeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin === 1) return '1 min ago';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs === 1) return '1 hr ago';
  return `${diffHrs} hrs ago`;
};

const formatOrder = (order) => ({
  id: order._id.toString(),
  kot: order.kot,
  table: order.table,
  type: order.type,
  time: getTimeAgo(order.createdAt),
  status: order.status,
  waiter: order.waiter || '',
  items: order.items.map((item) => `${item.name} ×${item.quantity}`),
  total: order.items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  createdAt: order.createdAt
});

exports.createOrder = async (req, res) => {
  try {
    const { table, type, items, waiter } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Order must contain at least one item'
      });
    }

    for (const item of items) {
      if (!item.name || item.quantity == null || item.price == null) {
        return res.status(400).json({
          status: 'error',
          message: 'Each item must have a name, quantity, and price'
        });
      }
    }

    const kot = await generateKOT();

    const order = await Order.create({
      kot,
      table,
      type: type || 'Dine In',
      items,
      waiter: waiter || '',
      createdBy: req.user?.userId || null
    });

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: { order: formatOrder(order) }
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create order'
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { date, status } = req.query;

    const filter = {};
    if (date) {
      const startOfDay = new Date(date + 'T00:00:00.000Z');
      const endOfDay = new Date(date + 'T23:59:59.999Z');
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders: orders.map(formatOrder) }
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders'
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { order: formatOrder(order) }
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order'
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Order status updated',
      data: { order: formatOrder(order) }
    });
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order'
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete order'
    });
  }
};