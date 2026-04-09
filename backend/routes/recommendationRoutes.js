const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

const { getReadyCF } = require('../collaborativeFilter');

router.get('/', recommendationController.getRecommendations);
router.get('/similar/:id', recommendationController.getSimilarItems);

router.post('/rebuild-cf', async (req, res) => {
  try {
    const { CollaborativeFilter } = require('../collaborativeFilter');
    const fresh = new CollaborativeFilter();
    await fresh.build();
    Object.assign(require('../collaborativeFilter').cfInstance || {}, fresh);
    res.json({ 
      status: 'success', 
      message: `CF rebuilt: ${fresh.coverage()} items, ${fresh.totalOrders} orders` 
    });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

module.exports = router;