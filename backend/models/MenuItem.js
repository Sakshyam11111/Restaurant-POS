// backend/models/MenuItem.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Variant name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required'],
    min: [0, 'Price cannot be negative'],
  },
  cogs: {
    type: Number,
    default: 0,
    min: [0, 'COGS cannot be negative'],
  },
  listedPrice: {
    type: Number,
    default: 0,
  },
  grossProfit: {
    type: Number,
    default: 0,
  },
  setupStockConsumption: {
    type: Boolean,
    default: false,
  },
});

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    itemCode: {
      type: String,
      trim: true,
      default: '',
    },
    hsCode: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
      default: 'Vegetarian',
    },
    menuGroup: {
      type: String,
      trim: true,
      default: '',
    },
    menuSubGroup: {
      type: String,
      trim: true,
      default: '',
    },
    printType: {
      type: String,
      enum: ['', 'KOT', 'BOT', 'COT'],
      default: '',
    },
    addOns: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    image: {
      type: String,   // base64 data URL or empty string
      default: '',
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);