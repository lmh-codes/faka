# 快速开始

## 使用 Docker 部署（推荐）

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+

### 三步部署

#### 1. 配置环境变量

```bash
cp .env.docker .env
```

编辑 `.env` 文件，修改以下配置：

```env
DB_PASSWORD=your_secure_password
JWT_SECRET=your_random_secret_key
```

#### 2. 启动部署

```bash
chmod +x deploy.sh
./deploy.sh
```

选择 `1) 首次部署`

#### 3. 访问系统

- 前端: http://your-server-ip
- 管理后台: http://your-server-ip/admin
- 默认账号: admin / admin123

## 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 备份数据库
./deploy.sh  # 选择 8
```

## 导入测试数据

测试数据会在首次启动时自动导入，包含：
- 4个商品分类
- 10个测试商品
- 50张测试卡密
- 3个测试用户（密码: 123456）

## 下一步

1. 登录管理后台
2. 修改管理员密码
3. 配置支付接口
4. 添加商品和卡密
5. 配置 HTTPS（生产环境）

详细文档请查看 [DEPLOY.md](DEPLOY.md)
