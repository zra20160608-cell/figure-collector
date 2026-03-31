// Zustand 状态管理
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Figure, Favorite, Subscription, Manufacturer, Brand } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

interface FavoriteState {
  favorites: number[]; // 存储收藏的手办 ID
  toggleFavorite: (figureId: number) => void;
  isFavorite: (figureId: number) => boolean;
}

interface SubscriptionState {
  manufacturers: number[]; // 订阅的厂商 ID
  brands: number[]; // 订阅的品牌 ID
  subscribeManufacturer: (id: number) => void;
  unsubscribeManufacturer: (id: number) => void;
  subscribeBrand: (id: number) => void;
  unsubscribeBrand: (id: number) => void;
  isSubscribedManufacturer: (id: number) => boolean;
  isSubscribedBrand: (id: number) => boolean;
}

interface FilterState {
  selectedManufacturers: number[];
  selectedBrands: number[];
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sort: 'default' | 'price_asc' | 'price_desc' | 'newest';
  page: number;
  setManufacturerFilter: (ids: number[]) => void;
  setBrandFilter: (ids: number[]) => void;
  setPriceFilter: (min?: number, max?: number) => void;
  setStatusFilter: (status?: string) => void;
  setSort: (sort: 'default' | 'price_asc' | 'price_desc' | 'newest') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

// 用户状态
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      setAuth: (user, token) => set({ user, isAuthenticated: true, token }),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// 收藏状态
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (figureId) => {
        const current = get().favorites;
        const exists = current.includes(figureId);
        set({ favorites: exists ? current.filter((id) => id !== figureId) : [...current, figureId] });
      },
      isFavorite: (figureId) => get().favorites.includes(figureId),
    }),
    {
      name: 'favorites-storage',
    }
  )
);

// 订阅状态
export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      manufacturers: [],
      brands: [],
      subscribeManufacturer: (id) => set((state) => ({ manufacturers: [...state.manufacturers, id] })),
      unsubscribeManufacturer: (id) => set((state) => ({ manufacturers: state.manufacturers.filter((m) => m !== id) })),
      subscribeBrand: (id) => set((state) => ({ brands: [...state.brands, id] })),
      unsubscribeBrand: (id) => set((state) => ({ brands: state.brands.filter((b) => b !== id) })),
      isSubscribedManufacturer: (id) => get().manufacturers.includes(id),
      isSubscribedBrand: (id) => get().brands.includes(id),
    }),
    {
      name: 'subscriptions-storage',
    }
  )
);

// 筛选状态
export const useFilterStore = create<FilterState>()((set) => ({
  selectedManufacturers: [],
  selectedBrands: [],
  minPrice: undefined,
  maxPrice: undefined,
  status: undefined,
  sort: 'default',
  page: 1,
  setManufacturerFilter: (ids) => set({ selectedManufacturers: ids, page: 1 }),
  setBrandFilter: (ids) => set({ selectedBrands: ids, page: 1 }),
  setPriceFilter: (min, max) => set({ minPrice: min, maxPrice: max, page: 1 }),
  setStatusFilter: (status) => set({ status, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      selectedManufacturers: [],
      selectedBrands: [],
      minPrice: undefined,
      maxPrice: undefined,
      status: undefined,
      sort: 'default',
      page: 1,
    }),
}));
