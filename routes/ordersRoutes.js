const express = require('express')
const ordersController = require('../controller/ordersController')
const router = express.Router()

router.post('/orders', ordersController.orders)
router.get('/showAllOrders', ordersController.showAllOrders)
router.get('/showOrdersByUser/:userId', ordersController.showOrdersByUser)

module.exports = router