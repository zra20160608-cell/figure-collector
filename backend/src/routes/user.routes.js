// 用户路由
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 所有用户路由都需要认证
router.use(authMiddleware);

// 获取用户信息
router.get('/profile', userController.getProfile);

// 更新用户信息
router.put('/profile', userController.updateProfile);

// 收藏相关
router.get('/favorites', userController.getFavorites);
router.post('/favorites', userController.addFavorite);
router.delete('/favorites/:id', userController.removeFavorite);

// 订阅相关
router.get('/subscriptions', userController.getSubscriptions);
router.post('/subscriptions', userController.addSubscription);
router.delete('/subscriptions/:id', userController.removeSubscription);

module.exports = router;
