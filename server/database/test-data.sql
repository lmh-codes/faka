-- 测试数据脚本
-- 用于快速填充测试数据

USE card_shop;

-- 插入测试分类
INSERT INTO categories (name, description, sort_order, status) VALUES
('游戏点卡', '各类游戏充值卡密', 1, 'active'),
('视频会员', '爱奇艺、腾讯视频等会员', 2, 'active'),
('音乐会员', 'QQ音乐、网易云音乐会员', 3, 'active'),
('软件激活码', '各类软件激活码', 4, 'active');

-- 插入测试商品
INSERT INTO products (category_id, name, description, price, status, sort_order) VALUES
(1, '王者荣耀 60 点券', '王者荣耀游戏点券，充值后立即到账', 6.00, 'active', 100),
(1, '和平精英 60 UC', '和平精英游戏货币，自动发货', 6.00, 'active', 99),
(1, '原神 60 创世结晶', '原神游戏充值，秒到账', 6.00, 'active', 98),
(2, '爱奇艺黄金会员 1个月', '爱奇艺黄金会员月卡', 15.00, 'active', 97),
(2, '腾讯视频VIP 1个月', '腾讯视频会员月卡', 15.00, 'active', 96),
(2, '优酷VIP 1个月', '优酷视频会员月卡', 15.00, 'active', 95),
(3, 'QQ音乐绿钻 1个月', 'QQ音乐豪华绿钻月卡', 12.00, 'active', 94),
(3, '网易云音乐黑胶VIP 1个月', '网易云音乐黑胶会员月卡', 12.00, 'active', 93),
(4, 'Office 365 激活码', 'Microsoft Office 365 永久激活', 29.00, 'active', 92),
(4, 'Windows 10 专业版', 'Windows 10 Pro 激活密钥', 39.00, 'active', 91);

-- 为每个商品插入测试卡密（每个商品10张卡）
-- 商品1: 王者荣耀
INSERT INTO cards (product_id, card_number, card_password, status) VALUES
(1, 'WZ001234567890', 'PASS001', 'unsold'),
(1, 'WZ001234567891', 'PASS002', 'unsold'),
(1, 'WZ001234567892', 'PASS003', 'unsold'),
(1, 'WZ001234567893', 'PASS004', 'unsold'),
(1, 'WZ001234567894', 'PASS005', 'unsold'),
(1, 'WZ001234567895', 'PASS006', 'unsold'),
(1, 'WZ001234567896', 'PASS007', 'unsold'),
(1, 'WZ001234567897', 'PASS008', 'unsold'),
(1, 'WZ001234567898', 'PASS009', 'unsold'),
(1, 'WZ001234567899', 'PASS010', 'unsold');

-- 商品2: 和平精英
INSERT INTO cards (product_id, card_number, card_password, status) VALUES
(2, 'HP001234567890', 'PASS001', 'unsold'),
(2, 'HP001234567891', 'PASS002', 'unsold'),
(2, 'HP001234567892', 'PASS003', 'unsold'),
(2, 'HP001234567893', 'PASS004', 'unsold'),
(2, 'HP001234567894', 'PASS005', 'unsold'),
(2, 'HP001234567895', 'PASS006', 'unsold'),
(2, 'HP001234567896', 'PASS007', 'unsold'),
(2, 'HP001234567897', 'PASS008', 'unsold'),
(2, 'HP001234567898', 'PASS009', 'unsold'),
(2, 'HP001234567899', 'PASS010', 'unsold');

-- 商品3: 原神
INSERT INTO cards (product_id, card_number, card_password, status) VALUES
(3, 'YS001234567890', 'PASS001', 'unsold'),
(3, 'YS001234567891', 'PASS002', 'unsold'),
(3, 'YS001234567892', 'PASS003', 'unsold'),
(3, 'YS001234567893', 'PASS004', 'unsold'),
(3, 'YS001234567894', 'PASS005', 'unsold'),
(3, 'YS001234567895', 'PASS006', 'unsold'),
(3, 'YS001234567896', 'PASS007', 'unsold'),
(3, 'YS001234567897', 'PASS008', 'unsold'),
(3, 'YS001234567898', 'PASS009', 'unsold'),
(3, 'YS001234567899', 'PASS010', 'unsold');

-- 商品4: 爱奇艺
INSERT INTO cards (product_id, card_number, card_password, status) VALUES
(4, 'IQY1234567890123', NULL, 'unsold'),
(4, 'IQY1234567890124', NULL, 'unsold'),
(4, 'IQY1234567890125', NULL, 'unsold'),
(4, 'IQY1234567890126', NULL, 'unsold'),
(4, 'IQY1234567890127', NULL, 'unsold'),
(4, 'IQY1234567890128', NULL, 'unsold'),
(4, 'IQY1234567890129', NULL, 'unsold'),
(4, 'IQY1234567890130', NULL, 'unsold'),
(4, 'IQY1234567890131', NULL, 'unsold'),
(4, 'IQY1234567890132', NULL, 'unsold');

-- 商品5: 腾讯视频
INSERT INTO cards (product_id, card_number, card_password, status) VALUES
(5, 'TX1234567890123', NULL, 'unsold'),
(5, 'TX1234567890124', NULL, 'unsold'),
(5, 'TX1234567890125', NULL, 'unsold'),
(5, 'TX1234567890126', NULL, 'unsold'),
(5, 'TX1234567890127', NULL, 'unsold'),
(5, 'TX1234567890128', NULL, 'unsold'),
(5, 'TX1234567890129', NULL, 'unsold'),
(5, 'TX1234567890130', NULL, 'unsold'),
(5, 'TX1234567890131', NULL, 'unsold'),
(5, 'TX1234567890132', NULL, 'unsold');

-- 更新商品库存统计
UPDATE products p SET stock = (
    SELECT COUNT(*) FROM cards WHERE product_id = p.id AND status = 'unsold'
);

-- 插入测试用户（密码都是 123456）
INSERT INTO users (username, email, password, role, invite_code, parent_id, grandparent_id) VALUES
('testuser1', 'test1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', 'TEST001', NULL, NULL),
('testuser2', 'test2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', 'TEST002', 2, NULL),
('testuser3', 'test3@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', 'TEST003', 3, 2);

-- 显示结果
SELECT '=== 测试数据导入完成 ===' as message;
SELECT CONCAT('商品数量: ', COUNT(*)) as result FROM products;
SELECT CONCAT('卡密数量: ', COUNT(*)) as result FROM cards WHERE status = 'unsold';
SELECT CONCAT('测试用户: ', COUNT(*)) as result FROM users WHERE username LIKE 'test%';
SELECT '测试账号密码都是: 123456' as tip;
