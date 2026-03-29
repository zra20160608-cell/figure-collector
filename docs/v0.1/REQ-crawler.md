# 爬虫系统需求文档

**文档版本**: 1.0  
**创建时间**: 2026-03-28  
**项目**: figure-collector  
**基于**: PRD v0.2 功能需求拆解

---

## 1. 概述

### 1.1 目标
构建自动化数据抓取系统，从多平台采集手办信息。

### 1.2 数据源矩阵

| 数据源 | 优先级 | 抓取方式 | 频率 | 状态 |
|--------|--------|----------|------|------|
| Hpoi手办维基 | P0 | HTTP抓取 | 每6小时 | 已验证 ✅ |
| GSC官网 | P0 | HTTP抓取 | 每12小时 | 已验证 ✅ |
| B站会员购 | P1 | Playwright | 每24小时 | 待开发 |
| MyFigureCollection | P2 | 待定 | - | 受阻 |
| 淘宝 | P3 | Playwright+代理 | - | 待评估 |

---

## 2. Hpoi爬虫详细需求

### 2.1 抓取任务定义

#### 任务 1: 首页情报抓取 (HPOI-001)
**目标URL**: `https://www.hpoi.net`  
**抓取频率**: 每6小时  
**优先级**: P0

**抓取字段**:
| 字段名 | 类型 | 必选 | 说明 |
|--------|------|------|------|
| news_id | string | 是 | 情报唯一ID |
| title | string | 是 | 情报标题 |
| info_type | enum | 是 | 制作决定/预定/出荷/官图更新 |
| figure_id | string | 否 | 关联手办ID |
| posted_time | string | 是 | 发布时间(相对) |
| source_url | string | 是 | 原文链接 |

**输出示例**:
```json
{
  "task_id": "hpoi-news-202603281800",
  "source": "hpoi",
  "crawled_at": "2026-03-28T18:00:00Z",
  "items": [
    {
      "news_id": "hpoi-news-122027",
      "title": "Hot Toys MMS855D79 钢铁侠Mark 4 现已发售",
      "info_type": "出荷时间",
      "figure_id": "hpoi-122027",
      "posted_time": "5小时前",
      "source_url": "https://www.hpoi.net/hobby/122027"
    }
  ]
}
```

---

#### 任务 2: 手办列表抓取 (HPOI-002)
**目标URL**: `https://www.hpoi.net/hobby/all`  
**抓取频率**: 每12小时  
**优先级**: P0

**抓取字段**:
| 字段名 | 类型 | 必选 | 说明 |
|--------|------|------|------|
| source_id | string | 是 | Hpoi平台ID |
| name | string | 是 | 商品名称 |
| manufacturer | string | 是 | 厂商 |
| release_date | string | 是 | 出荷时间 |
| price | string | 是 | 价格(含币种) |
| price_cny | number | 否 | 人民币价格 |
| product_url | string | 是 | 详情页链接 |

**分页策略**:
- 检测页面是否支持分页
- 如支持: 顺序抓取所有页面，间隔3秒
- 如不支持: 单页抓取

**异常处理**:
- HTTP 429: 等待60秒后重试，最多3次
- HTTP 403: 标记为受阻，通知管理员
- 超时(>10s): 重试2次后跳过

---

#### 任务 3: 手办详情抓取 (HPOI-003)
**目标URL**: `https://www.hpoi.net/hobby/{id}`  
**触发条件**: 发现新商品或更新情报  
**优先级**: P1

**抓取字段**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| source_id | string | Hpoi ID |
| name | string | 完整名称 |
| name_jp | string | 日文名(如有) |
| manufacturer | string | 厂商 |
| description | string | 详细描述 |
| accessories | array | 配件清单 |
| images | array | 图片URL列表 |
| specs | object | 规格参数 |

---

### 2.2 Hpoi爬虫技术规范

#### 请求配置
```python
{
  "headers": {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
  },
  "timeout": 10,
  "retry": 3,
  "retry_delay": 5
}
```

#### 抓取间隔
- 同域名请求间隔: ≥3秒
- 异常后重试间隔: 60秒
- 每日抓取窗口: 00:00-06:00, 12:00-18:00 (低峰期)

---

## 3. GSC爬虫详细需求

### 3.1 抓取任务定义

#### 任务 1: 新品列表抓取 (GSC-001)
**目标URL**: `https://www.goodsmile.com/ja`  
**抓取频率**: 每12小时  
**优先级**: P0

**抓取字段**:
| 字段名 | 类型 | 必选 | 说明 |
|--------|------|------|------|
| source_id | string | 是 | GSC商品ID |
| name_jp | string | 是 | 日文名称 |
| manufacturer | string | 是 | 厂商 |
| brand | string | 是 | 品牌线 |
| price_jpy | number | 是 | 日元价格 |
| status | string | 是 | 予約受付中/已完售 |
| has_bonus | boolean | 否 | 是否含特典 |
| is_reissue | boolean | 否 | 是否再贩 |
| product_url | string | 是 | 详情链接 |

**品牌线枚举**:
- ねんどろいどシリーズ
- figma
- スケールフィギュア
- POP UP PARADE
- Harmonia シリーズ
- HELLO! GOOD SMILE

---

### 3.2 GSC爬虫技术规范

#### 请求配置
```python
{
  "headers": {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept-Language": "ja-JP,ja;q=0.9",
    "Accept-Encoding": "gzip, deflate, br"
  },
  "timeout": 15,
  "retry": 3,
  "retry_delay": 10
}
```

**注意**: GSC响应较慢(1800ms+)，需设置更长超时。

---

## 4. 数据清洗与标准化

### 4.1 价格标准化
**输入格式示例**:
- Hpoi: "2780人民币", "495美元", "559美元"
- GSC: "￥3,900", "￥21,200"

**输出格式**:
```json
{
  "price_original": "2780人民币",
  "price_cny": 2780,
  "price_jpy": null,
  "price_usd": null,
  "currency": "CNY"
}
```

**汇率转换**:
- 人民币: 直接使用
- 日元: 当日汇率(缓存24小时)
- 美元: 当日汇率(缓存24小时)

### 4.2 时间标准化
**输入格式示例**:
- "2027年"
- "2026年3月31日"
- "2026年4月17日出货"

**输出格式**: ISO 8601 (`2027-01-01` 或 `2026-03-31`)

### 4.3 厂商标准化
建立厂商名称映射表:
```json
{
  "グッドスマイルカンパニー": "Good Smile Company",
  "マックスファクトリー": "Max Factory",
  "Hot Toys": "Hot Toys",
  "INART": "INART",
  "海雅玩具": "Hiya Toys"
}
```

---

## 5. 任务调度系统

### 5.1 调度器需求

| 需求ID | 描述 | 优先级 |
|--------|------|--------|
| SCH-001 | 支持定时任务(cron表达式) | P0 |
| SCH-002 | 支持任务优先级队列 | P0 |
| SCH-003 | 支持任务失败重试机制 | P0 |
| SCH-004 | 支持任务并发控制 | P1 |
| SCH-005 | 提供任务执行状态API | P1 |

### 5.2 任务配置示例
```yaml
tasks:
  - name: hpoi_news
    source: hpoi
    type: news
    schedule: "0 */6 * * *"  # 每6小时
    priority: 10
    timeout: 30
    retry: 3
    
  - name: hpoi_list
    source: hpoi
    type: list
    schedule: "0 0,12 * * *"  # 每天0点和12点
    priority: 5
    timeout: 120
    retry: 3
    
  - name: gsc_new
    source: gsc
    type: new_products
    schedule: "0 2 * * *"  # 每天凌晨2点
    priority: 8
    timeout: 60
    retry: 3
```

---

## 6. 监控与告警

### 6.1 监控指标

| 指标 | 类型 | 阈值 | 告警级别 |
|------|------|------|----------|
| 任务成功率 | 百分比 | <95% | 警告 |
| 平均响应时间 | 毫秒 | >5000ms | 警告 |
| 数据增量 | 数量 | =0 (24h) | 严重 |
| 错误率 | 百分比 | >10% | 严重 |

### 6.2 告警方式
- 日志记录: 所有异常
- 通知: 严重级别发送邮件/消息
-  dashboard: 实时任务状态面板

---

## 7. 存储需求

### 7.1 原始数据存储
- 保留原始HTML(可选，7天)
- 存储清洗后的JSON数据
- 存储任务执行日志

### 7.2 存储位置
```
/raw_data/{source}/{date}/{task_id}.html
/parsed_data/{source}/{date}/{task_id}.json
/logs/{date}/{task_id}.log
```

---

## 8. 接口定义

### 8.1 启动抓取任务
```http
POST /api/crawler/tasks
{
  "source": "hpoi",
  "type": "news",
  "priority": 10
}

Response:
{
  "task_id": "task-uuid",
  "status": "queued",
  "estimated_start": "2026-03-28T18:00:00Z"
}
```

### 8.2 查询任务状态
```http
GET /api/crawler/tasks/{task_id}

Response:
{
  "task_id": "task-uuid",
  "status": "completed|failed|running|queued",
  "progress": 100,
  "items_count": 25,
  "started_at": "2026-03-28T18:00:00Z",
  "completed_at": "2026-03-28T18:00:30Z",
  "logs": [...]
}
```

---

**文档状态**: ✅ 详细需求文档  
**创建时间**: 2026-03-28 21:30
