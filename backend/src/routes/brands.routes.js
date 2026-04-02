// 品牌路由
const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brands.controller');

// 获取品牌列表
router.get('/', brandsController.getBrands);

// 获取品牌详情
router.get('/:id', brandsController.getBrandDetail);

module.exports = router;
