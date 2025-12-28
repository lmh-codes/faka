# API 接口文档

## 基础信息

- 基础路径：`/api`
- 返回格式：JSON
- 字符编码：UTF-8

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

### 失败响应

```json
{
  "success": false,
  "message": "错误信息"
}
```

## 认证接口

### 用户注册

**POST** `/auth/register`

请求参数：

```json
{
  "username": "用户名",
  "email": "邮箱",
  "password": "密码",
  "inviteCode": "邀请码（可选）"
}
```

响应：

```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "userId": 1,
    "inviteCode": "INV123456"
  }
}
```

### 用户登录

**POST** `/auth/login`

请求参数：

```json
{
  "username": "用户名或邮箱",
  "password": "密码"
}
```

响应：

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "JWT令牌",
    "user": {
      "id": 1,
      "username": "用户名",
      "email": "邮箱",
      "role": "user",
      "balance": 0,
      "inviteCode": "INV123456"
    }
  }
}
```

## 商品接口

### 获取商品分类

**GET** `/products/categories`

响应：

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "游戏点卡",
      "description": "各类游戏充值卡",
      "sort_order": 1
    }
  ]
}
```

### 获取商品列表

**GET** `/products`

查询参数：

- `categoryId`: 分类ID（可选）
- `page`: 页码（默认1）
- `limit`: 每页数量（默认12）

响应：

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "商品名称",
        "price": 10.00,
        "available_stock": 100,
        "category_name": "游戏点卡"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50
    }
  }
}
```

### 获取商品详情

**GET** `/products/:id`

响应：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "商品名称",
    "description": "商品描述",
    "price": 10.00,
    "available_stock": 100,
    "category_name": "游戏点卡"
  }
}
```

## 订单接口

### 创建订单

**POST** `/orders/create`

请求参数：

```json
{
  "productId": 1,
  "quantity": 1,
  "contactEmail": "user@example.com",
  "userId": 1
}
```

响应：

```json
{
  "success": true,
  "message": "订单创建成功",
  "data": {
    "orderId": 1,
    "orderNo": "ORD123456",
    "totalPrice": 10.00
  }
}
```

### 查询订单

**GET** `/orders/query/:orderNo`

响应：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_no": "ORD123456",
    "product_name": "商品名称",
    "quantity": 1,
    "total_price": 10.00,
    "payment_status": "paid",
    "cards": [
      {
        "card_number": "卡号",
        "card_password": "密码"
      }
    ]
  }
}
```

### 获取我的订单（需要登录）

**GET** `/orders/my-orders`

请求头：

```
Authorization: Bearer <token>
```

查询参数：

- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）

## 支付接口

### 创建支付

**POST** `/payment/create`

请求参数：

```json
{
  "orderNo": "ORD123456",
  "paymentMethod": "alipay"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "payUrl": "支付页面URL",
    "params": {
      "pid": "商户ID",
      "type": "alipay",
      "out_trade_no": "ORD123456",
      "money": 10.00
    }
  }
}
```

### 支付回调（由支付平台调用）

**POST** `/payment/notify`

## 用户接口（需要登录）

### 获取用户信息

**GET** `/users/profile`

请求头：

```
Authorization: Bearer <token>
```

### 申请提现

**POST** `/users/withdraw`

请求参数：

```json
{
  "amount": 10.00,
  "accountType": "alipay",
  "accountInfo": "支付宝账号"
}
```

### 获取提现记录

**GET** `/users/withdrawals`

## 分销接口（需要登录）

### 获取分销统计

**GET** `/distribution/stats`

响应：

```json
{
  "success": true,
  "data": {
    "inviteCode": "INV123456",
    "balance": 100.00,
    "totalCommission": 50.00,
    "level1Count": 10,
    "level2Count": 20,
    "level1Commission": 30.00,
    "level2Commission": 20.00
  }
}
```

### 获取佣金记录

**GET** `/distribution/commissions`

查询参数：

- `page`: 页码
- `limit`: 每页数量

### 获取团队列表

**GET** `/distribution/team`

查询参数：

- `level`: 等级（1或2）

## 管理员接口（需要管理员权限）

### 获取统计数据

**GET** `/admin/stats`

### 商品管理

**GET** `/admin/products` - 获取商品列表

**POST** `/admin/products` - 创建商品

**PUT** `/admin/products/:id` - 更新商品

### 批量导入卡密

**POST** `/admin/cards/import`

请求参数：

```json
{
  "productId": 1,
  "cards": [
    {
      "number": "卡号",
      "password": "密码"
    }
  ]
}
```

### 订单管理

**GET** `/admin/orders` - 获取订单列表

### 用户管理

**GET** `/admin/users` - 获取用户列表

### 提现管理

**GET** `/admin/withdrawals` - 获取提现列表

**PUT** `/admin/withdrawals/:id` - 处理提现申请

请求参数：

```json
{
  "status": "completed",
  "remark": "备注"
}
```

## 错误码

- `400` - 请求参数错误
- `401` - 未授权（未登录或令牌无效）
- `403` - 禁止访问（权限不足）
- `404` - 资源不存在
- `500` - 服务器错误
