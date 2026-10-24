const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Các đường dẫn thao tác đơn hàng (Bắt buộc đính kèm JWT Token)
router.post('/', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);

module.exports = router;