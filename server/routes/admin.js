const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 所有管理接口都需要管理员权限
router.use(authMiddleware, adminMiddleware);

// 获取统计数据
router.get('/stats', async (req, res) => {
  try {
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [orderCount] = await db.query('SELECT COUNT(*) as count FROM orders WHERE payment_status = "paid"');
    const [todayOrders] = await db.query(
      'SELECT COUNT(*) as count, SUM(total_price) as amount FROM orders WHERE DATE(created_at) = CURDATE() AND payment_status = "paid"'
    );
    const [totalRevenue] = await db.query('SELECT SUM(total_price) as amount FROM orders WHERE payment_status = "paid"');

    res.json({
      success: true,
      data: {
        userCount: userCount[0].count,
        orderCount: orderCount[0].count,
        todayOrders: todayOrders[0].count || 0,
        todayRevenue: todayOrders[0].amount || 0,
        totalRevenue: totalRevenue[0].amount || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取统计失败' });
  }
});

// 商品管理
router.get('/products', async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name,
       (SELECT COUNT(*) FROM cards WHERE product_id = p.id AND status = 'unsold') as available_stock
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取商品列表失败' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { categoryId, name, description, price, imageUrl, sortOrder } = req.body;

    const [result] = await db.query(
      'INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [categoryId, name, description, price, imageUrl || null, sortOrder || 0]
    );

    res.json({ success: true, message: '商品创建成功', data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建商品失败' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { categoryId, name, description, price, status, imageUrl, sortOrder } = req.body;

    await db.query(
      'UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, status = ?, image_url = ?, sort_order = ? WHERE id = ?',
      [categoryId, name, description, price, status, imageUrl, sortOrder, req.params.id]
    );

    res.json({ success: true, message: '商品更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新商品失败' });
  }
});

// 批量导入卡密
router.post('/cards/import', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { productId, cards } = req.body;

    for (const card of cards) {
      await connection.query(
        'INSERT INTO cards (product_id, card_number, card_password) VALUES (?, ?, ?)',
        [productId, card.number, card.password || null]
      );
    }

    await connection.commit();

    res.json({ success: true, message: `成功导入 ${cards.length} 张卡密` });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: '导入卡密失败' });
  } finally {
    connection.release();
  }
});

// 订单管理
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [orders] = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await db.query('SELECT COUNT(*) as total FROM orders');

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

// 用户管理
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, role, balance, total_commission, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取用户列表失败' });
  }
});

// 提现管理
router.get('/withdrawals', async (req, res) => {
  try {
    const [withdrawals] = await db.query(
      `SELECT w.*, u.username, u.email
       FROM withdrawals w
       LEFT JOIN users u ON w.user_id = u.id
       ORDER BY w.created_at DESC`
    );
    res.json({ success: true, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取提现列表失败' });
  }
});

router.put('/withdrawals/:id', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { status, remark } = req.body;
    const withdrawalId = req.params.id;

    const [withdrawals] = await connection.query(
      'SELECT * FROM withdrawals WHERE id = ?',
      [withdrawalId]
    );

    if (withdrawals.length === 0) {
      throw new Error('提现记录不存在');
    }

    const withdrawal = withdrawals[0];

    // 如果拒绝，退回余额
    if (status === 'rejected' && withdrawal.status === 'pending') {
      await connection.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [withdrawal.amount, withdrawal.user_id]
      );
    }

    await connection.query(
      'UPDATE withdrawals SET status = ?, remark = ?, processed_at = NOW() WHERE id = ?',
      [status, remark, withdrawalId]
    );

    await connection.commit();

    res.json({ success: true, message: '处理成功' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ success: false, message: error.message || '处理失败' });
  } finally {
    connection.release();
  }
});

module.exports = router;
