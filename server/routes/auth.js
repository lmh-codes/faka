const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// 生成邀请码
function generateInviteCode() {
  return 'INV' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, inviteCode } = req.body;

    // 检查用户是否存在
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: '用户名或邮箱已存在' });
    }

    // 处理推荐关系
    let parentId = null;
    let grandparentId = null;

    if (inviteCode) {
      const [parent] = await db.query(
        'SELECT id, parent_id FROM users WHERE invite_code = ?',
        [inviteCode]
      );

      if (parent.length > 0) {
        parentId = parent[0].id;
        grandparentId = parent[0].parent_id;
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    const userInviteCode = generateInviteCode();

    // 创建用户
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, parent_id, grandparent_id, invite_code) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, parentId, grandparentId, userInviteCode]
    );

    res.json({
      success: true,
      message: '注册成功',
      data: { userId: result.insertId, inviteCode: userInviteCode }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '注册失败' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const user = users[0];

    if (user.status === 'banned') {
      return res.status(403).json({ success: false, message: '账号已被禁用' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          balance: user.balance,
          inviteCode: user.invite_code
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '登录失败' });
  }
});

module.exports = router;
