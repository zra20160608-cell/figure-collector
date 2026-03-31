'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsCard from '@/components/news/NewsCard';
import type { News } from '@/types';
import { NEWS_TYPE_LABELS } from '@/types';

// Mock 数据
const mockNews: News[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  type: ['announcement', 'pre_order', 'release', 'image_update', 'price_change'][Math.floor(Math.random() * 5)] as News['type'],
  title: `情报示例 ${i + 1} - ${['制作决定', '预定开放', '出荷情报', '官图更新', '价格变动'][Math.floor(Math.random() * 5)]}`,
  source: ['hpoi', 'gsc', 'official'][Math.floor(Math.random() * 3)] as News['source'],
  published_at: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date().toISOString(),
  figure: {
    id: i + 100,
    name: `手办示例 ${i + 1}`,
    thumbnail: '/placeholder.jpg',
    images: [],
    price: Math.floor(Math.random() * 20000) + 5000,
    currency: 'CNY',
    status: ['announced', 'pre_order', 'available'][Math.floor(Math.random() * 3)] as any,
    manufacturer: { id: Math.floor(Math.random() * 5) + 1, name: ['GSC', 'Hot Toys', 'INART', '海雅', '寿屋'][Math.floor(Math.random() * 5)], created_at: new Date().toISOString() },
    release_date: `2026-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any,
} as News));

const newsTypes = [
  { value: '', label: '全部' },
  { value: 'announcement', label: '制作决定' },
  { value: 'pre_order', label: '预定开放' },
  { value: 'release', label: '出荷情报' },
  { value: 'image_update', label: '官图更新' },
  { value: 'price_change', label: '价格变动' },
];

export default function NewsPage() {
  const [selectedType, setSelectedType] = useState('');

  const filteredNews = selectedType
    ? mockNews.filter((n) => n.type === selectedType)
    : mockNews;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">最新情报</h1>
          <p className="text-gray-600 mt-1">追踪手办行业最新动态</p>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {newsTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedType === type.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 情报列表 */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => <NewsCard key={news.id} news={news} />)
          ) : (
            <div className="text-center py-12 text-gray-500">
              暂无情报数据
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-4 flex items-center justify-center space-x-2">
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50" disabled>
            上一页
          </button>
          <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">1</button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">2</button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">3</button>
          <span className="text-gray-400">...</span>
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">50</button>
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            下一页
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
