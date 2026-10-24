const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Xem danh sách và chi tiết sản phẩm (Công khai)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Tạo sản phẩm mới (Yêu cầu đăng nhập JWT)
router.post('/', verifyToken, productController.createProduct);

module.exports = router;