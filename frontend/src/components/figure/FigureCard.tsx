// FigureCard 组件
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFavoriteStore } from '@/store';
import type { Figure } from '@/types';
import { FIGURE_STATUS_LABELS, FIGURE_STATUS_COLORS } from '@/types';

interface FigureCardProps {
  figure: Figure;
}

export default function FigureCard({ figure }: FigureCardProps) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const favorite = isFavorite(figure.id);

  // 格式化价格
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency || 'CNY',
    }).format(price);
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* 图片区域 */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <Link href={`/figures/${figure.id}`}>
          <Image
            src={figure.thumbnail || '/placeholder-figure.jpg'}
            alt={figure.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
        </Link>
        
        {/* 状态标签 */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white ${FIGURE_STATUS_COLORS[figure.status]}`}>
          {FIGURE_STATUS_LABELS[figure.status]}
        </div>

        {/* 收藏按钮 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(figure.id);
          }}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition shadow-sm"
        >
          <svg
            className={`w-5 h-5 ${favorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            fill={favorite ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        <Link href={`/figures/${figure.id}`}>
          <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-indigo-600 transition mb-2">
            {figure.name}
          </h3>
        </Link>

        {/* 价格 */}
        <div className="text-lg font-bold text-indigo-600 mb-2">
          {formatPrice(figure.price, figure.currency)}
          {figure.price_jpy && figure.price_jpy !== figure.price && (
            <span className="text-sm text-gray-500 ml-2 font-normal">
              ¥{figure.price_jpy.toLocaleString()} (JPY)
            </span>
          )}
        </div>

        {/* 元信息 */}
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>{figure.manufacturer?.name}</span>
            {figure.brand && <span>| {figure.brand.name}</span>}
          </div>
          <div>出荷：{formatDate(figure.release_date)}</div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
          <button className="flex-1 px-3 py-1.5 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition">
            详情
          </button>
          <button className="flex-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            🔔 提醒
          </button>
        </div>
      </div>
    </div>
  );
}
