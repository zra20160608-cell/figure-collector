# 后端API需求文档

**文档版本**: 1.0  
**创建时间**: 2026-03-28  
**项目**: figure-collector

---

## 1. 概述

### 1.1 目标
定义后端RESTful API接口规范，支持手办信息展示、价格追踪、用户订阅等功能。

### 1.2 技术规范
- **协议**: HTTPS
- **格式**: JSON
- **编码**: UTF-8
- **版本控制**: URL路径 `/api/v1/`
- **认证**: JWT Token

---

## 2. 手办商品API

### 2.1 获取手办列表

```http
GET /api/v1/figures
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码，默认1 |
| limit | integer | 否 | 每页数量，默认20，最大100 |
| manufacturer | string | 否 | 厂商筛选 |
| brand | string | 否 | 品牌线筛选 |
| min_price | number | 否 | 最低价格(CNY) |
| max_price | number | 否 | 最高价格(CNY) |
| release_year | integer | 否 | 出荷年份 |
| status | string | 否 | 状态: pre_order/available/announced |
| sort | string | 否 | 排序: price_asc/price_desc/date_desc |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "fig-uuid-1",
        "name": "哈利·波特与密室 阿不思·邓布利多",
        "name_jp": "アバス・ダンブルドア",
        "manufacturer": "INART",
        "brand": "スケールフィギュア",
        "price_cny": 2780,
        "price_jpy": null,
        "release_date": "2027-01-01",
        "status": "pre_order",
        "thumbnail": "https://img.hpoi.net/...",
        "source_platform": "hpoi",
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

---

### 2.2 获取手办详情

```http
GET /api/v1/figures/{figure_id}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "fig-uuid-1",
    "name": "哈利·波特与密室 阿不思·邓布利多",
    "name_jp": "アバス・ダンブルドア",
    "manufacturer": "INART",
    "brand": "スケールフィギュア",
    "series": "哈利·波特",
    "character": "阿不思·邓布利多",
    "price_cny": 2780,
    "price_jpy": null,
    "release_date": "2027-01-01",
    "status": "pre_order",
    "info_type": "预定时间",
    "description": "阿不思·邓布利多是魔法世界的传奇...",
    "accessories": ["INART可动素体", "磁吸可动眼植发植胡头雕", "巫师袍"],
    "images": [
      "https://img.hpoi.net/pic/...",
      "https://img.hpoi.net/pic/..."
    ],
    "urls": {
      "hpoi": "https://www.hpoi.net/hobby/119467",
      "gsc": null,
      "official": null
    },
    "price_history": {
      "current": 2780,
      "lowest": 2780,
      "highest": 2780,
      "currency": "CNY"
    },
    "created_at": "2026-03-28T10:00:00Z",
    "updated_at": "2026-03-28T18:00:00Z"
  }
}
```

---

### 2.3 获取手办价格历史

```http
GET /api/v1/figures/{figure_id}/prices
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| days | integer | 否 | 查询天数，默认90 |

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "figure_id": "fig-uuid-1",
    "currency": "CNY",
    "prices": [
      {
        "date": "2026-03-28",
        "price": 2780,
        "source": "hpoi"
      },
      {
        "date": "2026-03-27",
        "price": 2780,
        "source": "hpoi"
      }
    ],
    "summary": {
      "lowest": 2780,
      "highest": 2780,
      "average": 2780,
      "trend": "stable"
    }
  }
}
```

---

## 3. 新品情报API

### 3.1 获取情报列表

```http
GET /api/v1/news
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码，默认1 |
| limit | integer | 否 | 每页数量，默认20 |
| type | string | 否 | 类型: announced/pre_order/released/updated |
| source | string | 否 | 来源: hpoi/gsc |
| days | integer | 否 | 最近N天，默认7 |

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "news-uuid-1",
        "title": "Hot Toys MMS855D79 钢铁侠Mark 4 现已发售",
        "type": "released",
        "figure_id": "fig-uuid-2",
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

---

### 3.2 获取情报详情

```http
GET /api/v1/news/{news_id}
```

---

## 4. 厂商与筛选API

### 4.1 获取厂商列表

```http
GET /api/v1/manufacturers
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "mfr-inart",
        "name": "INART",
        "name_cn": "INART",
        "product_count": 12,
        "logo_url": null
      },
      {
        "id": "mfr-gsc",
        "name": "Good Smile Company",
        "name_cn": "良笑社",
        "product_count": 156,
        "logo_url": null
      }
    ]
  }
}
```

### 4.2 获取品牌线列表

```http
GET /api/v1/brands
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      { "id": "nendoroid", "name": "ねんどろいど", "name_cn": "粘土人" },
      { "id": "figma", "name": "figma", "name_cn": "figma" },
      { "id": "popup", "name": "POP UP PARADE", "name_cn": "POP UP PARADE" },
      { "id": "scale", "name": "スケールフィギュア", "name_cn": "比例手办" }
    ]
  }
}
```

---

## 5. 用户订阅API (需认证)

### 5.1 获取用户订阅列表

```http
GET /api/v1/user/subscriptions
Authorization: Bearer {jwt_token}
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "sub-uuid-1",
        "type": "manufacturer",
        "target_id": "mfr-inart",
        "target_name": "INART",
        "notify_new_product": true,
        "notify_price_drop": false,
        "created_at": "2026-03-28T10:00:00Z"
      }
    ]
  }
}
```

### 5.2 创建订阅

```http
POST /api/v1/user/subscriptions
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "type": "manufacturer|figure|series",
  "target_id": "mfr-inart",
  "notify_new_product": true,
  "notify_price_drop": true,
  "price_threshold": 2500
}
```

### 5.3 删除订阅

```http
DELETE /api/v1/user/subscriptions/{subscription_id}
Authorization: Bearer {jwt_token}
```

---

## 6. 用户收藏API (需认证)

### 6.1 获取收藏列表

```http
GET /api/v1/user/favorites
Authorization: Bearer {jwt_token}
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "fav-uuid-1",
        "figure_id": "fig-uuid-1",
        "figure": { /* 完整手办信息 */ },
        "note": "想买的",
        "status": "want",
        "created_at": "2026-03-28T10:00:00Z"
      }
    ]
  }
}
```

### 6.2 添加收藏

```http
POST /api/v1/user/favorites
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "figure_id": "fig-uuid-1",
  "note": "",
  "status": "want|ordered|owned|sold"
}
```

---

## 7. 搜索API

### 7.1 全局搜索

```http
GET /api/v1/search?q={keyword}
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "figures": {
      "total": 12,
      "items": [ /* 手办列表 */ ]
    },
    "manufacturers": {
      "total": 2,
      "items": [ /* 厂商列表 */ ]
    }
  }
}
```

---

## 8. 统计API

### 8.1 获取首页统计数据

```http
GET /api/v1/stats/home
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "total_figures": 15234,
    "new_today": 5,
    "pre_ordering": 1234,
    "manufacturers": 156,
    "recent_news": [ /* 最新5条情报 */ ]
  }
}
```

---

## 9. 错误码定义

| 状态码 | 说明 | 场景 |
|--------|------|------|
| 200 | 成功 | 请求成功 |
| 400 | 参数错误 | 缺少必填参数或格式错误 |
| 401 | 未认证 | 缺少Token或Token无效 |
| 403 | 无权限 | 用户无权访问该资源 |
| 404 | 资源不存在 | 手办/厂商ID不存在 |
| 429 | 请求过于频繁 | 超过API限流 |
| 500 | 服务器错误 | 内部错误 |

**错误响应格式**:
```json
{
  "code": 404,
  "message": "Figure not found",
  "error": {
    "type": "RESOURCE_NOT_FOUND",
    "detail": "Figure with id 'fig-xxx' does not exist"
  }
}
```

---

## 10. API限流

| 接口类型 | 限流策略 |
|----------|----------|
| 公开接口 | 100次/分钟/IP |
| 用户接口 | 1000次/分钟/用户 |
| 搜索接口 | 30次/分钟/IP |

---

**文档状态**: ✅ 详细API需求文档  
**创建时间**: 2026-03-28 21:35
