# 多阶段构建 - 前端构建阶段
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# 复制前端依赖文件
COPY client/package*.json ./

# 安装前端依赖
RUN npm install --production=false

# 复制前端源码
COPY client/ ./

# 构建前端
RUN npm run build

# 后端运行阶段
FROM node:18-alpine

WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache mysql-client

# 复制后端依赖文件
COPY package*.json ./

# 安装后端依赖
RUN npm install --production

# 复制后端源码
COPY server/ ./server/

# 从前端构建阶段复制构建产物
COPY --from=frontend-builder /app/client/dist ./client/dist

# 创建启动脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server/index.js"]
