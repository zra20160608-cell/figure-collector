// 认证路由
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 刷新 Token
router.post('/refresh', authController.refreshToken);

// 登出
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
