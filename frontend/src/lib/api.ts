// API 客户端配置
import axios from 'axios';
import type { ApiResponse, PaginatedResponse, Figure, News, Manufacturer, Brand, HomeStats, FigureFilters } from '@/types';

// API 基础 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，跳转到登录页
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API 函数
export const api = {
  // 首页统计
  getHomeStats: async () => {
    const response = await apiClient.get<ApiResponse<HomeStats>>('/stats/home');
    return response.data.data;
  },

  // 获取最新情报
  getNews: async (limit = 5) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<News>>>(`/news?limit=${limit}`);
    return response.data.data;
  },

  // 获取推荐手办
  getRecommendedFigures: async (limit = 8) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Figure>>>(`/figures?limit=${limit}`);
    return response.data.data;
  },

  // 获取手办列表
  getFigures: async (filters: FigureFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.manufacturer_ids?.length) params.append('manufacturer_ids', filters.manufacturer_ids.join(','));
    if (filters.brand_ids?.length) params.append('brand_ids', filters.brand_ids.join(','));
    if (filters.min_price) params.append('min_price', filters.min_price.toString());
    if (filters.max_price) params.append('max_price', filters.max_price.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.release_year) params.append('release_year', filters.release_year.toString());

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Figure>>>(`/figures?${params}`);
    return response.data.data;
  },

  // 获取手办详情
  getFigureDetail: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Figure>>(`/figures/${id}`);
    return response.data.data;
  },

  // 获取厂商列表
  getManufacturers: async () => {
    const response = await apiClient.get<ApiResponse<Manufacturer[]>>('/manufacturers');
    return response.data.data;
  },

  // 获取品牌列表
  getBrands: async () => {
    const response = await apiClient.get<ApiResponse<Brand[]>>('/brands');
    return response.data.data;
  },

  // 获取情报列表
  getNewsList: async (type?: string, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (type) params.append('type', type);

    const response = await apiClient.get<ApiResponse<PaginatedResponse<News>>>(`/news?${params}`);
    return response.data.data;
  },

  // 用户登录
  login: async (username: string, password: string) => {
    const response = await apiClient.post<ApiResponse<{ access_token: string; user: { id: number; username: string } }>>('/auth/login', {
      username,
      password,
    });
    return response.data.data;
  },

  // 获取收藏列表
  getFavorites: async () => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<{ id: number; figure: Figure }>>>('/user/favorites');
    return response.data.data;
  },

  // 添加收藏
  addFavorite: async (figureId: number) => {
    const response = await apiClient.post<ApiResponse<{ id: number }>>('/user/favorites', { figure_id: figureId });
    return response.data.data;
  },

  // 取消收藏
  removeFavorite: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/user/favorites/${id}`);
    return response.data.data;
  },
};

export default apiClient;
