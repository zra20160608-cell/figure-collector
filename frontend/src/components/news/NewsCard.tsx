// NewsCard 组件
'use client';

import Link from 'next/link';
import type { News } from '@/types';
import { NEWS_TYPE_LABELS, NEWS_TYPE_COLORS } from '@/types';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  // 格式化时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  };

  // 来源映射
  const sourceLabels: Record<string, string> = {
    hpoi: 'Hpoi',
    gsc: 'GSC',
    official: '官方',
  };

  return (
    <div className="bg-white rounded-lg p-4 hover:bg-gray-50 transition border border-gray-100">
      <div className="flex items-start space-x-3">
        {/* 类型标签 */}
        <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${NEWS_TYPE_COLORS[news.type]}`}>
          {NEWS_TYPE_LABELS[news.type]}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          {news.figure ? (
            <Link href={`/figures/${news.figure.id}`}>
              <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition line-clamp-2">
                {news.title}
              </h3>
            </Link>
          ) : (
            <h3 className="font-medium text-gray-900 line-clamp-2">{news.title}</h3>
          )}

          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>{news.figure?.manufacturer?.name || '未知厂商'}</span>
            <span>•</span>
            <span>{formatTime(news.published_at)}</span>
            <span>•</span>
            <span className="text-indigo-600">{sourceLabels[news.source] || news.source}</span>
          </div>

          {/* 关联手办 */}
          {news.figure && (
            <div className="mt-2 text-sm">
              <Link
                href={`/figures/${news.figure.id}`}
                className="text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                🔗 {news.figure.name} - {NEWS_TYPE_LABELS[news.figure.status as keyof typeof NEWS_TYPE_LABELS] || '未知状态'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
