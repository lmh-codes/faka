const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// 获取分销统计
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // 获取下级用户数
    const [level1] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE parent_id = ?',
      [req.user.id]
    );

    const [level2] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE grandparent_id = ?',
      [req.user.id]
    );

    // 获取佣金统计
    const [commissions] = await db.query(
      `SELECT 
        SUM(CASE WHEN level = 1 THEN amount ELSE 0 END) as level1_total,
        SUM(CASE WHEN level = 2 THEN amount ELSE 0 END) as level2_total,
        SUM(amount) as total_commission
       FROM commissions WHERE user_id = ?`,
      [req.user.id]
    );

    // 获取用户信息
    const [users] = await db.query(
      'SELECT balance, total_commission, invite_code FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        inviteCode: users[0].invite_code,
        balance: users[0].balance,
        totalCommission: users[0].total_commission,
        level1Count: level1[0].count,
        level2Count: level2[0].count,
        level1Commission: commissions[0].level1_total || 0,
        level2Commission: commissions[0].level2_total || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '获取统计失败' });
  }
});

// 获取佣金记录
router.get('/commissions', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [commissions] = await db.query(
      `SELECT c.*, o.order_no, o.product_name, u.username as from_username
       FROM commissions c
       LEFT JOIN orders o ON c.order_id = o.id
       LEFT JOIN users u ON c.from_user_id = u.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM commissions WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        commissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取佣金记录失败' });
  }
});

// 获取下级用户列表
router.get('/team', authMiddleware, async (req, res) => {
  try {
    const { level = 1 } = req.query;

    let query;
    if (level == 1) {
      query = 'SELECT id, username, email, created_at FROM users WHERE parent_id = ?';
    } else {
      query = 'SELECT id, username, email, created_at FROM users WHERE grandparent_id = ?';
    }

    const [users] = await db.query(query, [req.user.id]);

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取团队列表失败' });
  }
});

module.exports = router;
