const express = require('express');
const router = express.Router();
const orders = require('../controllers/stock.controllers');

router.post('/createLocation', (req, res) => {
    return orders.createLocation(req, res);
});

router.post('/createProduct', (req, res) => {
    console.log(req.body)
    return orders.createProduct(req, res);
});

module.exports = router;