#!/bin/bash

# 发卡网系统 - Docker 部署脚本

set -e

echo "================================"
echo "  发卡网系统 - Docker 部署"
echo "================================"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "错误: Docker Compose 未安装"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "未找到 .env 文件，从模板创建..."
    cp .env.docker .env
    echo "请编辑 .env 文件配置数据库密码和其他参数"
    echo "然后重新运行此脚本"
    exit 0
fi

# 选择操作
echo "请选择操作:"
echo "1) 首次部署（构建并启动）"
echo "2) 启动服务"
echo "3) 停止服务"
echo "4) 重启服务"
echo "5) 查看日志"
echo "6) 查看状态"
echo "7) 清理并重新部署"
echo "8) 备份数据库"
echo "9) 退出"
echo ""
read -p "请输入选项 [1-9]: " choice

case $choice in
    1)
        echo "开始首次部署..."
        docker-compose down -v
        docker-compose build --no-cache
        docker-compose up -d
        echo ""
        echo "部署完成！"
        echo "访问地址: http://localhost"
        echo "管理后台: http://localhost/admin"
        echo "默认账号: admin / admin123"
        ;;
    2)
        echo "启动服务..."
        docker-compose up -d
        echo "服务已启动"
        ;;
    3)
        echo "停止服务..."
        docker-compose down
        echo "服务已停止"
        ;;
    4)
        echo "重启服务..."
        docker-compose restart
        echo "服务已重启"
        ;;
    5)
        echo "查看日志（按 Ctrl+C 退出）..."
        docker-compose logs -f
        ;;
    6)
        echo "服务状态:"
        docker-compose ps
        ;;
    7)
        echo "警告: 这将删除所有数据！"
        read -p "确认继续? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo "清理并重新部署..."
            docker-compose down -v
            docker-compose build --no-cache
            docker-compose up -d
            echo "重新部署完成"
        else
            echo "已取消"
        fi
        ;;
    8)
        echo "备份数据库..."
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose exec mysql mysqldump -u root -p${DB_PASSWORD:-card_shop_2024} card_shop > $BACKUP_FILE
        echo "数据库已备份到: $BACKUP_FILE"
        ;;
    9)
        echo "退出"
        exit 0
        ;;
    *)
        echo "无效选项"
        exit 1
        ;;
esac
