// src/routes/stocks.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getAllStocks);
router.get('/search', stockController.searchStocks);
router.get('/:symbol', stockController.getStockBySymbol);

module.exports = router;