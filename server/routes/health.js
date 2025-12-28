const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 健康检查接口
router.get('/health', async (req, res) => {
  try {
    // 检查数据库连接
    await db.query('SELECT 1');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

module.exports = router;
