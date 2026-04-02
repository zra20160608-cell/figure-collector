// 情报路由
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');

// 获取情报列表
router.get('/', newsController.getNewsList);

// 获取情报详情
router.get('/:id', newsController.getNewsDetail);

module.exports = router;
