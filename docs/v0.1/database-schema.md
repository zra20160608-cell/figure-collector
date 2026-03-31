# 数据库设计文档

**文档版本**: 1.0  
**创建时间**: 2026-03-31  
**项目**: figure-collector  
**基于**: REQ-backend-detail.md

---

## 1. 数据库概述

### 1.1 技术选型
- **数据库**: PostgreSQL 14+
- **缓存**: Redis 7+
- **ORM**: Prisma (推荐) / TypeORM

### 1.2 命名规范
```
表名: 复数形式, 下划线分隔 (figures, manufacturers)
列名: 蛇形命名法 (created_at, user_id)
主键: UUID格式 (gen_random_uuid())
索引: idx_{表名}_{字段名}
```

---

## 2. 表结构

### 2.1 manufacturers (厂商表)

```sql
CREATE TABLE manufacturers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    name_cn         VARCHAR(100),
    logo_url        VARCHAR(500),
    website         VARCHAR(500),
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_manufacturers_name ON manufacturers(name);
```

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(100) | NOT NULL | 厂商英文名 |
| name_cn | VARCHAR(100) | - | 厂商中文名 |
| logo_url | VARCHAR(500) | - | Logo URL |
| website | VARCHAR(500) | - | 官网 |
| description | TEXT | - | 描述 |
| created_at | TIMESTAMP | - | 创建时间 |
| updated_at | TIMESTAMP | - | 更新时间 |

---

### 2.2 brands (品牌线表)

```sql
CREATE TABLE brands (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    name_cn         VARCHAR(100),
    manufacturer_id UUID REFERENCES manufacturers(id),
    product_count   INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
| created_at | TIMESTAMP | - | 创建时间 |
| updated_at | TIMESTAMP | - | 更新时间 |

---

### 2.3 figures (手办表 - 核心)

```sql
CREATE TABLE figures (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id       VARCHAR(100) NOT NULL,
    source_platform VARCHAR(20) NOT NULL,
    
    -- 基本信息
    name            VARCHAR(500) NOT NULL,
    name_jp         VARCHAR(500),
    
    -- 关联
    manufacturer_id UUID REFERENCES manufacturers(id),
    brand_id        UUID REFERENCES brands(id),
    series          VARCHAR(200),
    character       VARCHAR(200),
    
    -- 价格 (分)
    price_cny       INTEGER,
    price_jpy       INTEGER,
    price_usd       INTEGER,
    price_original  VARCHAR(50),
    
    -- 时间
    release_date    DATE,
    release_year    VARCHAR(10),
    
    -- 状态
    status          VARCHAR(20) DEFAULT 'pre_order',
    info_type       VARCHAR(20),
    
    -- 内容
    description     TEXT,
    thumbnail       VARCHAR(500),
    images          JSONB,
    accessories     JSONB,
    
    -- 外部链接
    url_hpoi        VARCHAR(500),
    url_gsc         VARCHAR(500),
    url_official    VARCHAR(500),
    
    -- 元数据
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_source UNIQUE (source_platform, source_id)
);

CREATE INDEX idx_figures_manufacturer ON figures(manufacturer_id);
CREATE INDEX idx_figures_brand ON figures(brand_id);
CREATE INDEX idx_figures_status ON figures(status);
CREATE INDEX idx_figures_release_date ON figures(release_date);
CREATE INDEX idx_figures_price_cny ON figures(price_cny);
CREATE INDEX idx_figures_created ON figures(created_at DESC);
```

---

### 2.4 price_history (价格历史)

```sql
CREATE TABLE price_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    figure_id       UUID NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
    price           INTEGER NOT NULL,
    currency        VARCHAR(3) NOT NULL,
    source          VARCHAR(20),
    recorded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_price_figure ON price_history(figure_id);
CREATE INDEX idx_price_recorded ON price_history(recorded_at DESC);
```

---

### 2.5 news (情报表)

```sql
CREATE TABLE news (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    figure_id       UUID REFERENCES figures(id) ON DELETE SET NULL,
    
    title           VARCHAR(500) NOT NULL,
    type            VARCHAR(20) NOT NULL,
    content         TEXT,
    source          VARCHAR(20) NOT NULL,
    source_url      VARCHAR(500),
    
    posted_at       TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_type ON news(type);
CREATE INDEX idx_news_source ON news(source);
CREATE INDEX idx_news_posted ON news(posted_at DESC);
```

---

### 2.6 users (用户表)

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    avatar          VARCHAR(500),
    role            VARCHAR(20) DEFAULT 'user',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

---

### 2.7 favorites (收藏表)

```sql
CREATE TABLE favorites (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    figure_id       UUID NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
    status          VARCHAR(20) DEFAULT 'want',
    note            VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_favorite UNIQUE (user_id, figure_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_figure ON favorites(figure_id);
```

---

### 2.8 subscriptions (订阅表)

```sql
CREATE TABLE subscriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    target_type         VARCHAR(20) NOT NULL,
    target_id           UUID NOT NULL,
    
    notify_new_product  BOOLEAN DEFAULT TRUE,
    notify_price_drop   BOOLEAN DEFAULT TRUE,
    price_threshold     INTEGER,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_subscription UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_target ON subscriptions(target_type, target_id);
```

---

## 3. ER图

```
┌──────────────┐       ┌──────────────────┐
│  manufacturers│ 1:N  │     figures      │
├──────────────┤◄──────┤──────────────────┤
│ id (PK)      │       │ id (PK)          │
│ name         │       │ manufacturer_id  │
│ name_cn      │       │ brand_id (FK)    │
└──────────────┘       └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │  price_history   │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ figure_id (FK)   │
                        │ price            │
                        │ currency         │
                        └──────────────────┘

         ┌──────────────┐       ┌──────────────────┐
         │    brands    │ 1:N  │      news       │
         ├──────────────┤◄──────┤------------------┤
         │ id (PK)      │       │ id (PK)         │
         │ manufacturer │       │ figure_id (FK)  │
         └──────────────┘       └──────────────────┘

┌──────────────┐       ┌──────────────────┐
│    users     │ 1:N  │   favorites      │
├──────────────┤◄──────├──────────────────┤
│ id (PK)      │       │ id (PK)         │
│ username     │       │ user_id (FK)    │
│ email        │       │ figure_id (FK)  │
└──────────────┘       └──────────────────┘
                                │
                        ┌───────┴───────┐
                        │ subscriptions │
                        ├───────────────┤
                        │ id (PK)       │
                        │ user_id (FK)  │
                        │ target_type   │
                        │ target_id     │
                        └───────────────┘
```

---

## 4. 索引汇总

| 索引名 | 表名 | 字段 | 类型 |
|--------|------|------|------|
| idx_manufacturers_name | manufacturers | name | B-Tree |
| idx_brands_name | brands | name | B-Tree |
| idx_brands_manufacturer | brands | manufacturer_id | B-Tree |
| idx_figures_manufacturer | figures | manufacturer_id | B-Tree |
| idx_figures_brand | figures | brand_id | B-Tree |
| idx_figures_status | figures | status | B-Tree |
| idx_figures_release_date | figures | release_date | B-Tree |
| idx_figures_price_cny | figures | price_cny | B-Tree |
| idx_figures_created | figures | created_at | B-Tree |
| idx_price_figure | price_history | figure_id | B-Tree |
| idx_price_recorded | price_history | recorded_at | B-Tree |
| idx_news_type | news | type | B-Tree |
| idx_news_source | news | source | B-Tree |
| idx_news_posted | news | posted_at | B-Tree |
| idx_users_email | users | email | B-Tree |
| idx_users_username | users | username | B-Tree |
| idx_favorites_user | favorites | user_id | B-Tree |
| idx_favorites_figure | favorites | figure_id | B-Tree |
| idx_subscriptions_user | subscriptions | user_id | B-Tree |
| idx_subscriptions_target | subscriptions | target_type, target_id | B-Tree |

---

**文档状态**: ✅ 完成  
**创建时间**: 2026-03-31 14:20