const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 获取商品分类
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE status = "active" ORDER BY sort_order ASC'
    );
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取分类失败' });
  }
});

// 获取商品列表
router.get('/', async (req, res) => {
  try {
    const { categoryId, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name,
      (SELECT COUNT(*) FROM cards WHERE product_id = p.id AND status = 'unsold') as available_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
    `;
    const params = [];

    if (categoryId) {
      query += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY p.sort_order DESC, p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.query(query, params);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE status = "active"';
    if (categoryId) {
      countQuery += ' AND category_id = ?';
      const [countResult] = await db.query(countQuery, [categoryId]);
      var total = countResult[0].total;
    } else {
      const [countResult] = await db.query(countQuery);
      var total = countResult[0].total;
    }

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '获取商品失败' });
  }
});

// 获取商品详情
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name,
      (SELECT COUNT(*) FROM cards WHERE product_id = p.id AND status = 'unsold') as available_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.status = 'active'`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: '商品不存在' });
    }

    res.json({ success: true, data: products[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取商品详情失败' });
  }
});

module.exports = router;
