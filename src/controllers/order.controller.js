const prisma = require('../config/prisma');

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.uid; // Lấy từ Token JWT đã xác thực
    const { items } = req.body; // Dạng array: [{ pid: 1, qty: 2 }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Đơn hàng phải chứa ít nhất 1 sản phẩm' });
    }

    // Dùng Transaction để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      // 1. Tạo Order
      const newOrder = await tx.order.create({
        data: { uid: userId }
      });

      let orderDetailsData = [];

      // 2. Kiểm tra tồn kho và trừ số lượng từng sản phẩm
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { pid: item.pid }
        });

        if (!product) {
          throw new Error(`Sản phẩm với ID ${item.pid} không tồn tại`);
        }

        if (product.quantity < item.qty) {
          throw new Error(`Sản phẩm "${product.pname}" không đủ số lượng tồn kho (Còn lại: ${product.quantity})`);
        }

        // Trừ tồn kho
        await tx.product.update({
          where: { pid: item.pid },
          data: { quantity: product.quantity - item.qty }
        });

        orderDetailsData.push({
          oid: newOrder.oid,
          pid: item.pid,
          qty: item.qty,
          unit_price: product.price
        });
      }

      // 3. Tạo OrderDetail
      await tx.orderDetail.createMany({
        data: orderDetailsData
      });

      // 4. Khởi tạo Shipment
      await tx.shipment.create({
        data: {
          oid: newOrder.oid,
          status: 'PENDING'
        }
      });

      return newOrder;
    });

    res.status(201).json({ message: 'Đặt hàng thành công!', orderId: result.oid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xem danh sách đơn hàng của tôi
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.uid;

    const orders = await prisma.order.findMany({
      where: { uid: userId },
      include: {
        details: {
          include: { product: true }
        },
        shipments: true
      }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};