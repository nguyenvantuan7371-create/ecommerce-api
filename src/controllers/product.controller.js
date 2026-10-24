const prisma = require('../config/prisma');

// 1. Tạo sản phẩm mới (Cần đăng nhập)
exports.createProduct = async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;

    if (!pname || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ pname, price, quantity' });
    }

    const newProduct = await prisma.product.create({
      data: {
        pname,
        price: parseFloat(price),
        quantity: parseInt(quantity)
      }
    });

    res.status(201).json({ message: 'Tạo sản phẩm thành công', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Lấy danh sách tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Lấy chi tiết 1 sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { pid: parseInt(id) }
    });

    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};