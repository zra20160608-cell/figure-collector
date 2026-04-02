// 统计控制器
const { prisma } = require('../index');

// 获取首页统计数据
async function getHomeStats(req, res, next) {
  try {
    // 并发查询所有统计数据
    const [
      totalFigures,
      newToday,
      preOrderCount,
      manufacturerCount
    ] = await Promise.all([
      // 手办总数
      prisma.figure.count(),
      
      // 今日新增 (需要 release_date 是今天)
      prisma.figure.count({
        where: {
          release_date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      
      // 预定中数量
      prisma.figure.count({
        where: { status: 'pre_order' },
      }),
      
      // 厂商数量
      prisma.manufacturer.count(),
    ]);

    res.json({
      code: 200,
      message: 'success',
      data: {
        total_figures: totalFigures,
        new_today: newToday,
        pre_order_count: preOrderCount,
        manufacturer_count: manufacturerCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHomeStats,
};
