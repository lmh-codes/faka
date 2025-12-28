const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// 生成订单号
function generateOrderNo() {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// 创建订单
router.post('/create', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { productId, quantity, contactEmail, userId } = req.body;

    // 获取商品信息
    const [products] = await connection.query(
      'SELECT * FROM products WHERE id = ? AND status = "active"',
      [productId]
    );

    if (products.length === 0) {
      throw new Error('商品不存在');
    }

    const product = products[0];

    // 检查库存
    const [cards] = await connection.query(
      'SELECT COUNT(*) as count FROM cards WHERE product_id = ? AND status = "unsold"',
      [productId]
    );

    if (cards[0].count < quantity) {
      throw new Error('库存不足');
    }

    const totalPrice = product.price * quantity;
    const orderNo = generateOrderNo();

    // 创建订单
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_no, user_id, product_id, product_name, quantity, total_price, contact_email, payment_status, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [orderNo, userId || null, productId, product.name, quantity, totalPrice, contactEmail]
    );

    await connection.commit();

    res.json({
      success: true,
      message: '订单创建成功',
      data: {
        orderId: orderResult.insertId,
        orderNo,
        totalPrice
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(400).json({ success: false, message: error.message || '创建订单失败' });
  } finally {
    connection.release();
  }
});

// 查询订单
router.get('/query/:orderNo', async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE order_no = ?',
      [req.params.orderNo]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    const order = orders[0];

    // 如果订单已支付，获取卡密
    if (order.payment_status === 'paid') {
      const [cards] = await db.query(
        'SELECT card_number, card_password FROM cards WHERE order_id = ?',
        [order.id]
      );
      order.cards = cards;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: '查询订单失败' });
  }
});

// 获取用户订单列表
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? 
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取订单列表失败' });
  }
});

module.exports = router;
