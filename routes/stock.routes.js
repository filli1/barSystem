const express = require('express');
const router = express.Router();
const orders = require('../controllers/stock.controllers');

router.post('/createLocation', (req, res) => {
    return orders.createLocation(req, res);
});

router.get('/retrieveLocations', (req, res) => {
    return orders.retrieveLocations(req, res);
});

router.post('/createProduct', (req, res) => {
    console.log(req.body)
    return orders.createProduct(req, res);
});

router.get('/findByEAN', (req, res) => {
    return orders.findByEAN(req, res);
})

router.get('/retrieveProducts', (req, res) => {
    return orders.retrieveProducts(req, res);
})
router.post('/createStock', (req, res) => {
    return orders.createStock(req, res);
})

router.get('/getStock', (req, res) => {
    return orders.getStock(req, res);
});

router.put('/updateStock', (req, res) => {
    return orders.updateStock(req, res);
});

module.exports = router;