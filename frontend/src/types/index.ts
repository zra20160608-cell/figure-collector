// 类型定义

// 手办
export interface Figure {
  id: number;
  name: string;
  name_en?: string;
  name_jp?: string;
  thumbnail: string;
  images: string[];
  price: number;
  price_jpy?: number;
  currency: string;
  status: 'announced' | 'pre_order' | 'available' | 'sold_out';
  manufacturer: Manufacturer;
  brand?: Brand;
  release_date: string;
  description?: string;
  accessories?: string[];
  height?: string;
  series?: string;
  character?: string;
  created_at: string;
  updated_at: string;
}

// 厂商
export interface Manufacturer {
  id: number;
  name: string;
  name_en?: string;
  logo?: string;
  website?: string;
  description?: string;
  created_at: string;
}

// 品牌
export interface Brand {
  id: number;
  name: string;
  manufacturer_id: number;
  description?: string;
  created_at: string;
}

// 情报
export interface News {
  id: number;
  type: 'announcement' | 'pre_order' | 'release' | 'image_update' | 'price_change';
  title: string;
  content?: string;
  source: 'hpoi' | 'gsc' | 'official';
  source_url?: string;
  figure_id?: number;
  figure?: Figure;
  published_at: string;
  created_at: string;
}

// 用户
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  favorites_count: number;
  subscriptions_count: number;
  created_at: string;
}

// 收藏
export interface Favorite {
  id: number;
  user_id: number;
  figure_id: number;
  figure: Figure;
  created_at: string;
}

// 订阅
export interface Subscription {
  id: number;
  user_id: number;
  manufacturer_id?: number;
  brand_id?: number;
  manufacturer?: Manufacturer;
  brand?: Brand;
  created_at: string;
}

// 统计
export interface HomeStats {
  total_figures: number;
  new_today: number;
  pre_order_count: number;
  manufacturer_count: number;
}

// API 响应
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// 筛选参数
export interface FigureFilters {
  manufacturer_ids?: number[];
  brand_ids?: number[];
  min_price?: number;
  max_price?: number;
  status?: string;
  release_year?: number;
  sort?: 'default' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

// 新闻类型映射
export const NEWS_TYPE_LABELS: Record<News['type'], string> = {
  announcement: '制作决定',
  pre_order: '预定开放',
  release: '出荷情报',
  image_update: '官图更新',
  price_change: '价格变动',
};

export const NEWS_TYPE_COLORS: Record<News['type'], string> = {
  announcement: 'bg-blue-100 text-blue-700',
  pre_order: 'bg-yellow-100 text-yellow-700',
  release: 'bg-green-100 text-green-700',
  image_update: 'bg-purple-100 text-purple-700',
  price_change: 'bg-red-100 text-red-700',
};

// 手办状态映射
export const FIGURE_STATUS_LABELS: Record<Figure['status'], string> = {
  announced: '制作决定',
  pre_order: '预定中',
  available: '发售中',
  sold_out: '售罄',
};

export const FIGURE_STATUS_COLORS: Record<Figure['status'], string> = {
  announced: 'bg-blue-500',
  pre_order: 'bg-yellow-500',
  available: 'bg-green-500',
  sold_out: 'bg-red-500',
};
