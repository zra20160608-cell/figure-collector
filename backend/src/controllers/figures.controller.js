// 手办控制器
const { prisma } = require('../index');

// 获取手办列表
async function getFigures(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'default',
      manufacturer_ids,
      brand_ids,
      min_price,
      max_price,
      status,
      release_year,
    } = req.query;

    // 构建筛选条件
    const where = {};

    if (manufacturer_ids) {
      where.manufacturer_id = { in: manufacturer_ids.split(',').map(Number) };
    }

    if (brand_ids) {
      where.brand_id = { in: brand_ids.split(',').map(Number) };
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price.gte = parseFloat(min_price);
      if (max_price) where.price.lte = parseFloat(max_price);
    }

    if (status) {
      where.status = status;
    }

    if (release_year) {
      const year = parseInt(release_year);
      where.release_date = {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      };
    }

    // 构建排序
    let orderBy = {};
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { created_at: 'desc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }

    // 查询总数
    const total = await prisma.figure.count({ where });

    // 查询数据
    const figures = await prisma.figure.findMany({
      where,
      orderBy,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: {
        manufacturer: true,
        brand: true,
      },
    });

    res.json({
      code: 200,
      message: 'success',
      data: {
        items: figures,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          total_pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// 获取手办详情
async function getFigureDetail(req, res, next) {
  try {
    const { id } = req.params;

    const figure = await prisma.figure.findUnique({
      where: { id: parseInt(id) },
      include: {
        manufacturer: true,
        brand: true,
      },
    });

    if (!figure) {
      return res.status(404).json({
        code: 404,
        message: '手办不存在',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: figure,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFigures,
  getFigureDetail,
};
