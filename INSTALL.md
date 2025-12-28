# 传统方式部署指南

> ⚠️ **推荐使用 Docker 部署**：更简单、更稳定、支持所有系统。查看 [DEPLOY.md](DEPLOY.md)

本文档介绍传统方式（手动安装 Node.js 和 MySQL）的部署方法。

---

# 发卡网系统 - 传统部署指南

## 环境要求

- Node.js >= 14.0
- MySQL >= 5.7
- npm 或 yarn

## 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd card-shop-system
```

### 2. 安装依赖

```bash
# 安装根目录和前后端所有依赖
npm run install-all
```

或者分别安装：

```bash
# 后端依赖
npm install

# 前端依赖
cd client
npm install
```

### 3. 配置数据库

创建数据库并导入表结构：

```bash
mysql -u root -p
```

```sql
CREATE DATABASE card_shop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

导入数据库结构：

```bash
mysql -u root -p card_shop < server/database/schema.sql
```

### 4. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写配置：

```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=card_shop

# JWT密钥（请修改为随机字符串）
JWT_SECRET=your_random_secret_key_here

# 服务器配置
PORT=3000
NODE_ENV=development

# 易支付配置（需要申请）
EPAY_API_URL=https://pay.example.com
EPAY_PID=your_pid
EPAY_KEY=your_key

# 分销配置
LEVEL1_COMMISSION_RATE=0.10
LEVEL2_COMMISSION_RATE=0.05
```

### 5. 修改默认管理员密码

编辑 `server/database/schema.sql`，找到管理员插入语句，生成密码哈希：

```javascript
// 使用 Node.js 生成密码哈希
const bcrypt = require('bcryptjs');
const password = 'your_admin_password';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

将生成的哈希值替换到 SQL 文件中。

### 6. 启动项目

开发模式（同时启动前后端）：

```bash
npm run dev
```

或者分别启动：

```bash
# 启动后端
npm run server

# 启动前端（新终端）
npm run client
```

### 7. 访问系统

- 前端地址：http://localhost:5173
- 后端API：http://localhost:3000
- 管理后台：http://localhost:5173/admin

默认管理员账号：
- 用户名：admin
- 密码：admin123（如果未修改）

## 生产环境部署

### 1. 构建前端

```bash
cd client
npm run build
```

构建后的文件在 `client/dist` 目录。

### 2. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 使用 PM2 管理后端进程

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
pm2 start server/index.js --name card-shop

# 设置开机自启
pm2 startup
pm2 save
```

## 支付配置

### 易支付对接

1. 注册易支付账号并获取 PID 和 KEY
2. 在 `.env` 中配置：
   ```
   EPAY_API_URL=https://your-epay-domain.com
   EPAY_PID=your_pid
   EPAY_KEY=your_key
   ```

### 其他支付方式

如需对接支付宝、微信等官方支付，需要：

1. 申请商户号
2. 配置相关密钥
3. 修改 `server/routes/payment.js` 中的支付逻辑

## 常见问题

### 1. 数据库连接失败

检查 `.env` 中的数据库配置是否正确，确保 MySQL 服务已启动。

### 2. 前端无法访问后端 API

检查后端是否正常启动，端口是否被占用。

### 3. 支付回调失败

确保服务器可以被外网访问，回调地址配置正确。

### 4. 卡密不显示

检查订单是否已支付，卡密是否已导入。

## 功能扩展

### 添加新的支付方式

编辑 `server/routes/payment.js`，添加新的支付逻辑。

### 自定义邮件通知

安装 nodemailer：

```bash
npm install nodemailer
```

在订单完成后发送邮件通知。

### 添加短信通知

对接短信服务商 API，在关键操作时发送短信。

## 技术支持

如有问题，请查看项目文档或提交 Issue。
