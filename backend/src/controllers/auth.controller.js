// 认证控制器
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../index');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 用户注册
async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名、邮箱和密码不能为空',
        data: null,
      });
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: existingUser.username === username ? '用户名已存在' : '邮箱已被注册',
        data: null,
      });
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
      },
    });

    // 生成 Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      code: 200,
      message: '注册成功',
      data: {
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// 用户登录
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空',
        data: null,
      });
    }

    // 查找用户
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null,
      });
    }

    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null,
      });
    }

    // 生成 Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// 刷新 Token
async function refreshToken(req, res, next) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        code: 400,
        message: 'Refresh token 不能为空',
        data: null,
      });
    }

    // 验证 refresh token
    const decoded = jwt.verify(refresh_token, JWT_SECRET);

    // 生成新 Token
    const newToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      code: 200,
      message: 'Token 刷新成功',
      data: {
        access_token: newToken,
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: 'Token 已过期',
        data: null,
      });
    }
    next(error);
  }
}

// 登出
async function logout(req, res, next) {
  try {
    // 这里可以添加将 token 加入黑名单的逻辑
    res.json({
      code: 200,
      message: '登出成功',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
