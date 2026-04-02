// 用户控制器
const { prisma } = require('../index');

// 获取用户信息
async function getProfile(req, res, next) {
  try {
    const user = req.user;

    // 获取收藏和订阅数量
    const [favoritesCount, subscriptionsCount] = await Promise.all([
      prisma.favorite.count({ where: { user_id: user.id } }),
      prisma.subscription.count({ where: { user_id: user.id } }),
    ]);

    res.json({
      code: 200,
      message: 'success',
      data: {
        ...user,
        favorites_count: favoritesCount,
        subscriptions_count: subscriptionsCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

// 更新用户信息
async function updateProfile(req, res, next) {
  try {
    const { avatar } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    res.json({
      code: 200,
      message: '更新成功',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// 获取收藏列表
async function getFavorites(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    const total = await prisma.favorite.count({
      where: { user_id: userId },
    });

    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
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
        items: favorites,
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

// 添加收藏
async function addFavorite(req, res, next) {
  try {
    const { figure_id } = req.body;
    const userId = req.user.id;

    if (!figure_id) {
      return res.status(400).json({
        code: 400,
        message: '手办 ID 不能为空',
        data: null,
      });
    }

    // 检查手办是否存在
    const figure = await prisma.figure.findUnique({
      where: { id: figure_id },
    });

    if (!figure) {
      return res.status(404).json({
        code: 404,
        message: '手办不存在',
        data: null,
      });
    }

    // 创建收藏
    const favorite = await prisma.favorite.create({
      data: {
        user_id: userId,
        figure_id,
      },
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
      message: '收藏成功',
      data: favorite,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        code: 400,
        message: '已经收藏过该手办',
        data: null,
      });
    }
    next(error);
  }
}

// 取消收藏
async function removeFavorite(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favorite = await prisma.favorite.findFirst({
      where: { id: parseInt(id), user_id: userId },
    });

    if (!favorite) {
      return res.status(404).json({
        code: 404,
        message: '收藏不存在',
        data: null,
      });
    }

    await prisma.favorite.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      code: 200,
      message: '取消收藏成功',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

// 获取订阅列表
async function getSubscriptions(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    const total = await prisma.subscription.count({
      where: { user_id: userId },
    });

    const subscriptions = await prisma.subscription.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
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
        items: subscriptions,
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

// 添加订阅
async function addSubscription(req, res, next) {
  try {
    const { manufacturer_id, brand_id } = req.body;
    const userId = req.user.id;

    if (!manufacturer_id && !brand_id) {
      return res.status(400).json({
        code: 400,
        message: '厂商 ID 或品牌 ID 不能为空',
        data: null,
      });
    }

    // 创建订阅
    const subscription = await prisma.subscription.create({
      data: {
        user_id: userId,
        manufacturer_id,
        brand_id,
      },
      include: {
        manufacturer: true,
        brand: true,
      },
    });

    res.json({
      code: 200,
      message: '订阅成功',
      data: subscription,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        code: 400,
        message: '已经订阅过',
        data: null,
      });
    }
    next(error);
  }
}

// 取消订阅
async function removeSubscription(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subscription = await prisma.subscription.findFirst({
      where: { id: parseInt(id), user_id: userId },
    });

    if (!subscription) {
      return res.status(404).json({
        code: 404,
        message: '订阅不存在',
        data: null,
      });
    }

    await prisma.subscription.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      code: 200,
      message: '取消订阅成功',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getSubscriptions,
  addSubscription,
  removeSubscription,
};
