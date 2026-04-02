// 厂商控制器
const { prisma } = require('../index');

// 获取厂商列表
async function getManufacturers(req, res, next) {
  try {
    const manufacturers = await prisma.manufacturer.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { figures: true, brands: true },
        },
      },
    });

    res.json({
      code: 200,
      message: 'success',
      data: manufacturers,
    });
  } catch (error) {
    next(error);
  }
}

// 获取厂商详情
async function getManufacturerDetail(req, res, next) {
  try {
    const { id } = req.params;

    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: parseInt(id) },
      include: {
        brands: true,
        _count: {
          select: { figures: true },
        },
      },
    });

    if (!manufacturer) {
      return res.status(404).json({
        code: 404,
        message: '厂商不存在',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: manufacturer,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getManufacturers,
  getManufacturerDetail,
};
