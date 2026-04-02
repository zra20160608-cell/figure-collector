// 手办路由
const express = require('express');
const router = express.Router();
const figuresController = require('../controllers/figures.controller');

// 获取手办列表 (支持筛选和分页)
router.get('/', figuresController.getFigures);

// 获取手办详情
router.get('/:id', figuresController.getFigureDetail);

module.exports = router;
