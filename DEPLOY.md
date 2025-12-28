# Docker 部署指南

本系统支持使用 Docker 容器化部署，可在任何支持 Docker 的系统上快速部署。

## 系统要求

- Docker 20.10+
- Docker Compose 2.0+
- 2GB+ 内存
- 10GB+ 磁盘空间

## 支持的系统

- ✅ Linux (Ubuntu, CentOS, Debian 等)
- ✅ Windows (Docker Desktop)
- ✅ macOS (Docker Desktop)
- ✅ 云服务器 (阿里云、腾讯云、AWS 等)

## 快速部署

### 1. 安装 Docker

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo systemctl enable docker
```

**CentOS:**
```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo systemctl enable docker
```

**Windows/macOS:**
下载并安装 Docker Desktop: https://www.docker.com/products/docker-desktop

### 2. 安装 Docker Compose

```bash
# Linux
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.docker .env

# 编辑配置文件
nano .env  # 或使用 vim .env
```

**必须修改的配置:**
```env
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_random_secret_key_here
```

### 4. 部署应用

**方式一：使用部署脚本（推荐）**
```bash
chmod +x deploy.sh
./deploy.sh
# 选择 1) 首次部署
```

**方式二：手动部署**
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看状态
docker-compose ps
```

### 5. 访问系统

- 前端地址: http://your-server-ip
- 管理后台: http://your-server-ip/admin
- API 接口: http://your-server-ip/api

**默认管理员账号:**
- 用户名: admin
- 密码: admin123

## 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f app
docker-compose logs -f mysql
docker-compose logs -f nginx

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 停止并删除数据
docker-compose down -v

# 进入容器
docker-compose exec app sh
docker-compose exec mysql mysql -u root -p

# 备份数据库
docker-compose exec mysql mysqldump -u root -p card_shop > backup.sql

# 恢复数据库
docker-compose exec -T mysql mysql -u root -p card_shop < backup.sql
```

## 服务架构

```
┌─────────────────────────────────────────┐
│           Nginx (端口 80/443)            │
│         反向代理 + 静态文件服务           │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌──────▼──────┐
│   App (3000)   │  │  MySQL      │
│   Node.js 应用  │  │  数据库      │
└────────────────┘  └─────────────┘
```

## 配置说明

### docker-compose.yml

包含三个服务:
- **mysql**: MySQL 8.0 数据库
- **app**: Node.js 应用服务
- **nginx**: Nginx 反向代理

### 环境变量

所有配置通过 `.env` 文件管理，支持的变量:

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DB_PASSWORD | 数据库密码 | card_shop_2024 |
| DB_USER | 数据库用户 | cardshop |
| DB_NAME | 数据库名称 | card_shop |
| JWT_SECRET | JWT 密钥 | 需要修改 |
| EPAY_API_URL | 易支付接口地址 | - |
| EPAY_PID | 易支付商户ID | - |
| EPAY_KEY | 易支付密钥 | - |

## 数据持久化

数据存储在 Docker 卷中:
- `mysql_data`: MySQL 数据库文件
- `./logs`: 应用和 Nginx 日志

## HTTPS 配置

### 1. 准备 SSL 证书

将证书文件放到 `nginx/ssl/` 目录:
```
nginx/ssl/
├── cert.pem
└── key.pem
```

### 2. 修改 Nginx 配置

编辑 `nginx/conf.d/default.conf`，取消 HTTPS 部分的注释并修改域名。

### 3. 重启 Nginx

```bash
docker-compose restart nginx
```

## 性能优化

### 1. 调整 MySQL 配置

编辑 `docker-compose.yml`，在 mysql 服务的 command 中添加:
```yaml
command: >
  --default-authentication-plugin=mysql_native_password
  --character-set-server=utf8mb4
  --collation-server=utf8mb4_unicode_ci
  --max_connections=1000
  --innodb_buffer_pool_size=1G
```

### 2. 使用 Redis 缓存（可选）

在 `docker-compose.yml` 中添加 Redis 服务:
```yaml
redis:
  image: redis:alpine
  container_name: card-shop-redis
  restart: always
  ports:
    - "6379:6379"
  networks:
    - card-shop-network
```

### 3. 启用 Nginx 缓存

编辑 `nginx/conf.d/default.conf`，添加缓存配置。

## 监控和日志

### 查看实时日志

```bash
# 所有服务
docker-compose logs -f

# 应用日志
docker-compose logs -f app

# 数据库日志
docker-compose logs -f mysql

# Nginx 日志
docker-compose logs -f nginx
```

### 日志文件位置

- 应用日志: `./logs/app.log`
- Nginx 访问日志: `./logs/nginx/access.log`
- Nginx 错误日志: `./logs/nginx/error.log`

## 备份和恢复

### 备份数据库

```bash
# 使用脚本
./deploy.sh
# 选择 8) 备份数据库

# 或手动备份
docker-compose exec mysql mysqldump -u root -p card_shop > backup_$(date +%Y%m%d).sql
```

### 恢复数据库

```bash
docker-compose exec -T mysql mysql -u root -p card_shop < backup.sql
```

### 备份整个系统

```bash
# 停止服务
docker-compose down

# 备份数据卷
docker run --rm -v card-shop_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_data_backup.tar.gz -C /data .

# 重启服务
docker-compose up -d
```

## 更新应用

```bash
# 1. 备份数据
./deploy.sh  # 选择 8

# 2. 拉取最新代码
git pull

# 3. 重新构建
docker-compose build --no-cache

# 4. 重启服务
docker-compose up -d
```

## 故障排查

### 服务无法启动

```bash
# 查看日志
docker-compose logs

# 检查端口占用
netstat -tulpn | grep -E '80|443|3000|3306'

# 检查磁盘空间
df -h
```

### 数据库连接失败

```bash
# 检查 MySQL 是否运行
docker-compose ps mysql

# 查看 MySQL 日志
docker-compose logs mysql

# 进入 MySQL 容器测试
docker-compose exec mysql mysql -u root -p
```

### 前端无法访问

```bash
# 检查 Nginx 配置
docker-compose exec nginx nginx -t

# 重启 Nginx
docker-compose restart nginx

# 查看 Nginx 日志
docker-compose logs nginx
```

## 安全建议

1. **修改默认密码**
   - 数据库密码
   - JWT 密钥
   - 管理员密码

2. **启用 HTTPS**
   - 申请 SSL 证书
   - 配置 Nginx HTTPS

3. **配置防火墙**
   ```bash
   # Ubuntu/Debian
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **定期备份**
   - 设置自动备份脚本
   - 异地存储备份文件

5. **更新系统**
   ```bash
   # 定期更新镜像
   docker-compose pull
   docker-compose up -d
   ```

## 生产环境建议

1. 使用独立的数据库服务器
2. 配置 CDN 加速静态资源
3. 启用 Redis 缓存
4. 配置日志轮转
5. 设置监控告警
6. 使用负载均衡（多实例部署）

## 多实例部署

使用 Docker Swarm 或 Kubernetes 进行多实例部署，实现高可用。

### Docker Swarm 示例

```bash
# 初始化 Swarm
docker swarm init

# 部署服务
docker stack deploy -c docker-compose.yml card-shop

# 扩展应用实例
docker service scale card-shop_app=3
```

## 技术支持

遇到问题请查看:
- [项目文档](README.md)
- [API 文档](API.md)
- [项目结构](PROJECT_STRUCTURE.md)

或提交 Issue 获取帮助。
