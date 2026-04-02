// 统计路由
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

// 获取首页统计数据
router.get('/home', statsController.getHomeStats);

module.exports = router;
