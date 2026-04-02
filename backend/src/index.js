// 后端主入口文件
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');

// 导入路由
const statsRoutes = require('./routes/stats.routes');
const figuresRoutes = require('./routes/figures.routes');
const newsRoutes = require('./routes/news.routes');
const manufacturersRoutes = require('./routes/manufacturers.routes');
const brandsRoutes = require('./routes/brands.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 4000;

// 创建 Prisma 客户端
const prisma = new PrismaClient();

// 中间件
app.use(helmet()); // 安全头
app.use(cors()); // 跨域
app.use(morgan('dev')); // 日志
app.use(express.json()); // JSON 解析
app.use(express.urlencoded({ extended: true })); // URL 编码解析

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/figures', figuresRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/manufacturers', manufacturersRoutes);
app.use('/api/v1/brands', brandsRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null,
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    data: null,
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器启动在端口 ${PORT}`);
  console.log(`📊 健康检查：http://localhost:${PORT}/health`);
  console.log(`📚 API 文档：http://localhost:${PORT}/api-docs`);
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n👋 正在关闭服务器...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 正在关闭服务器...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { app, prisma };
