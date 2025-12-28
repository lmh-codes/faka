# 🛒 发卡网系统

一个功能完整的发卡网系统，支持二级分销、多支付方式、前后台管理。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0-brightgreen.svg)
![Vue](https://img.shields.io/badge/vue-3.x-brightgreen.svg)

## ✨ 功能特性

### 核心功能
- ✅ **用户系统** - 注册/登录/权限管理
- ✅ **商品管理** - 分类管理、卡密批量导入
- ✅ **订单系统** - 自动发货、订单查询
- ✅ **二级分销** - 推广链接、佣金自动结算（一级10%、二级5%）
- ✅ **多平台支付** - 支持易支付、独角数卡、鲸发卡等
- ✅ **管理后台** - 数据统计、用户管理、提现审核
- ✅ **响应式设计** - 完美支持移动端
- ✅ **性能优化** - 1核1G 也能流畅运行

### 支付平台
- 🔥 **易支付** - 接口简单，稳定可靠
- 🦄 **独角数卡** - 专业发卡平台，功能强大
- 🐋 **鲸发卡** - 新兴平台，费率优惠
- 🔧 **可扩展** - 支持对接更多平台

### 分销系统
- 🎯 自动追踪推荐关系（二级）
- 💰 订单支付后自动结算佣金
- 📊 实时佣金统计和团队管理
- 💳 在线提现申请和审核

## 🚀 快速部署

### 使用 Docker（推荐）

**一键部署，支持所有系统：**

```bash
# 1. 配置环境变量
cp .env.docker .env
# 编辑 .env 修改数据库密码和 JWT 密钥

# 2. 启动部署
chmod +x deploy.sh
./deploy.sh
# 选择 1) 首次部署

# 3. 访问系统
# http://your-server-ip
```

**支持的系统：**
- ✅ Linux (Ubuntu, CentOS, Debian)
- ✅ Windows (Docker Desktop)
- ✅ macOS (Docker Desktop)
- ✅ 云服务器 (阿里云、腾讯云、AWS)

**详细部署文档：**
- 📖 [开始部署.md](开始部署.md) - 新手友好的部署指南 👈 推荐
- 📖 [DEPLOY.md](DEPLOY.md) - 完整的技术文档

## 📱 访问系统

**Docker 部署后：**
- 🌐 **前端首页**: http://your-server-ip
- 🔧 **管理后台**: http://your-server-ip/admin
- 📡 **后端API**: http://your-server-ip/api

**默认管理员账号:**
- 用户名: `admin`
- 密码: `admin123`

⚠️ **首次登录后请立即修改密码！**

## 🛠️ 技术栈

### 后端
- Node.js + Express
- MySQL 数据库
- JWT 身份验证
- RESTful API
- bcryptjs 密码加密
- 多平台支付适配器

### 前端
- Vue 3 + Vite
- Element Plus UI
- Axios
- Vue Router
- Pinia 状态管理

### 部署
- Docker + Docker Compose
- Nginx 反向代理
- 资源优化（支持 1核1G）

## 📖 文档

**部署相关：**
- **[部署教程.md](部署教程.md)** - 🔥 超详细图文教程，手把手教你部署 👈 新手必看
- [开始部署.md](开始部署.md) - 快速部署指南
- [QUICKSTART.md](QUICKSTART.md) - 3步快速部署
- [DEPLOY.md](DEPLOY.md) - 完整的技术文档
- [性能优化说明.md](性能优化说明.md) - 1核1G 优化配置

**功能配置：**
- [发卡平台对接说明.md](发卡平台对接说明.md) - 支付平台对接教程
- [项目结构](PROJECT_STRUCTURE.md) - 完整的项目结构说明
- [API文档](API.md) - 完整的接口文档

**其他：**
- [INSTALL.md](INSTALL.md) - 传统方式部署（不推荐）

## 项目结构

```
card-shop-system/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── components/    # 公共组件
│   │   ├── api/          # API接口
│   │   ├── store/        # 状态管理
│   │   └── router/       # 路由配置
│   └── package.json
├── server/                # 后端项目
│   ├── controllers/      # 控制器
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── middleware/      # 中间件
│   ├── utils/           # 工具函数
│   └── database/        # 数据库脚本
└── package.json
```

## 二级分销说明

1. 用户注册后自动获得推广链接
2. 一级推荐人获得 10% 佣金
3. 二级推荐人获得 5% 佣金
4. 佣金自动结算到账户余额

## 支付对接

系统支持对接：
- 易支付（推荐）
- 支付宝当面付
- 微信支付
- 其他第三方支付平台

## 许可证

MIT License


## 📸 系统截图

### 前台页面
- 首页展示
- 商品列表
- 商品详情
- 订单查询

### 用户中心
- 我的订单
- 分销中心
- 申请提现

### 管理后台
- 数据统计
- 商品管理
- 订单管理
- 用户管理
- 提现审核

## 🎯 使用场景

- 游戏点卡销售
- 视频会员销售
- 软件激活码销售
- 各类虚拟商品交易

## 🔧 主要功能模块

### 1. 商品管理
- 商品分类管理
- 商品信息维护
- 批量导入卡密
- 库存自动管理

### 2. 订单系统
- 在线下单购买
- 自动分配卡密
- 订单状态追踪
- 邮件通知（可扩展）

### 3. 二级分销
```
用户A（推广者）
  └─ 用户B（一级，佣金10%）
      └─ 用户C（二级，佣金5%）
```
- 用户B购买，用户A获得10%佣金
- 用户C购买，用户A获得5%佣金，用户B获得10%佣金

### 4. 支付系统
- 易支付接口（推荐）
- 支付宝官方接口
- 微信支付接口
- 可扩展其他支付方式

### 5. 提现系统
- 用户申请提现
- 管理员审核
- 支持支付宝/微信/银行卡

## 🔐 安全特性

- JWT Token 认证
- bcrypt 密码加密
- SQL 注入防护
- XSS 攻击防护
- CORS 跨域配置

## 📊 数据库设计

核心数据表：
- `users` - 用户表（含分销关系）
- `products` - 商品表
- `categories` - 分类表
- `cards` - 卡密表
- `orders` - 订单表
- `commissions` - 佣金记录表
- `withdrawals` - 提现记录表
- `settings` - 系统配置表

## 🚀 部署建议

### 开发环境
- 使用 `npm run dev` 启动
- 前后端分离开发

### 生产环境
- 前端构建：`cd client && npm run build`
- 使用 Nginx 部署前端静态文件
- 使用 PM2 管理后端进程
- 配置 HTTPS 证书
- 使用 Redis 缓存（可选）

详细部署步骤请查看 [INSTALL.md](INSTALL.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## ⚠️ 免责声明

本项目仅供学习交流使用，使用本系统从事任何违法活动，后果自负。

## 💡 常见问题

### 1. 如何修改管理员密码？

```bash
node server/utils/hash-password.js 新密码
```

然后将生成的哈希值更新到数据库。

### 2. 如何添加新的支付方式？

编辑 `server/routes/payment.js`，参考现有代码添加新的支付逻辑。

### 3. 如何自定义界面？

前端使用 Element Plus，可以在 `client/src/views` 中修改页面组件。

### 4. 如何配置邮件通知？

安装 nodemailer 并在订单完成后发送邮件：

```bash
npm install nodemailer
```

### 5. 数据库连接失败？

检查：
- MySQL 服务是否启动
- `.env` 配置是否正确
- 数据库是否已创建

更多问题请查看 [LOCAL_DEBUG.md](LOCAL_DEBUG.md)

## 📞 技术支持

如有问题，请提交 Issue 或查看文档。

---

⭐ 如果这个项目对你有帮助，请给个 Star！


## 💰 支付平台配置

系统支持多个主流发卡平台，可根据需求选择：

### 易支付（推荐）
```env
CARD_PLATFORM=epay
EPAY_API_URL=https://pay.example.com
EPAY_PID=10001
EPAY_KEY=your_key
```

### 独角数卡
```env
CARD_PLATFORM=dujiao
DUJIAO_API_URL=https://api.dujiaoka.com
DUJIAO_API_KEY=your_key
```

### 鲸发卡
```env
CARD_PLATFORM=jingfaka
JINGFAKA_API_URL=https://api.jingfaka.com
JINGFAKA_API_KEY=your_key
```

详细配置请查看 [发卡平台对接说明.md](发卡平台对接说明.md)

## ⚡ 性能优化

系统已针对低配置服务器进行优化：

### 最低配置
- CPU: 1核
- 内存: 1GB
- 磁盘: 20GB
- 支持 50+ 并发用户

### 推荐配置
- CPU: 2核
- 内存: 2GB
- 磁盘: 40GB
- 支持 200+ 并发用户

详细优化说明请查看 [性能优化说明.md](性能优化说明.md)
