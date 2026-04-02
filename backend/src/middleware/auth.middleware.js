// 认证中间件
const jwt = require('jsonwebtoken');
const { prisma } = require('../index');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function authMiddleware(req, res, next) {
  try {
    // 获取 Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证信息',
        data: null,
      });
    }

    const token = authHeader.split(' ')[1];

    // 验证 Token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在',
        data: null,
      });
    }

    // 将用户信息附加到 request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: 'Token 已过期',
        data: null,
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: '无效的 Token',
        data: null,
      });
    }
    next(error);
  }
}

module.exports = authMiddleware;
