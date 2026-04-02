// 厂商路由
const express = require('express');
const router = express.Router();
const manufacturersController = require('../controllers/manufacturers.controller');

// 获取厂商列表
router.get('/', manufacturersController.getManufacturers);

// 获取厂商详情
router.get('/:id', manufacturersController.getManufacturerDetail);

module.exports = router;
