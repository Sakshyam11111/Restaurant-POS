const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Ingredient = require('../models/Ingredient');

const CATEGORY_INGREDIENT_MAP = {
  'Main Course':      ['rice', 'tomato', 'onion', 'garlic', 'ginger', 'oil', 'cream', 'spices', 'salt', 'coriander'],
  'Appetizers':       ['oil', 'flour', 'salt', 'pepper', 'lemon', 'garlic', 'chilli', 'cornstarch', 'soy sauce', 'vinegar'],
  'Beverages':        ['water', 'sugar', 'ice', 'milk', 'cream', 'coffee', 'tea', 'lime', 'mint', 'soda water'],
  'Desserts':         ['flour', 'sugar', 'butter', 'eggs', 'milk', 'cream', 'vanilla', 'chocolate', 'cocoa powder', 'baking powder'],
  'Breakfast':        ['eggs', 'bread', 'butter', 'milk', 'salt', 'pepper', 'oil', 'cheese', 'tomato', 'onion'],
  'Snacks':           ['oil', 'salt', 'flour', 'potato', 'spices', 'chilli powder', 'cumin', 'coriander', 'lemon', 'garlic'],
  'Lunch':            ['rice', 'lentils', 'vegetables', 'oil', 'salt', 'spices', 'tomato', 'onion', 'garlic', 'ginger'],
  'Vegetarian':       ['vegetables', 'oil', 'salt', 'spices', 'tomato', 'onion', 'garlic', 'ginger', 'coriander', 'turmeric'],
  'Non-Vegetarian':   ['meat', 'oil', 'salt', 'spices', 'tomato', 'onion', 'garlic', 'ginger', 'coriander', 'yogurt'],
  'Vegan':            ['vegetables', 'tofu', 'oil', 'salt', 'spices', 'soy sauce', 'coconut milk', 'lemon', 'garlic', 'ginger'],
  'Momo':             ['flour', 'minced meat', 'onion', 'garlic', 'ginger', 'soy sauce', 'oil', 'cabbage', 'coriander', 'sesame oil'],
  'Noodles':          ['noodles', 'capsicum', 'carrot', 'onion', 'garlic', 'soy sauce', 'oil', 'cabbage', 'bean sprouts', 'oyster sauce'],
  'Burgers':          ['bun', 'lettuce', 'tomato', 'onion', 'mayo', 'cheese', 'oil', 'mustard', 'pickles', 'ketchup'],
  'Pizza':            ['flour', 'tomato sauce', 'mozzarella', 'olive oil', 'yeast', 'salt', 'basil', 'oregano', 'garlic', 'pepper'],
  'Pasta':            ['pasta', 'olive oil', 'garlic', 'tomato', 'onion', 'cream', 'cheese', 'basil', 'salt', 'pepper'],
  'Salads':           ['lettuce', 'tomato', 'cucumber', 'onion', 'olive oil', 'lemon', 'salt', 'pepper', 'vinegar', 'herbs'],
  'Soups':            ['stock', 'onion', 'garlic', 'carrot', 'celery', 'salt', 'pepper', 'herbs', 'cream', 'butter'],
  'Sides':            ['potato', 'oil', 'salt', 'butter', 'herbs', 'garlic', 'pepper', 'cheese', 'sour cream', 'chives'],
  'Specials':         ['mixed ingredients', 'oil', 'salt', 'spices', 'sauce', 'garnish', 'herbs', 'butter', 'cream', 'stock'],
  'Starters':         ['oil', 'flour', 'salt', 'pepper', 'sauce', 'herbs', 'garlic', 'lemon', 'cornstarch', 'egg'],
  'Grilled':          ['meat', 'oil', 'salt', 'pepper', 'garlic', 'herbs', 'lemon', 'butter', 'paprika', 'cumin'],
  'Fried':            ['oil', 'flour', 'egg', 'breadcrumbs', 'salt', 'pepper', 'garlic powder', 'paprika', 'cornstarch', 'baking powder'],
  'Curry':            ['onion', 'tomato', 'garlic', 'ginger', 'oil', 'turmeric', 'cumin', 'coriander', 'garam masala', 'cream'],
  'Biryani':          ['basmati rice', 'meat', 'onion', 'tomato', 'yogurt', 'saffron', 'ghee', 'spices', 'mint', 'coriander'],
  'Rice':             ['rice', 'water', 'salt', 'oil', 'onion', 'garlic', 'spices', 'coriander', 'cumin', 'bay leaf'],
  'Sandwich':         ['bread', 'butter', 'lettuce', 'tomato', 'cheese', 'mayo', 'mustard', 'onion', 'pickles', 'protein'],
  'Thakali Set':      ['rice', 'dal', 'vegetables', 'meat', 'achar', 'ghee', 'papad', 'spinach', 'salt', 'spices'],
  'Newari Khaja Set': ['beaten rice', 'meat', 'egg', 'soybeans', 'achar', 'spices', 'oil', 'onion', 'garlic', 'ginger'],
  'BBQ / Sekuwa':     ['meat', 'oil', 'garlic', 'ginger', 'spices', 'yogurt', 'lemon', 'cumin', 'coriander', 'salt'],
};

const PRIORITY_REASONS = {
  critical: 'Used across majority of your menu items',
  high:     'Essential for multiple dishes or core preparations',
  medium:   'Needed for several menu items',
  low:      'Specific to individual dishes',
};

const STOCK_TIPS = {
  out_of_stock: 'Order immediately — currently out of stock',
  low_stock:    'Reorder soon — stock below reorder level',
  sufficient:   'Stock level is adequate',
  unknown:      'Not yet tracked in your inventory',
};

function crossRef(name, dbIngredients) {
  const n = name.toLowerCase().trim();
  const match = dbIngredients.find(d => {
    const dn = (d.ingredientName || '').toLowerCase().trim();
    return dn === n || dn.includes(n) || n.includes(dn);
  });
  if (!match) return { stockStatus: 'unknown', stockQuantity: null, reorderLevel: null, unit: '', supplier: '', costPerUnit: 0 };
  
  const qty = match.stockQuantity || 0;
  const reorder = match.reorderLevel || 0;
  const stockStatus = qty === 0 ? 'out_of_stock' : qty <= reorder ? 'low_stock' : 'sufficient';
  
  return {
    stockStatus,
    stockQuantity: qty,
    reorderLevel: reorder,
    unit: match.unit || '',
    supplier: match.supplier || '',
    costPerUnit: match.costPerUnit || 0
  };
}

router.post('/ingredient-analysis', async (req, res) => {
  try {
    const { menuItems } = req.body;

    if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
      return res.status(400).json({ status: 'error', message: 'menuItems array is required' });
    }

    const dbIngredients = await Ingredient.find({ status: 'Active' }).lean();

    const freq = {};

    menuItems.forEach(item => {
      const key = item.menuGroup || item.category || 'Main Course';

      const canonical = CATEGORY_INGREDIENT_MAP[key]
        || CATEGORY_INGREDIENT_MAP[item.category]
        || CATEGORY_INGREDIENT_MAP['Main Course'];

      canonical.forEach(ing => {
        if (!freq[ing]) freq[ing] = { count: 0, sources: [] };
        freq[ing].count++;
        if (!freq[ing].sources.includes(item.name)) freq[ing].sources.push(item.name);
      });

      if (item.addOns) {
        item.addOns.toLowerCase().split(/[\s,]+/).filter(t => t.length > 2).forEach(token => {
          if (!freq[token]) freq[token] = { count: 0, sources: [] };
          freq[token].count++;
          if (!freq[token].sources.includes(item.name)) freq[token].sources.push(item.name);
        });
      }
    });

    const totalDishes = menuItems.length;

    const ingredients = Object.entries(freq)
      .map(([name, data]) => {
        const ratio = data.count / totalDishes;
        const priority = ratio >= 0.6 ? 'critical' : data.count >= 3 ? 'high' : data.count >= 2 ? 'medium' : 'low';
        const stock = crossRef(name, dbIngredients);
        const alert = (priority === 'critical' || priority === 'high') && ['out_of_stock', 'low_stock'].includes(stock.stockStatus);

        return {
          name,
          usedIn: data.sources,
          priority,
          estimatedQtyPerService: `${Math.ceil(data.count * 50)}g`,
          aiReason: PRIORITY_REASONS[priority],
          aiNote: STOCK_TIPS[stock.stockStatus],
          ...stock,
          alert,
        };
      })
      .sort((a, b) => {
        if (a.alert && !b.alert) return -1;
        if (!a.alert && b.alert) return 1;
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
      });

    const critCount = ingredients.filter(i => i.priority === 'critical').length;
    const highCount = ingredients.filter(i => i.priority === 'high').length;
    const alertCount = ingredients.filter(i => i.alert).length;
    const outCount = ingredients.filter(i => i.stockStatus === 'out_of_stock').length;

    const summary = alertCount > 0
      ? `${alertCount} ingredient${alertCount > 1 ? 's' : ''} need immediate attention — ${outCount > 0 ? `${outCount} out of stock` : 'low stock detected'}.`
      : `${ingredients.length} ingredients identified across ${totalDishes} dish${totalDishes > 1 ? 'es' : ''}. Stock levels look healthy.`;

    return res.status(200).json({
      status: 'success',
      data: { ingredients, summary }
    });

  } catch (err) {
    console.error('Local ingredient analysis error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to analyse ingredients: ' + err.message });
  }
});

module.exports = router;