const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// 获取用户信息
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, balance, total_commission, invite_code, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取用户信息失败' });
  }
});

// 申请提现
router.post('/withdraw', authMiddleware, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { amount, accountType, accountInfo } = req.body;

    // 获取用户余额
    const [users] = await connection.query(
      'SELECT balance FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users[0].balance < amount) {
      throw new Error('余额不足');
    }

    const minWithdrawal = parseFloat(process.env.MIN_WITHDRAWAL || 10);
    if (amount < minWithdrawal) {
      throw new Error(`最低提现金额为 ${minWithdrawal} 元`);
    }

    // 创建提现申请
    await connection.query(
      'INSERT INTO withdrawals (user_id, amount, account_type, account_info, status) VALUES (?, ?, ?, ?, "pending")',
      [req.user.id, amount, accountType, accountInfo]
    );

    // 扣除余额
    await connection.query(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [amount, req.user.id]
    );

    await connection.commit();

    res.json({ success: true, message: '提现申请已提交' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ success: false, message: error.message || '提现申请失败' });
  } finally {
    connection.release();
  }
});

// 获取提现记录
router.get('/withdrawals', authMiddleware, async (req, res) => {
  try {
    const [withdrawals] = await db.query(
      'SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({ success: true, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取提现记录失败' });
  }
});

module.exports = router;
