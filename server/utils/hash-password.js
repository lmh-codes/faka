// 用于生成管理员密码哈希的工具脚本
const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('密码:', password);
console.log('哈希值:', hash);
console.log('\n将此哈希值复制到 schema.sql 中的管理员插入语句');
