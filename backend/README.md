# Figure Collector Backend

手办信息收集平台的后端 API 服务。

## 技术栈

- Node.js 18+
- Express.js
- Prisma ORM
- PostgreSQL
- JWT 认证

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js 18+
- PostgreSQL 14+

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 4. 数据库设置

创建数据库并运行迁移：

```bash
# 创建数据库
createdb figure_collector

# 运行 Prisma 迁移
npx prisma migrate dev --name init

# 生成 Prisma 客户端
npx prisma generate
```

### 5. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务将运行在 `http://localhost:4000`

## API 端点

### 统计
- `GET /api/v1/stats/home` - 首页统计数据

### 手办
- `GET /api/v1/figures` - 手办列表（支持筛选和分页）
- `GET /api/v1/figures/:id` - 手办详情

### 情报
- `GET /api/v1/news` - 情报列表
- `GET /api/v1/news/:id` - 情报详情

### 厂商
- `GET /api/v1/manufacturers` - 厂商列表
- `GET /api/v1/manufacturers/:id` - 厂商详情

### 品牌
- `GET /api/v1/brands` - 品牌列表
- `GET /api/v1/brands/:id` - 品牌详情

### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新 Token
- `POST /api/v1/auth/logout` - 登出

### 用户
- `GET /api/v1/user/profile` - 获取用户信息
- `PUT /api/v1/user/profile` - 更新用户信息
- `GET /api/v1/user/favorites` - 收藏列表
- `POST /api/v1/user/favorites` - 添加收藏
- `DELETE /api/v1/user/favorites/:id` - 取消收藏
- `GET /api/v1/user/subscriptions` - 订阅列表
- `POST /api/v1/user/subscriptions` - 添加订阅
- `DELETE /api/v1/user/subscriptions/:id` - 取消订阅

## 筛选参数

### 手办列表筛选
- `page` - 页码（默认 1）
- `limit` - 每页数量（默认 20）
- `sort` - 排序（default/price_asc/price_desc/newest）
- `manufacturer_ids` - 厂商 ID 列表（逗号分隔）
- `brand_ids` - 品牌 ID 列表（逗号分隔）
- `min_price` - 最低价格
- `max_price` - 最高价格
- `status` - 状态（announced/pre_order/available/sold_out）
- `release_year` - 发售年份

## 开发

```bash
# 代码检查
npm run lint

# 运行测试
npm test

# 数据库迁移
npm run db:migrate

# 数据库种子
npm run db:seed
```

## 许可证

MIT
