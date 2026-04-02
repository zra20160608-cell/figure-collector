// 情报控制器
const { prisma } = require('../index');

// 获取情报列表
async function getNewsList(req, res, next) {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const where = {};
    if (type) {
      where.type = type;
    }

    const total = await prisma.news.count({ where });

    const news = await prisma.news.findMany({
      where,
      orderBy: { published_at: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: {
        figure: {
          include: {
            manufacturer: true,
            brand: true,
          },
        },
      },
    });

    res.json({
      code: 200,
      message: 'success',
      data: {
        items: news,
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

// 获取情报详情
async function getNewsDetail(req, res, next) {
  try {
    const { id } = req.params;

    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
      include: {
        figure: {
          include: {
            manufacturer: true,
            brand: true,
          },
        },
      },
    });

    if (!news) {
      return res.status(404).json({
        code: 404,
        message: '情报不存在',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: news,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNewsList,
  getNewsDetail,
};
