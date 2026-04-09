const Ingredient = require('../models/Ingredient');

exports.getIngredients = async (req, res) => {
  try {
    const { search, status, category } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { ingredientName: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (category) filter.category = category;

    const ingredients = await Ingredient.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: ingredients.length, data: { ingredients } });
  } catch (error) {
    console.error('getIngredients error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch ingredients' });
  }
};

exports.getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ status: 'error', message: 'Ingredient not found' });
    res.status(200).json({ status: 'success', data: { ingredient } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch ingredient' });
  }
};

exports.createIngredient = async (req, res) => {
  try {
    const {
      ingredientName, unit, category, costPerUnit,
      stockQuantity, reorderLevel, supplier, description, status,
    } = req.body;

    if (!ingredientName) {
      return res.status(400).json({ status: 'error', message: 'Ingredient name is required' });
    }

    const ingredient = await Ingredient.create({
      ingredientName,
      unit: unit || '',
      category: category || '',
      costPerUnit: Number(costPerUnit) || 0,
      stockQuantity: Number(stockQuantity) || 0,
      reorderLevel: Number(reorderLevel) || 0,
      supplier: supplier || '',
      description: description || '',
      status: status || 'Active',
      createdBy: req.user?.userId || null,
    });

    res.status(201).json({
      status: 'success',
      message: 'Ingredient created successfully',
      data: { ingredient },
    });
  } catch (error) {
    console.error('createIngredient error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create ingredient' });
  }
};

exports.updateIngredient = async (req, res) => {
  try {
    const {
      ingredientName, unit, category, costPerUnit,
      stockQuantity, reorderLevel, supplier, description, status,
    } = req.body;

    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      {
        ingredientName, unit, category,
        costPerUnit: Number(costPerUnit) || 0,
        stockQuantity: Number(stockQuantity) || 0,
        reorderLevel: Number(reorderLevel) || 0,
        supplier, description, status,
      },
      { new: true, runValidators: true }
    );

    if (!ingredient) return res.status(404).json({ status: 'error', message: 'Ingredient not found' });

    res.status(200).json({
      status: 'success',
      message: 'Ingredient updated successfully',
      data: { ingredient },
    });
  } catch (error) {
    console.error('updateIngredient error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update ingredient' });
  }
};

exports.deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ status: 'error', message: 'Ingredient not found' });
    res.status(200).json({ status: 'success', message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.error('deleteIngredient error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete ingredient' });
  }
};