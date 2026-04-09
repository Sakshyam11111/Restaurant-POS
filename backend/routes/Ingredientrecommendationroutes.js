// backend/routes/ingredientRecommendationRoutes.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/ingredientRecommendationController');

// GET /api/ingredient-recommendations?itemIds=id1,id2&mode=full
// Returns full ingredient breakdown for selected menu items.
// If itemIds is omitted, analyses the entire active menu.
router.get('/', ctrl.getIngredientRecommendations);

// GET /api/ingredient-recommendations/summary
// Lightweight summary for dashboard widgets — just alerts + top needed.
router.get('/summary', ctrl.getIngredientSummary);

module.exports = router;