const axios = require('axios');
const crypto = require('crypto');

/**
 * 发卡平台适配器
 * 支持：易支付、独角数卡、鲸发卡
 */

class CardPlatformAdapter {
  constructor(platform) {
    this.platform = platform || process.env.CARD_PLATFORM || 'epay';
  }

  /**
   * 创建支付订单
   */
  async createPayment(orderData) {
    switch (this.platform) {
      case 'epay':
        return await this.createEpayPayment(orderData);
      case 'dujiao':
        return await this.createDujiaoPayment(orderData);
      case 'jingfaka':
        return await this.createJingfakaPayment(orderData);
      default:
        throw new Error(`不支持的发卡平台: ${this.platform}`);
    }
  }

  /**
   * 验证支付回调
   */
  async verifyCallback(callbackData) {
    switch (this.platform) {
      case 'epay':
        return await this.verifyEpayCallback(callbackData);
      case 'dujiao':
        return await this.verifyDujiaoCallback(callbackData);
      case 'jingfaka':
        return await this.verifyJingfakaCallback(callbackData);
      default:
        throw new Error(`不支持的发卡平台: ${this.platform}`);
    }
  }

  // ==================== 易支付 ====================

  /**
   * 易支付 - 创建支付
   */
  async createEpayPayment(orderData) {
    const { orderNo, amount, productName, paymentMethod } = orderData;

    const params = {
      pid: process.env.EPAY_PID,
      type: paymentMethod, // alipay, wxpay
      out_trade_no: orderNo,
      notify_url: `${process.env.API_URL}/api/payment/notify`,
      return_url: `${process.env.CLIENT_URL}/order/success`,
      name: productName,
      money: amount,
      sitename: '发卡商城'
    };

    params.sign = this.generateEpaySign(params, process.env.EPAY_KEY);
    params.sign_type = 'MD5';

    return {
      payUrl: `${process.env.EPAY_API_URL}/submit.php`,
      params,
      method: 'POST'
    };
  }

  /**
   * 易支付 - 验证回调
   */
  async verifyEpayCallback(data) {
    const { sign, sign_type, ...params } = data;
    const calculatedSign = this.generateEpaySign(params, process.env.EPAY_KEY);

    if (sign !== calculatedSign) {
      throw new Error('签名验证失败');
    }

    return {
      orderNo: data.out_trade_no,
      tradeNo: data.trade_no,
      amount: parseFloat(data.money),
      status: data.trade_status === 'TRADE_SUCCESS' ? 'success' : 'failed'
    };
  }

  generateEpaySign(params, key) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return crypto.createHash('md5').update(sortedParams + key).digest('hex');
  }

  // ==================== 独角数卡 ====================

  /**
   * 独角数卡 - 创建支付
   */
  async createDujiaoPayment(orderData) {
    const { orderNo, amount, productName, paymentMethod } = orderData;

    try {
      const response = await axios.post(
        `${process.env.DUJIAO_API_URL}/api/pay/create`,
        {
          order_id: orderNo,
          amount: amount,
          title: productName,
          type: paymentMethod, // alipay, wxpay
          notify_url: `${process.env.API_URL}/api/payment/notify`,
          return_url: `${process.env.CLIENT_URL}/order/success`
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.DUJIAO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === 200) {
        return {
          payUrl: response.data.data.pay_url,
          qrCode: response.data.data.qr_code,
          method: 'REDIRECT'
        };
      } else {
        throw new Error(response.data.message || '创建支付失败');
      }
    } catch (error) {
      throw new Error(`独角数卡支付创建失败: ${error.message}`);
    }
  }

  /**
   * 独角数卡 - 验证回调
   */
  async verifyDujiaoCallback(data) {
    const { sign, ...params } = data;
    
    // 验证签名
    const calculatedSign = this.generateDujiaoSign(params, process.env.DUJIAO_API_KEY);
    
    if (sign !== calculatedSign) {
      throw new Error('签名验证失败');
    }

    return {
      orderNo: data.order_id,
      tradeNo: data.trade_no,
      amount: parseFloat(data.amount),
      status: data.status === 'success' ? 'success' : 'failed'
    };
  }

  generateDujiaoSign(params, key) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return crypto.createHash('md5').update(sortedParams + key).digest('hex');
  }

  // ==================== 鲸发卡 ====================

  /**
   * 鲸发卡 - 创建支付
   */
  async createJingfakaPayment(orderData) {
    const { orderNo, amount, productName, paymentMethod } = orderData;

    try {
      const timestamp = Date.now();
      const params = {
        out_trade_no: orderNo,
        total_amount: amount,
        subject: productName,
        pay_type: paymentMethod, // alipay, wechat
        notify_url: `${process.env.API_URL}/api/payment/notify`,
        return_url: `${process.env.CLIENT_URL}/order/success`,
        timestamp: timestamp
      };

      params.sign = this.generateJingfakaSign(params, process.env.JINGFAKA_API_KEY);

      const response = await axios.post(
        `${process.env.JINGFAKA_API_URL}/api/order/create`,
        params,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === 0) {
        return {
          payUrl: response.data.data.pay_url,
          qrCode: response.data.data.qr_code,
          method: 'REDIRECT'
        };
      } else {
        throw new Error(response.data.msg || '创建支付失败');
      }
    } catch (error) {
      throw new Error(`鲸发卡支付创建失败: ${error.message}`);
    }
  }

  /**
   * 鲸发卡 - 验证回调
   */
  async verifyJingfakaCallback(data) {
    const { sign, ...params } = data;
    
    // 验证签名
    const calculatedSign = this.generateJingfakaSign(params, process.env.JINGFAKA_API_KEY);
    
    if (sign !== calculatedSign) {
      throw new Error('签名验证失败');
    }

    return {
      orderNo: data.out_trade_no,
      tradeNo: data.trade_no,
      amount: parseFloat(data.total_amount),
      status: data.trade_status === '1' ? 'success' : 'failed'
    };
  }

  generateJingfakaSign(params, key) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return crypto.createHash('sha256').update(sortedParams + key).digest('hex');
  }

  // ==================== 通用方法 ====================

  /**
   * 获取支持的支付方式
   */
  getSupportedPaymentMethods() {
    const methods = {
      epay: ['alipay', 'wxpay', 'qqpay'],
      dujiao: ['alipay', 'wxpay'],
      jingfaka: ['alipay', 'wechat']
    };

    return methods[this.platform] || [];
  }

  /**
   * 获取平台名称
   */
  getPlatformName() {
    const names = {
      epay: '易支付',
      dujiao: '独角数卡',
      jingfaka: '鲸发卡'
    };

    return names[this.platform] || '未知平台';
  }
}

module.exports = CardPlatformAdapter;
