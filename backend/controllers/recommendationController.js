const MenuItem = require('../models/MenuItem');
const { getReadyCF } = require('../collaborativeFilter');
const csvData = require('../services/csvDataService');

csvData.load().catch(err => console.warn('CSV pre-load warning:', err.message));

const buildFeatureTokens = (item) => {
  const baseParts = [
    item.name || '',
    item.menuGroup || '',
    item.menuSubGroup || '',
    item.category || '',
    item.addOns || '',
  ];

  const baseTokens = baseParts
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 1);

  let csvTokens = [];
  if (csvData.loaded) {
    csvTokens = csvData.getFeatureTokens(item.menuGroup || item.category || '', item.name || '');
  }

  return Array.from(new Set([...baseTokens, ...csvTokens]));
};

const termFrequency = (tokens) => {
  const tf = {};
  const len = tokens.length || 1;
  tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
  Object.keys(tf).forEach(k => { tf[k] /= len; });
  return tf;
};

const buildTfIdf = (items) => {
  const tokenSets = items.map(item => buildFeatureTokens(item));
  const N = items.length;

  const allTerms = new Set();
  tokenSets.forEach(tokens => tokens.forEach(t => allTerms.add(t)));

  const idf = {};
  allTerms.forEach(term => {
    const df = tokenSets.filter(tokens => tokens.includes(term)).length;
    idf[term] = Math.log((N + 1) / (df + 1)) + 1;
  });

  const docVectors = new Map();
  items.forEach((item, idx) => {
    const tf = termFrequency(tokenSets[idx]);
    const vector = {};
    Object.keys(tf).forEach(term => { vector[term] = tf[term] * (idf[term] || 0); });
    docVectors.set(String(item._id), vector);
  });

  return { docVectors, idf };
};

const cosineSimilarity = (vecA, vecB) => {
  const termsA = Object.keys(vecA);
  if (!termsA.length) return 0;

  let dot = 0, magA = 0, magB = 0;
  termsA.forEach(term => {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dot += a * b;
    magA += a * a;
  });
  Object.values(vecB).forEach(b => { magB += b * b; });

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
};

const COMPLEMENT_MAP = {
  'Main Course':    ['Beverages', 'Appetizers', 'Desserts'],
  'Appetizers':     ['Main Course', 'Beverages'],
  'Desserts':       ['Beverages'],
  'Beverages':      ['Main Course', 'Appetizers', 'Desserts', 'Snacks'],
  'Breakfast':      ['Beverages'],
  'Lunch':          ['Beverages', 'Desserts'],
  'Snacks':         ['Beverages'],
  'Specials':       ['Beverages', 'Desserts'],
  'Vegetarian':     ['Beverages', 'Desserts'],
  'Non-Vegetarian': ['Beverages', 'Main Course'],
  'Vegan':          ['Beverages', 'Desserts'],
  'Momo':           ['Beverages', 'Soups'],
  'Noodles':        ['Beverages'],
  'Burgers':        ['Beverages', 'Desserts'],
  'Pizza':          ['Beverages', 'Salads', 'Desserts'],
  'Pasta':          ['Beverages', 'Salads', 'Desserts'],
};

const priceRangeBonus = (targetPrice, candidatePrice) => {
  const ratio = Math.abs(targetPrice - candidatePrice) / (targetPrice || 1);
  return Math.max(0, 1 - ratio * 1.2);
};

const ingredientOverlapScore = (cartItems, candidate) => {
  if (!csvData.loaded) return 0;
  let total = 0;
  for (const cartItem of cartItems) {
    const cartIngs = new Set(csvData.getFeatureTokens(cartItem.menuGroup || '', cartItem.name || ''));
    const candIngs = csvData.getFeatureTokens(candidate.menuGroup || '', candidate.name || '');
    if (!cartIngs.size || !candIngs.length) continue;
    const overlap = candIngs.filter(i => cartIngs.has(i)).length;
    total += overlap / Math.max(candIngs.length, cartIngs.size, 1);
  }
  return total / Math.max(cartItems.length, 1);
};

exports.getRecommendations = async (req, res) => {
  try {
    const { itemIds = '', limit = 5, mode = 'both' } = req.query;

    const allItems = await MenuItem.find({ status: 'Active' }).lean();
    if (!allItems.length) {
      return res.status(200).json({ status: 'success', data: { recommendations: [] } });
    }

    const requestedIds = itemIds.split(',').map(id => id.trim()).filter(Boolean);

    if (!requestedIds.length) {
      const popular = allItems
        .sort(() => Math.random() - 0.5)
        .slice(0, Number(limit))
        .map(item => ({ ...item, score: 0.5, reason: 'Popular choice', matchType: 'popular' }));
      return res.status(200).json({ status: 'success', data: { recommendations: popular } });
    }

    const { docVectors } = buildTfIdf(allItems);

    const cartItems = allItems.filter(item => requestedIds.includes(String(item._id)));
    if (!cartItems.length) {
      return res.status(200).json({ status: 'success', data: { recommendations: [] } });
    }

    const candidates = allItems.filter(item => !requestedIds.includes(String(item._id)));
    const avgCartPrice = cartItems.reduce((s, i) => s + (i.price || 0), 0) / cartItems.length;
    const cartGroups = new Set(cartItems.map(i => i.menuGroup).filter(Boolean));
    const cartCategories = new Set(cartItems.map(i => i.category).filter(Boolean));
    const cartNames = cartItems.map(i => i.name);

    const complementTargets = new Set();
    cartGroups.forEach(g => (COMPLEMENT_MAP[g] || []).forEach(cg => complementTargets.add(cg)));
    cartCategories.forEach(c => (COMPLEMENT_MAP[c] || []).forEach(cg => complementTargets.add(cg)));

    const cf = await getReadyCF();
    const cfAvailable = cf.coverage() >= 3 && cf.totalOrders >= 5;
    const alpha = cfAvailable
      ? Math.min(0.55, 0.15 + (cf.totalOrders / 200) * 0.4)
      : 0;

    const scored = candidates.map(candidate => {
      const candVec = docVectors.get(String(candidate._id)) || {};

      let contentScore = 0;
      cartItems.forEach(cartItem => {
        const cartVec = docVectors.get(String(cartItem._id)) || {};
        contentScore += cosineSimilarity(cartVec, candVec);
      });
      contentScore /= cartItems.length;

      const ingOverlap = ingredientOverlapScore(cartItems, candidate) * 0.2;
      const priceBonus = priceRangeBonus(avgCartPrice, candidate.price || 0) * 0.15;
      const isComplement = complementTargets.has(candidate.menuGroup) || complementTargets.has(candidate.category);
      const complementBonus = isComplement ? 0.3 : 0;
      const sameGroupPenalty = cartGroups.has(candidate.menuGroup) ? 0.1 : 0;
      const cfScore = cfAvailable ? cf.score(candidate.name, cartNames) : 0;

      const contentFinal = contentScore * 0.4 + ingOverlap + complementBonus * 0.3 + priceBonus - sameGroupPenalty;
      const finalScore = Math.max(0, Math.min(1, alpha * cfScore + (1 - alpha) * contentFinal));

      let matchType, reason;
      if (cfScore > 0.3 && alpha > 0.2) {
        matchType = 'collaborative';
        reason = 'Frequently ordered together';
      } else if (ingOverlap > 0.3 && contentScore > 0.2) {
        matchType = 'similar';
        reason = 'Shares key ingredients with your cart';
      } else if (isComplement && contentScore < 0.3) {
        matchType = 'complement';
        reason = 'Pairs well with your order';
      } else if (contentScore > 0.25) {
        matchType = 'similar';
        reason = 'Similar to items in your cart';
      } else {
        matchType = 'popular';
        reason = 'You might enjoy this';
      }

      return {
        _id: candidate._id,
        name: candidate.name,
        price: candidate.price,
        category: candidate.category,
        menuGroup: candidate.menuGroup,
        menuSubGroup: candidate.menuSubGroup,
        image: candidate.image,
        status: candidate.status,
        score: finalScore,
        reason,
        matchType,
      };
    });

    const recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    return res.status(200).json({ status: 'success', data: { recommendations } });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to generate recommendations: ' + error.message });
  }
};

exports.getSimilarItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const allItems = await MenuItem.find({ status: 'Active' }).lean();
    const targetItem = allItems.find(i => String(i._id) === id);

    if (!targetItem) {
      return res.status(404).json({ status: 'error', message: 'Item not found' });
    }

    const { docVectors } = buildTfIdf(allItems);
    const targetVec = docVectors.get(id) || {};

    const similar = allItems
      .filter(i => String(i._id) !== id)
      .map(item => {
        const vec = docVectors.get(String(item._id)) || {};
        const score = cosineSimilarity(targetVec, vec);
        return {
          _id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
          menuGroup: item.menuGroup,
          image: item.image,
          score,
          reason: `Similar to ${targetItem.name}`,
          matchType: 'similar',
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    return res.status(200).json({ status: 'success', data: { recommendations: similar } });

  } catch (error) {
    console.error('Similar items error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};