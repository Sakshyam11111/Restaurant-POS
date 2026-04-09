const Order = require('./models/Order');
const MenuItem = require('./models/MenuItem');

class CollaborativeFilter {
  constructor() {
    this.itemVectors = new Map();
    this.builtAt = null;
    this.totalOrders = 0;
  }

  async build() {
    const orders = await Order.find({ status: 'Served' })
      .select('items')
      .lean();

    this.totalOrders = orders.length;

    const coOccurrence = new Map();

    for (const order of orders) {
      const itemIds = [
        ...new Set(
          order.items
            .map(i => (typeof i === 'object' ? String(i.name) : String(i).split(' ×')[0].trim()))
            .filter(Boolean)
        ),
      ];

      for (let a = 0; a < itemIds.length; a++) {
        if (!coOccurrence.has(itemIds[a])) coOccurrence.set(itemIds[a], new Map());
        const vecA = coOccurrence.get(itemIds[a]);

        vecA.set(itemIds[a], (vecA.get(itemIds[a]) || 0) + 1);

        for (let b = a + 1; b < itemIds.length; b++) {
          vecA.set(itemIds[b], (vecA.get(itemIds[b]) || 0) + 1);

          if (!coOccurrence.has(itemIds[b])) coOccurrence.set(itemIds[b], new Map());
          coOccurrence.get(itemIds[b]).set(itemIds[a], (coOccurrence.get(itemIds[b]).get(itemIds[a]) || 0) + 1);
        }
      }
    }

    this.itemVectors = coOccurrence;
    this.builtAt = Date.now();

    console.log(`✅ CF matrix built: ${coOccurrence.size} items, ${orders.length} orders`);
    return this;
  }

  isStale(ttlMs = 10 * 60 * 1000) {
    return !this.builtAt || Date.now() - this.builtAt > ttlMs;
  }

  cosineSim(nameA, nameB) {
    const vecA = this.itemVectors.get(nameA);
    const vecB = this.itemVectors.get(nameB);
    if (!vecA || !vecB) return 0;

    let dot = 0, magA = 0, magB = 0;

    for (const [k, v] of vecA) {
      magA += v * v;
      const bVal = vecB.get(k) || 0;
      dot += v * bVal;
    }
    for (const [, v] of vecB) magB += v * v;

    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }

  score(candidateName, cartNames) {
    if (!cartNames.length || this.totalOrders < 5) return 0;

    let total = 0;
    let counted = 0;

    for (const cartName of cartNames) {
      const s = this.cosineSim(candidateName, cartName);
      if (s > 0) { total += s; counted++; }
    }

    const avgSim = counted > 0 ? total / counted : 0;

    const selfCount = this.itemVectors.get(candidateName)?.get(candidateName) || 0;
    const popularityBonus = selfCount > 0 ? Math.log(1 + selfCount) / Math.log(1 + this.totalOrders) : 0;

    return avgSim * 0.85 + popularityBonus * 0.15;
  }

  coverage() {
    return this.itemVectors.size;
  }
}

const cfInstance = new CollaborativeFilter();

const getReadyCF = async () => {
  if (cfInstance.isStale()) await cfInstance.build();
  return cfInstance;
};

module.exports = { CollaborativeFilter, getReadyCF };