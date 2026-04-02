// 品牌控制器
const { prisma } = require('../index');

// 获取品牌列表
async function getBrands(req, res, next) {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        manufacturer: true,
        _count: {
          select: { figures: true },
        },
      },
    });

    res.json({
      code: 200,
      message: 'success',
      data: brands,
    });
  } catch (error) {
    next(error);
  }
}

// 获取品牌详情
async function getBrandDetail(req, res, next) {
  try {
    const { id } = req.params;

    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: {
        manufacturer: true,
        _count: {
          select: { figures: true },
        },
      },
    });

    if (!brand) {
      return res.status(404).json({
        code: 404,
        message: '品牌不存在',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: brand,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBrands,
  getBrandDetail,
};
