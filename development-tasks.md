# MVP开发任务清单

**项目**: figure-collector  
**阶段**: Phase 3 - MVP开发  
**开始时间**: 2026-03-31  
**计划周期**: Week 5-8 (约4周)

---

## 开发里程碑

### Milestone 1: 基础环境搭建 (Day 1-2)
| 任务ID | 任务 | 负责人 | 状态 |
|--------|------|--------|:----:|
| DEV-001 | 项目结构初始化 | All | ⏳ |
| DEV-002 | Docker环境搭建 | DevOps | ⏳ |
| DEV-003 | 数据库创建 | Backend | ⏳ |

### Milestone 2: 核心API开发 (Day 3-10)
| 任务ID | 任务 | 负责人 | 状态 |
|--------|------|--------|:----:|
| DEV-101 | Figures API (列表/筛选) | Backend | ⏳ |
| DEV-102 | Figures API (详情) | Backend | ⏳ |
| DEV-103 | News API | Backend | ⏳ |
| DEV-104 | Manufacturers/Brands API | Backend | ⏳ |
| DEV-105 | 用户认证 API | Backend | ⏳ |

### Milestone 3: 爬虫开发 (Day 5-12)
| 任务ID | 任务 | 负责人 | 状态 |
|--------|------|--------|:----:|
| DEV-201 | Hpoi爬虫 (首页情报) | Crawler | ⏳ |
| DEV-202 | Hpoi爬虫 (列表/详情) | Crawler | ⏳ |
| DEV-203 | GSC爬虫 | Crawler | ⏳ |
| DEV-204 | 数据清洗模块 | Crawler | ⏳ |
| DEV-205 | 任务调度配置 | Crawler | ⏳ |

### Milestone 4: 前端开发 (Day 7-20)
| 任务ID | 任务 | 负责人 | 状态 |
|--------|------|--------|:----:|
| DEV-301 | 首页开发 | Frontend | ⏳ |
| DEV-302 | 手办列表页 | Frontend | ⏳ |
| DEV-303 | 手办详情页 | Frontend | ⏳ |
| DEV-304 | 情报列表页 | Frontend | ⏳ |
| DEV-305 | 厂商/品牌页 | Frontend | ⏳ |
| DEV-306 | 用户中心 | Frontend | ⏳ |

### Milestone 5: 用户功能 (Day 15-22)
| 任务ID | 任务 | 负责人 | 状态 |
|--------|------|--------|:----:|
| DEV-401 | 用户注册/登录 | Backend | ⏳ |
| DEV-402 | 收藏功能 | Backend+Frontend | ⏳ |
| DEV-403 | 订阅功能 | Backend+Frontend | ⏳ |

### Milestone 6: 测试与部署 (Day 23-28)
| 任务ID | 任务 | 负责人 | 状态 |
|--------|------|--------|:----:|
| DEV-501 | 单元测试 | QA | ⏳ |
| DEV-502 | 集成测试 | QA | ⏳ |
| DEV-503 | 部署上线 | DevOps | ⏳ |

---

## 技术栈清单

### 后端
- Node.js 18+ / Python 3.11+
- Express / FastAPI
- PostgreSQL 14
- Redis 7
- Prisma / SQLAlchemy
- JWT / bcrypt
- Docker

### 前端
- Next.js 14
- TypeScript 5
- Tailwind CSS
- Zustand
- React Query
- Axios

### 爬虫
- Python 3.11
- Requests / httpx
- BeautifulSoup / lxml
- Playwright (动态页面)
- schedule / APScheduler

---

## 代码仓库结构

```
figure-collector/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── stores/
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── crawler/                 # 爬虫服务
│   ├── src/
│   │   ├── crawlers/
│   │   ├── parsers/
│   │   ├── cleaners/
│   │   └── scheduler/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml       # 容器编排
├── .env.example            # 环境变量模板
└── README.md
```

---

## 环境变量配置

```env
# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/figure_collector

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 爬虫
CRAWLER_INTERVAL_HOURS=6

# 前端
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

**创建时间**: 2026-03-31 14:45  
**状态**: 开发阶段启动