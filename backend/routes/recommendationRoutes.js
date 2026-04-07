// backend/routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

// GET /api/recommendations?itemIds=id1,id2&limit=5&mode=both
router.get('/', recommendationController.getRecommendations);

// GET /api/recommendations/similar/:id
router.get('/similar/:id', recommendationController.getSimilarItems);

module.exports = router;