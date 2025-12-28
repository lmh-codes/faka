const express = require('express');
const router = express.Router();
const db = require('../config/database');
const CardPlatformAdapter = require('../utils/card-platforms');

// 创建支付
router.post('/create', async (req, res) => {
  try {
    const { orderNo, paymentMethod } = req.body;

    // 获取订单信息
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE order_no = ? AND payment_status = "pending"',
      [orderNo]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: '订单不存在或已支付' });
    }

    const order = orders[0];

    // 使用发卡平台适配器
    const adapter = new CardPlatformAdapter();
    
    // 检查支付方式是否支持
    const supportedMethods = adapter.getSupportedPaymentMethods();
    if (!supportedMethods.includes(paymentMethod)) {
      return res.status(400).json({ 
        success: false, 
        message: `当前平台不支持该支付方式，支持的方式: ${supportedMethods.join(', ')}` 
      });
    }

    // 创建支付
    const paymentData = await adapter.createPayment({
      orderNo: orderNo,
      amount: order.total_price,
      productName: order.product_name,
      paymentMethod: paymentMethod
    });

    res.json({
      success: true,
      data: paymentData,
      platform: adapter.getPlatformName()
    });
  } catch (error) {
    console.error('创建支付失败:', error);
    res.status(500).json({ success: false, message: error.message || '创建支付失败' });
  }
});

// 支付回调
router.post('/notify', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // 使用发卡平台适配器验证回调
    const adapter = new CardPlatformAdapter();
    const verifiedData = await adapter.verifyCallback(req.body);

    if (verifiedData.status !== 'success') {
      await connection.rollback();
      return res.send('fail');
    }

    // 获取订单
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE order_no = ? AND payment_status = "pending"',
      [verifiedData.orderNo]
    );

    if (orders.length === 0) {
      await connection.commit();
      return res.send('success');
    }

    const order = orders[0];
    const trade_no = verifiedData.tradeNo;

    // 更新订单状态
    await connection.query(
      `UPDATE orders SET payment_status = 'paid', status = 'completed', 
       trade_no = ?, paid_at = NOW() WHERE id = ?`,
      [trade_no, order.id]
    );

    // 分配卡密
    const [availableCards] = await connection.query(
      'SELECT id, card_number, card_password FROM cards WHERE product_id = ? AND status = "unsold" LIMIT ?',
      [order.product_id, order.quantity]
    );

    for (const card of availableCards) {
      await connection.query(
        'UPDATE cards SET status = "sold", order_id = ?, sold_at = NOW() WHERE id = ?',
        [order.id, card.id]
      );
    }

    // 更新商品销量
    await connection.query(
      'UPDATE products SET sales = sales + ? WHERE id = ?',
      [order.quantity, order.product_id]
    );

    // 处理分销佣金
    if (order.user_id) {
      const [user] = await connection.query(
        'SELECT parent_id, grandparent_id FROM users WHERE id = ?',
        [order.user_id]
      );

      if (user.length > 0 && user[0].parent_id) {
        // 一级佣金
        const level1Rate = parseFloat(process.env.LEVEL1_COMMISSION_RATE || 0.10);
        const level1Amount = order.total_price * level1Rate;

        await connection.query(
          'INSERT INTO commissions (user_id, order_id, amount, level, from_user_id) VALUES (?, ?, ?, 1, ?)',
          [user[0].parent_id, order.id, level1Amount, order.user_id]
        );

        await connection.query(
          'UPDATE users SET total_commission = total_commission + ?, balance = balance + ? WHERE id = ?',
          [level1Amount, level1Amount, user[0].parent_id]
        );

        // 二级佣金
        if (user[0].grandparent_id) {
          const level2Rate = parseFloat(process.env.LEVEL2_COMMISSION_RATE || 0.05);
          const level2Amount = order.total_price * level2Rate;

          await connection.query(
            'INSERT INTO commissions (user_id, order_id, amount, level, from_user_id) VALUES (?, ?, ?, 2, ?)',
            [user[0].grandparent_id, order.id, level2Amount, order.user_id]
          );

          await connection.query(
            'UPDATE users SET total_commission = total_commission + ?, balance = balance + ? WHERE id = ?',
            [level2Amount, level2Amount, user[0].grandparent_id]
          );
        }
      }
    }

    await connection.commit();
    res.send('success');
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.send('fail');
  } finally {
    connection.release();
  }
});

module.exports = router;
