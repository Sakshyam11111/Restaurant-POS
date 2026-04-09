// backend/controllers/ingredientRecommendationController.js
// Ingredient recommendation engine — given selected menu items,
// surfaces which ingredients are needed and cross-references live stock.

const MenuItem  = require('../models/MenuItem');
const Ingredient = require('../models/Ingredient');

// ── Token extractor ───────────────────────────────────────────────────────────
// Pulls ingredient-like tokens from menu item fields.
// In production you'd store a proper ingredients[] array on MenuItem;
// for now we mine addOns, name, menuGroup, and menuSubGroup.
const extractIngredientTokens = (item) => {
  const parts = [
    item.addOns      || '',
    item.menuGroup   || '',
    item.menuSubGroup|| '',
  ];
  return parts
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s,]/g, '')
    .split(/[\s,]+/)
    .map(t => t.trim())
    .filter(t => t.length > 2);
};

// ── Canonical ingredient map ──────────────────────────────────────────────────
// Maps dish categories to their typical ingredient lists.
// You can extend or move this to a DB collection later.
const CATEGORY_INGREDIENT_MAP = {
  'Momo': [
    'flour', 'minced meat', 'onion', 'garlic', 'ginger',
    'soy sauce', 'oil', 'cabbage', 'coriander', 'sesame oil',
  ],
  'Noodles': [
    'noodles', 'capsicum', 'carrot', 'onion', 'garlic',
    'soy sauce', 'oil', 'cabbage', 'bean sprouts', 'oyster sauce',
  ],
  'Burgers': [
    'bun', 'lettuce', 'tomato', 'onion', 'mayo',
    'cheese', 'oil', 'mustard', 'pickles', 'ketchup',
  ],
  'Main Course': [
    'rice', 'tomato', 'onion', 'garlic', 'ginger',
    'oil', 'cream', 'spices', 'salt', 'coriander',
  ],
  'Appetizers': [
    'oil', 'flour', 'salt', 'pepper', 'lemon',
    'garlic', 'chilli', 'cornstarch', 'soy sauce', 'vinegar',
  ],
  'Beverages': [
    'water', 'sugar', 'ice', 'milk', 'cream',
    'coffee', 'tea', 'lime', 'mint', 'soda water',
  ],
  'Desserts': [
    'flour', 'sugar', 'butter', 'eggs', 'milk',
    'cream', 'vanilla', 'chocolate', 'cocoa powder', 'baking powder',
  ],
  'Breakfast': [
    'eggs', 'bread', 'butter', 'milk', 'salt',
    'pepper', 'oil', 'cheese', 'tomato', 'onion',
  ],
  'Snacks': [
    'oil', 'salt', 'flour', 'potato', 'spices',
    'chilli powder', 'cumin', 'coriander', 'lemon', 'garlic',
  ],
  'Vegetarian': [
    'vegetables', 'oil', 'salt', 'spices', 'tomato',
    'onion', 'garlic', 'ginger', 'coriander', 'turmeric',
  ],
  'Non-Vegetarian': [
    'meat', 'oil', 'salt', 'spices', 'tomato',
    'onion', 'garlic', 'ginger', 'coriander', 'yogurt',
  ],
  'Vegan': [
    'vegetables', 'tofu', 'oil', 'salt', 'spices',
    'soy sauce', 'coconut milk', 'lemon', 'garlic', 'ginger',
  ],
};

// ── Ingredient frequency aggregator ──────────────────────────────────────────
const aggregateIngredients = (menuItems) => {
  const freq    = {};   // ingredientName → { count, sources: [dishName, ...] }

  menuItems.forEach(item => {
    const key = item.menuGroup || item.category || 'Main Course';

    // 1. Category-based canonical list
    const canonical = CATEGORY_INGREDIENT_MAP[key] || CATEGORY_INGREDIENT_MAP['Main Course'];
    canonical.forEach(ing => {
      if (!freq[ing]) freq[ing] = { count: 0, sources: [] };
      freq[ing].count++;
      if (!freq[ing].sources.includes(item.name)) freq[ing].sources.push(item.name);
    });

    // 2. Tokens mined from the item's own fields
    extractIngredientTokens(item).forEach(token => {
      if (!freq[token]) freq[token] = { count: 0, sources: [] };
      freq[token].count++;
      if (!freq[token].sources.includes(item.name)) freq[token].sources.push(item.name);
    });
  });

  return freq;
};

// ── Priority classifier ───────────────────────────────────────────────────────
const classifyPriority = (count, totalDishes) => {
  if (totalDishes === 0) return 'low';
  const ratio = count / totalDishes;
  if (ratio >= 0.6) return 'high';
  if (count >= 2)   return 'medium';
  return 'low';
};

// ── Stock cross-reference ─────────────────────────────────────────────────────
const crossReferenceStock = (ingredientName, dbIngredients) => {
  const normalized = ingredientName.toLowerCase().trim();
  const match = dbIngredients.find(dbIng => {
    const name = (dbIng.ingredientName || '').toLowerCase().trim();
    return name === normalized
      || name.includes(normalized)
      || normalized.includes(name);
  });
  if (!match) return { inStock: null, stockStatus: 'unknown', stockQuantity: null, reorderLevel: null };

  const qty     = match.stockQuantity  || 0;
  const reorder = match.reorderLevel   || 0;
  let stockStatus = 'sufficient';
  if (qty === 0)        stockStatus = 'out_of_stock';
  else if (qty <= reorder) stockStatus = 'low_stock';

  return {
    inStock:       true,
    stockStatus,
    stockQuantity: qty,
    reorderLevel:  reorder,
    unit:          match.unit          || '',
    supplier:      match.supplier      || '',
    costPerUnit:   match.costPerUnit   || 0,
    _id:           match._id,
  };
};

// ── Main controller ───────────────────────────────────────────────────────────
exports.getIngredientRecommendations = async (req, res) => {
  try {
    const { itemIds = '', mode = 'full' } = req.query;

    const allItems   = await MenuItem.find({ status: 'Active' }).lean();
    const dbIngredients = await Ingredient.find({ status: 'Active' }).lean();

    if (!allItems.length) {
      return res.status(200).json({ status: 'success', data: { ingredients: [], summary: {} } });
    }

    // Determine which menu items to analyse
    const requestedIds = itemIds.split(',').map(id => id.trim()).filter(Boolean);
    const menuItems    = requestedIds.length
      ? allItems.filter(item => requestedIds.includes(String(item._id)))
      : allItems;

    if (!menuItems.length) {
      return res.status(200).json({ status: 'success', data: { ingredients: [], summary: {} } });
    }

    // Aggregate frequencies
    const freq = aggregateIngredients(menuItems);
    const totalDishes = menuItems.length;

    // Build output list
    const ingredients = Object.entries(freq)
      .map(([name, data]) => {
        const priority  = classifyPriority(data.count, totalDishes);
        const stockInfo = crossReferenceStock(name, dbIngredients);

        return {
          name,
          frequency:    data.count,
          totalDishes,
          usedInDishes: data.sources,
          ratio:        parseFloat((data.count / totalDishes).toFixed(2)),
          priority,
          ...stockInfo,
          // Alert when high-priority ingredient is low/out
          alert: priority === 'high' && ['low_stock', 'out_of_stock'].includes(stockInfo.stockStatus),
        };
      })
      .sort((a, b) => {
        // Sort: alerts first, then by priority, then by frequency
        if (a.alert && !b.alert) return -1;
        if (!a.alert && b.alert)  return 1;
        const pOrder = { high: 0, medium: 1, low: 2 };
        if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
        return b.frequency - a.frequency;
      });

    // Summary stats
    const summary = {
      totalIngredients:    ingredients.length,
      highPriority:        ingredients.filter(i => i.priority === 'high').length,
      mediumPriority:      ingredients.filter(i => i.priority === 'medium').length,
      lowPriority:         ingredients.filter(i => i.priority === 'low').length,
      alertCount:          ingredients.filter(i => i.alert).length,
      outOfStock:          ingredients.filter(i => i.stockStatus === 'out_of_stock').length,
      lowStock:            ingredients.filter(i => i.stockStatus === 'low_stock').length,
      sharedIngredients:   ingredients.filter(i => i.usedInDishes.length > 1).length,
      analysedDishes:      totalDishes,
    };

    return res.status(200).json({
      status: 'success',
      data:   { ingredients, summary, menuItems: menuItems.map(m => ({ _id: m._id, name: m.name, menuGroup: m.menuGroup, category: m.category })) },
    });
  } catch (error) {
    console.error('Ingredient recommendation error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to generate ingredient recommendations: ' + error.message });
  }
};

// ── Quick summary (for dashboard widget) ─────────────────────────────────────
exports.getIngredientSummary = async (req, res) => {
  try {
    const allItems      = await MenuItem.find({ status: 'Active' }).lean();
    const dbIngredients = await Ingredient.find({ status: 'Active' }).lean();

    const freq = aggregateIngredients(allItems);
    const totalDishes = allItems.length;

    const ingredients = Object.entries(freq).map(([name, data]) => ({
      name,
      frequency: data.count,
      priority:  classifyPriority(data.count, totalDishes),
      ...crossReferenceStock(name, dbIngredients),
    }));

    return res.status(200).json({
      status: 'success',
      data: {
        alerts:    ingredients.filter(i => i.priority === 'high' && ['low_stock','out_of_stock'].includes(i.stockStatus)),
        topNeeded: ingredients.filter(i => i.priority === 'high').slice(0, 10),
        totalMenuItems: allItems.length,
      },
    });
  } catch (error) {
    console.error('Ingredient summary error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};