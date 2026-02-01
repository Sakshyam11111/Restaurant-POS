const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
});

const orderSchema = new mongoose.Schema({
  kot: {
    type: String,
    required: [true, 'KOT number is required'],
    unique: true,
    trim: true
  },
  table: {
    type: String,
    required: [true, 'Table is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Order type is required'],
    enum: ['Dine In', 'Take Away', 'Delivery'],
    default: 'Dine In'
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function (items) {
        return items && items.length > 0;
      },
      message: 'Order must have at least one item'
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'],
    default: 'Pending'
  },
  waiter: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

orderSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

orderSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);