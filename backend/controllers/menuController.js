// backend/controllers/menuController.js
const MenuItem = require('../models/MenuItem');

// ── GET all menu items ────────────────────────────────────────────────────────
exports.getMenuItems = async (req, res) => {
  try {
    const { search, category, status } = req.query;

    const filter = {};
    if (search)   filter.name     = { $regex: search, $options: 'i' };
    if (category && category !== 'All') filter.category = category;
    if (status)   filter.status   = status;

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items },
    });
  } catch (error) {
    console.error('getMenuItems error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch menu items' });
  }
};

// ── GET single menu item ──────────────────────────────────────────────────────
exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Menu item not found' });
    }
    res.status(200).json({ status: 'success', data: { item } });
  } catch (error) {
    console.error('getMenuItemById error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch menu item' });
  }
};

// ── CREATE menu item ──────────────────────────────────────────────────────────
exports.createMenuItem = async (req, res) => {
  try {
    const {
      name,
      itemCode,
      hsCode,
      price,
      category,
      menuGroup,
      menuSubGroup,
      printType,
      addOns,
      status,
      image,
      variants,
    } = req.body;

    // Basic validation
    if (!name || price === undefined || price === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Item name and price are required',
      });
    }

    // Sanitise variants array coming from frontend
    const sanitisedVariants = Array.isArray(variants)
      ? variants.map((v) => ({
          name:                  v.name   || '',
          price:                 Number(v.price)  || 0,
          cogs:                  Number(v.cogs)   || 0,
          listedPrice:           Number(v.listedPrice) || 0,
          grossProfit:           Number(v.grossProfit)  || 0,
          setupStockConsumption: Boolean(v.setupStockConsumption),
        }))
      : [];

    const newItem = await MenuItem.create({
      name,
      itemCode:    itemCode    || '',
      hsCode:      hsCode      || '',
      price:       Number(price),
      category:    category    || 'Vegetarian',
      menuGroup:   menuGroup   || '',
      menuSubGroup:menuSubGroup|| '',
      printType:   printType   || '',
      addOns:      addOns      || '',
      status:      status      || 'Active',
      image:       image       || '',
      variants:    sanitisedVariants,
      createdBy:   req.user?.userId || null,
    });

    res.status(201).json({
      status: 'success',
      message: 'Menu item created successfully',
      data: { item: newItem },
    });
  } catch (error) {
    console.error('createMenuItem error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create menu item' });
  }
};

// ── UPDATE menu item ──────────────────────────────────────────────────────────
exports.updateMenuItem = async (req, res) => {
  try {
    const {
      name,
      itemCode,
      hsCode,
      price,
      category,
      menuGroup,
      menuSubGroup,
      printType,
      addOns,
      status,
      image,
      variants,
    } = req.body;

    const sanitisedVariants = Array.isArray(variants)
      ? variants.map((v) => ({
          name:                  v.name   || '',
          price:                 Number(v.price)  || 0,
          cogs:                  Number(v.cogs)   || 0,
          listedPrice:           Number(v.listedPrice) || 0,
          grossProfit:           Number(v.grossProfit)  || 0,
          setupStockConsumption: Boolean(v.setupStockConsumption),
        }))
      : [];

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        itemCode,
        hsCode,
        price: Number(price),
        category,
        menuGroup,
        menuSubGroup,
        printType,
        addOns,
        status,
        image,
        variants: sanitisedVariants,
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ status: 'error', message: 'Menu item not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Menu item updated successfully',
      data: { item: updatedItem },
    });
  } catch (error) {
    console.error('updateMenuItem error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update menu item' });
  }
};

// ── DELETE menu item ──────────────────────────────────────────────────────────
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Menu item not found' });
    }
    res.status(200).json({ status: 'success', message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('deleteMenuItem error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete menu item' });
  }
};