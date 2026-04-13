const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Ingredient = require('../models/Ingredient');
const csvData = require('../services/csvDataService');

csvData.load().catch(err => console.warn('CSV pre-load warning:', err.message));

const resolveStock = async (ingredientName, dbIngredients) => {
  const csvStock = csvData.getStockInfo(ingredientName);
  if (csvStock) {
    const qty = csvStock.stockQty || 0;
    const reorder = csvStock.reorderLevel || 0;
    return {
      source: 'csv',
      stockStatus: qty === 0 ? 'out_of_stock' : qty <= reorder ? 'low_stock' : 'sufficient',
      stockQuantity: qty,
      reorderLevel: reorder,
      unit: csvStock.unit || '',
      supplier: '',
      costPerUnit: csvStock.costPerUnit || 0,
    };
  }

  const n = ingredientName.toLowerCase().trim();
  const match = dbIngredients.find(d => {
    const dn = (d.ingredientName || '').toLowerCase().trim();
    return dn === n || dn.includes(n) || n.includes(dn);
  });
  if (match) {
    const qty = match.stockQuantity || 0;
    const reorder = match.reorderLevel || 0;
    return {
      source: 'db',
      stockStatus: qty === 0 ? 'out_of_stock' : qty <= reorder ? 'low_stock' : 'sufficient',
      stockQuantity: qty,
      reorderLevel: reorder,
      unit: match.unit || '',
      supplier: match.supplier || '',
      costPerUnit: match.costPerUnit || 0,
    };
  }

  return {
    source: 'unknown',
    stockStatus: 'unknown',
    stockQuantity: null,
    reorderLevel: null,
    unit: '',
    supplier: '',
    costPerUnit: 0,
  };
};

const classifyPriority = (csvFrequency, usedInDishCount, totalDishes) => {
  const ratio = usedInDishCount / Math.max(totalDishes, 1);
  if (ratio >= 0.6 || csvFrequency >= 8) return 'critical';
  if (ratio >= 0.35 || csvFrequency >= 4) return 'high';
  if (ratio >= 0.15 || csvFrequency >= 2) return 'medium';
  return 'low';
};

const makeSummary = (ingredients, totalDishes) => {
  const alertCount = ingredients.filter(i => i.alert).length;
  const outCount = ingredients.filter(i => i.stockStatus === 'out_of_stock').length;
  const critCount = ingredients.filter(i => i.priority === 'critical').length;

  if (alertCount > 0) {
    return `${alertCount} ingredient${alertCount > 1 ? 's' : ''} need immediate attention across ${totalDishes} dish${totalDishes > 1 ? 'es' : ''}${outCount > 0 ? ` — ${outCount} out of stock` : ' (low stock detected)'}.`;
  }
  return `${ingredients.length} ingredients identified across ${totalDishes} dish${totalDishes > 1 ? 'es' : ''}. All stock levels look healthy.`;
};

router.post('/ingredient-analysis', async (req, res) => {
  try {
    const { menuItems } = req.body;

    if (!Array.isArray(menuItems) || menuItems.length === 0) {
      return res.status(400).json({ status: 'error', message: 'menuItems array is required' });
    }

    if (!csvData.loaded) await csvData.load();

    const dbIngredients = await Ingredient.find({ status: 'Active' }).lean();

    const totalDishes = menuItems.length;

    const freq = {};

    for (const item of menuItems) {
      const menuGroup = item.menuGroup || item.category || 'General';

      const csvIngredients = csvData.getIngredientsForGroup(menuGroup, 25);
      const dishIngredients = csvData.getIngredientsForDish(item.name);

      const allForThisDish = [
        ...csvIngredients.map(i => ({ name: i.name, csvFreq: i.frequency })),
        ...dishIngredients.map(n => ({ name: n, csvFreq: 1 })),
      ];

      const seen = new Set();
      for (const { name, csvFreq } of allForThisDish) {
        if (seen.has(name)) continue;
        seen.add(name);

        if (!freq[name]) freq[name] = { csvFrequency: 0, usedInDishes: new Set() };
        freq[name].csvFrequency += csvFreq;
        freq[name].usedInDishes.add(item.name);
      }

      const extraTokens = [item.addOns, item.menuSubGroup].join(' ')
        .toLowerCase().replace(/[^a-z0-9\s,]/g, '')
        .split(/[\s,]+/).filter(t => t.length > 2);

      for (const token of extraTokens) {
        if (!freq[token]) freq[token] = { csvFrequency: 0, usedInDishes: new Set() };
        freq[token].usedInDishes.add(item.name);
      }
    }

    const PRIORITY_NOTES = {
      critical: 'Core ingredient used across the majority of your menu',
      high: 'Important ingredient needed for several key dishes',
      medium: 'Used by a notable portion of your selection',
      low: 'Specific to a smaller number of dishes',
    };

    const ingredientRows = await Promise.all(
      Object.entries(freq).map(async ([name, data]) => {
        const usedInDishes = Array.from(data.usedInDishes);
        const priority = classifyPriority(data.csvFrequency, usedInDishes.length, totalDishes);
        const stock = await resolveStock(name, dbIngredients);
        const alert = (priority === 'critical' || priority === 'high') &&
                      ['out_of_stock', 'low_stock'].includes(stock.stockStatus);

        return {
          name,
          usedIn: usedInDishes,
          csvFrequency: data.csvFrequency,
          priority,
          aiReason: PRIORITY_NOTES[priority],
          aiNote: stock.stockStatus === 'out_of_stock' ? 'Order immediately — out of stock'
                : stock.stockStatus === 'low_stock' ? 'Reorder soon — below reorder level'
                : stock.stockStatus === 'sufficient' ? 'Stock level is adequate'
                : 'Not tracked in your inventory',
          stockStatus: stock.stockStatus,
          stockQuantity: stock.stockQuantity,
          reorderLevel: stock.reorderLevel,
          unit: stock.unit,
          supplier: stock.supplier,
          costPerUnit: stock.costPerUnit,
          stockSource: stock.source,
          alert,
        };
      })
    );

    const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
    ingredientRows.sort((a, b) => {
      if (a.alert !== b.alert) return b.alert - a.alert;
      const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pd !== 0) return pd;
      return b.csvFrequency - a.csvFrequency;
    });

    return res.status(200).json({
      status: 'success',
      data: {
        ingredients: ingredientRows,
        summary: makeSummary(ingredientRows, totalDishes),
        meta: {
          totalDishes,
          csvGroupsAvailable: csvData.groupIngMap.size,
          csvDishCount: csvData.dishes.length,
          csvStockItems: csvData.stockItems.length,
        },
      },
    });

  } catch (err) {
    console.error('Ingredient analysis error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to analyse ingredients: ' + err.message });
  }
});

router.get('/csv-status', async (req, res) => {
  if (!csvData.loaded) await csvData.load().catch(() => {});
  res.json({ status: 'success', data: csvData.status() });
});

router.get('/ingredients-for-group', async (req, res) => {
  if (!csvData.loaded) await csvData.load().catch(() => {});
  const group = req.query.group || '';
  const list = csvData.getIngredientsForGroup(group, 30);
  res.json({ status: 'success', data: { group, ingredients: list } });
});

module.exports = router;