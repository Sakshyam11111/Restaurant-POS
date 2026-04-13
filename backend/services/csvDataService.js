const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CSV_DIR = path.join(__dirname, '..', 'data', 'csv');

const norm = (obj, keys) => {
  const lower = {};
  Object.keys(obj).forEach(k => { lower[k.toLowerCase().trim().replace(/\s+/g, '_')] = obj[k]; });
  const result = {};
  keys.forEach(([canonical, variants]) => {
    for (const v of variants) {
      if (lower[v] !== undefined) { result[canonical] = lower[v]; break; }
    }
    if (result[canonical] === undefined) result[canonical] = '';
  });
  return result;
};

const DISH_KEYS = [
  ['dishName',     ['dish_name', 'name', 'item', 'food_name']],
  ['ingredients',  ['ingredients_used', 'ingredients', 'ingredient_list', 'items']],
  ['price',        ['price', 'cost', 'rate']],
  ['timeConsumed', ['time_consumed', 'time', 'prep_time', 'cooking_time']],
  ['menuGroup',    ['menu_group', 'category', 'group', 'type', 'menu_type']],
];

const ING_KEYS = [
  ['name',         ['ingredient_name', 'name', 'ingredient', 'item']],
  ['unit',         ['unit', 'units', 'uom', 'measure']],
  ['category',     ['category', 'type', 'group']],
  ['costPerUnit',  ['cost_per_unit', 'cost', 'price', 'unit_cost']],
  ['stockQty',     ['stock_quantity', 'stock', 'quantity', 'qty', 'on_hand']],
  ['reorderLevel', ['reorder_level', 'reorder', 'min_stock', 'reorder_point']],
  ['usageNotes',   ['usage_notes', 'notes', 'remarks', 'description']],
];

const readCsv = (filePath, keySpec) =>
  new Promise((resolve) => {
    if (!fs.existsSync(filePath)) { resolve([]); return; }
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', row => rows.push(norm(row, keySpec)))
      .on('end', () => resolve(rows))
      .on('error', () => resolve([]));
  });

const tokenise = str =>
  (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s,]/g, '')
    .split(/[,]+/)
    .map(t => t.trim())
    .filter(t => t.length > 1);

class CsvDataService {
  constructor() {
    this.dishes = [];
    this.stockItems = [];
    this.groupIngMap = new Map();
    this.stockMap = new Map();
    this.dishIngMap = new Map();
    this.allIngredients = new Set();
    this.loaded = false;
    this._promise = null;
  }

  async load() {
    if (this.loaded) return this;
    if (this._promise) return this._promise;
    this._promise = this._loadAll().then(() => { this.loaded = true; return this; });
    return this._promise;
  }

  async _loadAll() {
    const dishFiles = ['A', 'B', 'C', 'D', 'E'].map(
      l => path.join(CSV_DIR, `restaurant_set_${l}.csv`)
    );
    const ingFile = path.join(CSV_DIR, 'restaurant_set_F.csv');

    const dishRows = (
      await Promise.all(dishFiles.map(f => readCsv(f, DISH_KEYS)))
    ).flat();

    for (const row of dishRows) {
      const name = (row.dishName || '').trim();
      if (!name) continue;

      const ingredients = tokenise(row.ingredients);
      const menuGroup = (row.menuGroup || 'General').trim();
      const price = parseFloat(row.price) || 0;
      const timeConsumed = parseInt(row.timeConsumed) || 0;

      this.dishes.push({ dishName: name, ingredients, menuGroup, price, timeConsumed });

      this.dishIngMap.set(name.toLowerCase(), ingredients);

      if (!this.groupIngMap.has(menuGroup)) this.groupIngMap.set(menuGroup, new Map());
      const freq = this.groupIngMap.get(menuGroup);
      ingredients.forEach(ing => {
        freq.set(ing, (freq.get(ing) || 0) + 1);
        this.allIngredients.add(ing);
      });
    }

    const ingRows = await readCsv(ingFile, ING_KEYS);
    for (const row of ingRows) {
      const name = (row.name || '').trim().toLowerCase();
      if (!name) continue;
      const item = {
        name,
        unit: row.unit,
        category: row.category,
        costPerUnit: parseFloat(row.costPerUnit) || 0,
        stockQty: parseFloat(row.stockQty) || 0,
        reorderLevel: parseFloat(row.reorderLevel) || 0,
        usageNotes: row.usageNotes,
      };
      this.stockItems.push(item);
      this.stockMap.set(name, item);
    }

    console.log(
      `✅ CSV loaded: ${this.dishes.length} dishes across ` +
      `${this.groupIngMap.size} groups, ${this.stockItems.length} stock ingredients`
    );
  }

  getIngredientsForGroup(menuGroup, topN = 20) {
    if (!this.loaded) return [];
    const freq = this.groupIngMap.get(menuGroup);
    if (!freq) {
      for (const [key, val] of this.groupIngMap.entries()) {
        const kl = key.toLowerCase();
        const gl = menuGroup.toLowerCase();
        if (kl.includes(gl) || gl.includes(kl)) {
          return this._freqToList(val, topN);
        }
      }
      return [];
    }
    return this._freqToList(freq, topN);
  }

  _freqToList(freqMap, topN) {
    return Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([name, frequency]) => ({ name, frequency }));
  }

  getIngredientSetForGroup(menuGroup) {
    const list = this.getIngredientsForGroup(menuGroup, 100);
    return new Set(list.map(i => i.name));
  }

  getStockInfo(ingredientName) {
    if (!this.loaded || !ingredientName) return null;
    const key = ingredientName.toLowerCase().trim();

    if (this.stockMap.has(key)) return this.stockMap.get(key);

    for (const [name, info] of this.stockMap.entries()) {
      if (name.includes(key) || key.includes(name)) return info;
    }
    return null;
  }

  getIngredientsForDish(dishName) {
    if (!this.loaded || !dishName) return [];
    const key = dishName.toLowerCase().trim();
    if (this.dishIngMap.has(key)) return this.dishIngMap.get(key);
    for (const [name, ings] of this.dishIngMap.entries()) {
      if (name.includes(key) || key.includes(name)) return ings;
    }
    return [];
  }

  getDishesWithIngredient(ingredientName) {
    if (!this.loaded) return [];
    const key = ingredientName.toLowerCase().trim();
    return this.dishes.filter(d =>
      d.ingredients.some(i => i.includes(key) || key.includes(i))
    );
  }

  getFeatureTokens(menuGroup, dishName = '') {
    const byDish = this.getIngredientsForDish(dishName);
    const byGroup = this.getIngredientsForGroup(menuGroup, 15).map(i => i.name);
    return Array.from(new Set([...byDish, ...byGroup]));
  }

  status() {
    return {
      loaded: this.loaded,
      dishes: this.dishes.length,
      groups: this.groupIngMap.size,
      stockItems: this.stockItems.length,
      ingredients: this.allIngredients.size,
    };
  }
}

module.exports = new CsvDataService();