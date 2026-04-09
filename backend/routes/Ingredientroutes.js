const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/Ingredientcontroller');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       ingredientController.getIngredients);
router.get('/:id',    ingredientController.getIngredientById);
router.post('/',   protect, ingredientController.createIngredient);
router.put('/:id', protect, ingredientController.updateIngredient);
router.delete('/:id', protect, ingredientController.deleteIngredient);

module.exports = router;