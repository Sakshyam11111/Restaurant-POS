const express = require('express');
const router = express.Router();
const { getDemandForecast } = require('../controllers/demandForecastController');

router.get('/', getDemandForecast);

module.exports = router;