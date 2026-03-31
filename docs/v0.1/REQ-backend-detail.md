# 后端详细需求文档 (REQ-Backend-Detail)

**文档版本**: 1.0  
**创建时间**: 2026-03-31  
**项目**: figure-collector  
**基于**: PRD v0.2、REQ-backend-api.md

---

## 1. 概述

### 1.1 文档目标
本文档定义后端系统的**详细需求**，精确到每个数据库表字段、API接口参数、验证规则。

### 1.2 技术栈
- **后端框架**: Node.js + Express / Python + FastAPI
- **数据库**: PostgreSQL 14+
- **缓存**: Redis 7+
- **ORM**: Prisma / TypeORM / Sequelize
- **认证**: JWT
- **API文档**: Swagger/OpenAPI

---

## 2. 数据库设计

### 2.1 ER图关系

```
┌──────────────┐       ┌──────────────────┐
│  manufacturers│       │      figures      │
├──────────────┤       ├──────────────────┤
│ id (PK)      │◄──────│ manufacturer_id   │
│ name         │       │ id (PK)          │
│ name_cn      │       │ source_id        │
│ logo_url     │       │ source_platform  │
│ created_at   │       │ name             │
└──────────────┘       │ name_jp          │
        ▲               │ brand_id (FK)    │
        │               │ series           │
        │               │ character        │
        │               │ price_cny        │
        │               │ price_jpy        │
        │               │ release_date     │
        │               │ status           │
        │               │ info_type        │
        │               │ description      │
        │               │ thumbnail        │
        │               │ created_at       │
        │               │ updated_at       │
        │               └────────┬─────────┘
        │                        │
        │               ┌────────▼─────────┐
        │               │  price_history   │
        │               ├──────────────────┤
        │               │ id (PK)          │
        └───────────────│ figure_id (FK)   │
                        │ price            │
                        │ currency         │
                        │ source           │
                        │ recorded_at      │
                        └──────────────────┘

┌──────────────┐       ┌──────────────────┐
│    brands    │       │      news       │
├──────────────┤       ├──────────────────┤
│ id (PK)      │◄──────│ id (PK)         │
│ name         │       │ figure_id (FK)  │
│ name_cn      │       │ title           │
│ product_count│       │ type            │
└──────────────┘       │ source          │
        ▲              │ source_url      │
        │              │ posted_at       │
        │              │ created_at      │
        │              └──────────────────┘

┌──────────────┐       ┌──────────────────┐
│    users     │       │   favorites      │
├──────────────┤       ├──────────────────┤
│ id (PK)      │◄──────│ id (PK)         │
│ username     │       │ user_id (FK)    │
│ email        │       │ figure_id (FK)  │
│ password_hash│       │ status          │
│ avatar       │       │ note            │
│ created_at   │       │ created_at      │
│ updated_at   │       └──────────────────┘
                                       ▲
                                       │
                               ┌───────┴───────┐
                               │  subscriptions │
                               ├────────────────┤
                               │ id (PK)        │
                               │ user_id (FK)   │
                               │ target_type    │
                               │ target_id      │
                               │ notify_new     │
                               │ notify_price   │
                               │ price_threshold│
                               │ created_at     │
                               └────────────────┘
```

---

## 3. 数据表详细设计

### 3.1 manufacturers (厂商表)

```sql
CREATE TABLE manufacturers (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100)   NOT NULL,           -- 英文名: "INART"
    name_cn        VARCHAR(100),                       -- 中文名: "INART"
    logo_url       VARCHAR(500),                       -- Logo URL
    website        VARCHAR(500),                       -- 官网
    description    TEXT,                              -- 描述
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_manufacturers_name ON manufacturers(name);
```

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(100) | NOT NULL | 厂商英文名 |
| name_cn | VARCHAR(100) | - | 厂商中文名 |
| logo_url | VARCHAR(500) | - | Logo图片URL |
| website | VARCHAR(500) | - | 官网链接 |
| description | TEXT | - | 描述信息 |
| created_at | TIMESTAMP | DEFAULT | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT | 更新时间 |

### 3.2 brands (品牌线表)

```sql
CREATE TABLE brands (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100)   NOT NULL,           -- "ねんどろいど"
    name_cn        VARCHAR(100),                       -- "粘土人"
    manufacturer_id UUID          REFERENCES manufacturers(id),
    product_count   INTEGER       DEFAULT 0,           -- 产品数量
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_brands_manufacturer ON brands(manufacturer_id);
```

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(100) | NOT NULL | 品牌线日文名 |
| name_cn | VARCHAR(100) | - | 品牌线中文名 |
| manufacturer_id | UUID | FK | 关联厂商 |
| product_count | INTEGER | DEFAULT 0 | 产品数量 |
| created_at | TIMESTAMP | DEFAULT | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT | 更新时间 |

### 3.3 figures (手办表)

```sql
CREATE TABLE figures (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id       VARCHAR(100)   NOT NULL,           -- 源平台ID "119467"
    source_platform VARCHAR(20)    NOT NULL,           -- "hpoi" | "gsc"
    
    -- 基本信息
    name            VARCHAR(500)   NOT NULL,           -- "哈利·波特与密室 阿不思·邓布利多"
    name_jp         VARCHAR(500),                       -- 日文名
    
    -- 关联
    manufacturer_id UUID          REFERENCES manufacturers(id),
    brand_id        UUID          REFERENCES brands(id),
    series          VARCHAR(200),                       -- 系列 "哈利·波特"
    character       VARCHAR(200),                       -- 角色名
    
    -- 价格 (单位: 分, 存储时乘以100)
    price_cny       INTEGER,                            -- 人民币价格(分) 278000 = ¥2,780
    price_jpy       INTEGER,                            -- 日元价格(分)
    price_usd       INTEGER,                            -- 美元价格(分)
    price_original  VARCHAR(50),                        -- 原始价格字符串 "2780人民币"
    
    -- 时间
    release_date    DATE,                               -- 出荷日期 "2027-01-01"
    release_year    VARCHAR(10),                        -- "2027年"
    
    -- 状态
    status          VARCHAR(20)   DEFAULT 'pre_order', -- pre_order | available | announced
    info_type       VARCHAR(20),                        -- 预定时间 | 制作决定 | 出荷时间
    
    -- 内容
    description     TEXT,                               -- 详细描述
    thumbnail       VARCHAR(500),                       -- 缩略图URL
    images          JSONB,                              -- 图片数组 ["url1", "url2"]
    accessories     JSONB,                              -- 配件清单 ["素体", "衣服"]
    
    -- 外部链接
    url_hpoi        VARCHAR(500),
    url_gsc         VARCHAR(500),
    url_official    VARCHAR(500),
    
    -- 元数据
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    
    -- 约束
    CONSTRAINT unique_source UNIQUE (source_platform, source_id)
);

-- 索引
CREATE INDEX idx_figures_manufacturer ON figures(manufacturer_id);
CREATE INDEX idx_figures_brand ON figures(brand_id);
CREATE INDEX idx_figures_status ON figures(status);
CREATE INDEX idx_figures_release_date ON figures(release_date);
CREATE INDEX idx_figures_price_cny ON figures(price_cny);
CREATE INDEX idx_figures_created ON figures(created_at DESC);
```

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 内部ID |
| source_id | VARCHAR(100) | NOT NULL, UNIQUE | 源平台ID |
| source_platform | VARCHAR(20) | NOT NULL | 平台标识 |
| name | VARCHAR(500) | NOT NULL | 商品名称 |
| name_jp | VARCHAR(500) | - | 日文名 |
| manufacturer_id | UUID | FK | 厂商ID |
| brand_id | UUID | FK | 品牌ID |
| series | VARCHAR(200) | - | 系列 |
| character | VARCHAR(200) | - | 角色 |
| price_cny | INTEGER | - | 人民币(分) |
| price_jpy | INTEGER | - | 日元(分) |
| price_usd | INTEGER | - | 美元(分) |
| price_original | VARCHAR(50) | - | 原始价格 |
| release_date | DATE | - | 出荷日期 |
| release_year | VARCHAR(10) | - | 出荷年份 |
| status | VARCHAR(20) | DEFAULT | 状态 |
| info_type | VARCHAR(20) | - | 情报类型 |
| description | TEXT | - | 描述 |
| thumbnail | VARCHAR(500) | - | 缩略图 |
| images | JSONB | - | 图片数组 |
| accessories | JSONB | - | 配件数组 |
| url_hpoi | VARCHAR(500) | - | Hpoi链接 |
| url_gsc | VARCHAR(500) | - | GSC链接 |
| url_official | VARCHAR(500) | - | 官网链接 |
| created_at | TIMESTAMP | DEFAULT | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT | 更新时间 |

### 3.4 price_history (价格历史表)

```sql
CREATE TABLE price_history (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    figure_id       UUID          NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
    price           INTEGER        NOT NULL,           -- 价格(分)
    currency        VARCHAR(3)     NOT NULL,           -- "CNY" | "JPY" | "USD"
    source          VARCHAR(20),                       -- 来源平台
    recorded_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_price_figure ON price_history(figure_id);
CREATE INDEX idx_price_recorded ON price_history(recorded_at DESC);
```

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| figure_id | UUID | FK, NOT NULL | 手办ID |
| price | INTEGER | NOT NULL | 价格(分) |
| currency | VARCHAR(3) | NOT NULL | 币种 |
| source | VARCHAR(20) | - | 数据来源 |
| recorded_at | TIMESTAMP | DEFAULT | 记录时间 |

### 3.5 news (情报表)

```sql
CREATE TABLE news (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    figure_id       UUID          REFERENCES figures(id) ON DELETE SET NULL,
    
    title           VARCHAR(500)   NOT NULL,           -- 情报标题
    type            VARCHAR(20)    NOT NULL,           -- announced|pre_order|released|updated
    content         TEXT,                              -- 详细内容
    source          VARCHAR(20)    NOT NULL,           -- "hpoi" | "gsc"
    source_url      VARCHAR(500),                      -- 原文链接
    
    posted_at       TIMESTAMP,                          -- 发布时间
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_type ON news(type);
CREATE INDEX idx_news_source ON news(source);
CREATE INDEX idx_news_posted ON news(posted_at DESC);
CREATE INDEX idx_news_created ON news(created_at DESC);
```

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| figure_id | UUID | FK | 关联手办 |
| title | VARCHAR(500) | NOT NULL | 标题 |
| type | VARCHAR(20) | NOT NULL | 类型 |
| content | TEXT | - | 内容 |
| source | VARCHAR(20) | NOT NULL | 来源 |
| source_url | VARCHAR(500) | - | 原文链接 |
| posted_at | TIMESTAMP | - | 发布时间 |
| created_at | TIMESTAMP | DEFAULT | 创建时间 |

### 3.6 users (用户表)

```sql
CREATE TABLE users (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)    NOT NULL UNIQUE,
    email           VARCHAR(255)   NOT NULL UNIQUE,
    password_hash   VARCHAR(255)   NOT NULL,
    avatar          VARCHAR(500),                       -- 头像URL
    role            VARCHAR(20)    DEFAULT 'user',     -- user | admin
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### 3.7 favorites (收藏表)

```sql
CREATE TABLE favorites (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    figure_id       UUID          NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
    status          VARCHAR(20)    DEFAULT 'want',    -- want | ordered | owned | sold
    note            VARCHAR(500),                       -- 备注
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_favorite UNIQUE (user_id, figure_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_figure ON favorites(figure_id);
```

### 3.8 subscriptions (订阅表)

```sql
CREATE TABLE subscriptions (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    target_type     VARCHAR(20)    NOT NULL,           -- manufacturer | brand | figure
    target_id       UUID          NOT NULL,            -- 关联ID
    
    notify_new_product   BOOLEAN DEFAULT TRUE,        -- 新品通知
    notify_price_drop    BOOLEAN DEFAULT TRUE,        -- 降价通知
    price_threshold     INTEGER,                      -- 降价阈值(分)
    
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_subscription UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_target ON subscriptions(target_type, target_id);
```

---

## 4. API接口详细定义

### 4.1 手办列表接口

#### GET /api/v1/figures

**请求参数**:
| 参数 | 类型 | 必填 | 说明 | 验证 |
|------|------|:----:|------|------|
| page | integer | 否 | 页码, 默认1 | 1-1000 |
| limit | integer | 否 | 每页数量, 默认20 | 1-100 |
| manufacturer | string | 否 | 厂商ID | UUID |
| brand | string | 否 | 品牌ID | UUID |
| min_price | integer | 否 | 最低价格(分) | >=0 |
| max_price | integer | 否 | 最高价格(分) | >=0 |
| release_year | string | 否 | 出荷年份 | "2026" |
| status | string | 否 | 状态 | pre_order/available/announced |
| sort | string | 否 | 排序 | price_asc/price_desc/date_desc |
| keyword | string | 否 | 关键词 | max 100 chars |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "fig-uuid-001",
        "name": "哈利·波特与密室 阿不思·邓布利多",
        "name_jp": "アバス・ダンブルドア",
        "manufacturer": {
          "id": "mfr-uuid-001",
          "name": "INART",
          "name_cn": "INART"
        },
        "brand": {
          "id": "brand-uuid-001",
          "name": "スケールフィギュア",
          "name_cn": "比例手办"
        },
        "price_cny": 278000,
        "price_display": "¥2,780",
        "release_date": "2027-01-01",
        "release_year": "2027年",
        "status": "pre_order",
        "thumbnail": "https://img.hpoi.net/thumb/xxx.jpg",
        "created_at": "2026-03-28T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "total_pages": 8
    }
  }
}
```

### 4.2 手办详情接口

#### GET /api/v1/figures/:id

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| id | UUID | 手办ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "fig-uuid-001",
    "source_id": "119467",
    "source_platform": "hpoi",
    "name": "哈利·波特与密室 阿不思·邓布利多",
    "name_jp": "アバス・ダンブルドア",
    "manufacturer": {
      "id": "mfr-uuid-001",
      "name": "INART",
      "name_cn": "INART"
    },
    "brand": {
      "id": "brand-uuid-001",
      "name": "スケールフィギュア",
      "name_cn": "比例手办"
    },
    "series": "哈利·波特",
    "character": "阿不思·邓布利多",
    "price_cny": 278000,
    "price_jpy": null,
    "price_usd": null,
    "price_display": "¥2,780",
    "release_date": "2027-01-01",
    "release_year": "2027年",
    "status": "pre_order",
    "info_type": "预定时间",
    "description": "阿不思·邓布利多是魔法世界的传奇...",
    "thumbnail": "https://img.hpoi.net/xxx.jpg",
    "images": [
      "https://img.hpoi.net/1.jpg",
      "https://img.hpoi.net/2.jpg"
    ],
    "accessories": [
      "INART可动素体",
      "磁吸可动眼植发植胡头雕",
      "巫师袍"
    ],
    "urls": {
      "hpoi": "https://www.hpoi.net/hobby/119467",
      "gsc": null,
      "official": null
    },
    "price_history": {
      "current": 278000,
      "lowest": 278000,
      "highest": 278000,
      "currency": "CNY"
    },
    "created_at": "2026-03-28T10:00:00Z",
    "updated_at": "2026-03-28T18:00:00Z"
  }
}
```

### 4.3 情报列表接口

#### GET /api/v1/news

**请求参数**:
| 参数 | 类型 | 必填 | 说明 | 验证 |
|------|------|:----:|------|------|
| page | integer | 否 | 页码 | 1-1000 |
| limit | integer | 否 | 每页数量 | 1-50 |
| type | string | 否 | 类型 | announced/pre_order/released/updated |
| source | string | 否 | 来源 | hpoi/gsc |
| days | integer | 否 | 最近N天 | 1-365 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "news-uuid-001",
        "title": "Hot Toys MMS855D79 钢铁侠Mark 4 现已发售",
        "type": "released",
        "figure_id": "fig-uuid-002",
        "figure_name": "钢铁侠Mark 4",
        "source": "hpoi",
        "source_url": "https://www.hpoi.net/hobby/122027",
        "posted_at": "2026-03-28T13:00:00Z",
        "created_at": "2026-03-28T18:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

### 4.4 厂商列表接口

#### GET /api/v1/manufacturers

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "mfr-uuid-001",
        "name": "INART",
        "name_cn": "INART",
        "product_count": 12,
        "logo_url": null
      },
      {
        "id": "mfr-uuid-002",
        "name": "Good Smile Company",
        "name_cn": "良笑社",
        "product_count": 156,
        "logo_url": "https://example.com/logo.png"
      }
    ]
  }
}
```

### 4.5 品牌列表接口

#### GET /api/v1/brands

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      { "id": "brand-001", "name": "ねんどろいど", "name_cn": "粘土人", "product_count": 89 },
      { "id": "brand-002", "name": "figma", "name_cn": "figma", "product_count": 45 },
      { "id": "brand-003", "name": "POP UP PARADE", "name_cn": "POP UP PARADE", "product_count": 32 },
      { "id": "brand-004", "name": "スケールフィギュア", "name_cn": "比例手办", "product_count": 28 }
    ]
  }
}
```

### 4.6 统计接口

#### GET /api/v1/stats/home

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "total_figures": 15234,
    "new_today": 5,
    "pre_ordering": 1234,
    "manufacturers": 156,
    "recent_news": [
      {
        "id": "news-001",
        "title": "Hot Toys 钢铁侠Mark4 现已发售",
        "type": "released",
        "posted_at": "2026-03-28T13:00:00Z"
      }
    ]
  }
}
```

---

## 5. 验证规则

### 5.1 请求体验证

| 字段 | 类型 | 规则 | 错误信息 |
|------|------|------|----------|
| page | integer | 1-1000 | "page must be between 1 and 1000" |
| limit | integer | 1-100 | "limit must be between 1 and 100" |
| keyword | string | max 100 chars | "keyword max length is 100" |
| status | enum | pre_order/available/announced | "invalid status value" |
| type | enum | announced/pre_order/released/updated | "invalid type value" |

### 5.2 业务规则

| 规则 | 说明 |
|------|------|
| 价格存储 | 所有价格以"分"存储, 除以100显示 |
| 时间格式 | ISO 8601, 存储UTC, 显示转换本地时区 |
| 分页默认 | page=1, limit=20 |
| 排序默认 | date_desc (最新优先) |
| 空值处理 | null值不返回字段 |

---

## 6. 错误码

| 状态码 | 错误码 | 说明 | 场景 |
|--------|--------|------|------|
| 200 | SUCCESS | 成功 | 请求成功 |
| 400 | INVALID_PARAMETER | 参数错误 | 参数格式/范围错误 |
| 401 | UNAUTHORIZED | 未认证 | 缺少/无效Token |
| 403 | FORBIDDEN | 无权限 | 无权访问 |
| 404 | NOT_FOUND | 资源不存在 | ID不存在 |
| 429 | RATE_LIMIT | 限流 | 超过请求限制 |
| 500 | INTERNAL_ERROR | 内部错误 | 服务器异常 |

**错误响应格式**:
```json
{
  "code": 404,
  "message": "Figure not found",
  "error": {
    "type": "NOT_FOUND",
    "detail": "Figure with id 'fig-xxx' does not exist"
  }
}
```

---

## 7. 缓存策略

| 接口 | 缓存时间 | 策略 |
|------|----------|------|
| GET /stats/home | 5分钟 | Redis |
| GET /manufacturers | 1小时 | Redis |
| GET /brands | 1小时 | Redis |
| GET /figures (列表) | 2分钟 | Redis |
| GET /figures/:id (详情) | 5分钟 | Redis |
| GET /news | 1分钟 | Redis |
| 用户数据 | 不缓存 | - |

---

**文档状态**: ✅ 详细后端需求  
**创建时间**: 2026-03-31  
**下一步**: 交付给后端开发工程师