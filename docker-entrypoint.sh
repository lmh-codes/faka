#!/bin/sh
set -e

echo "等待 MySQL 启动..."
until mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" >/dev/null 2>&1; do
  echo "MySQL 未就绪，等待中..."
  sleep 2
done

echo "MySQL 已就绪！"

# 检查数据库表是否存在
TABLE_EXISTS=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES LIKE 'users';" | grep -c "users" || true)

if [ "$TABLE_EXISTS" -eq "0" ]; then
  echo "初始化数据库表..."
  mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < /app/server/database/schema.sql
  echo "数据库初始化完成！"
else
  echo "数据库表已存在，跳过初始化"
fi

echo "启动应用..."
exec "$@"
