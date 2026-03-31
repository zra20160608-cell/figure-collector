'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// 筛选侧边栏组件
function FilterSidebar() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">筛选</h3>
      
      {/* 厂商筛选 */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">厂商</h4>
        <div className="space-y-2">
          {['Hot Toys', 'INART', 'GSC', '海雅玩具', '寿屋'].map((mfr) => (
            <label key={mfr} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-indigo-600" />
              <span className="text-sm text-gray-600">{mfr}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 品牌筛选 */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">品牌</h4>
        <div className="space-y-2">
          {['粘土人', 'figma', 'POP UP PARADE', '比例手办'].map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-indigo-600" />
              <span className="text-sm text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 价格筛选 */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">价格区间</h4>
        <div className="space-y-2">
          {['¥0-500', '¥500-1000', '¥1000-2000', '¥2000+'].map((price) => (
            <label key={price} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-indigo-600" />
              <span className="text-sm text-gray-600">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 状态筛选 */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">状态</h4>
        <div className="space-y-2">
          {[
            { label: '预定中', color: 'bg-amber-500' },
            { label: '已发售', color: 'bg-green-500' },
            { label: '制作决定', color: 'bg-blue-500' },
          ].map(({ label, color }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-indigo-600" />
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// 手办卡片组件
function FigureCard({ figure }: { figure: any }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group">
      <div className="aspect-[3/4] bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:opacity-0 transition">
          图片
        </div>
        <span className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
          预定中
        </span>
        <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
          <span className="text-gray-600">❤️</span>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{figure.name}</h3>
        <p className="text-indigo-600 font-bold mt-1">¥{figure.price.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">
          {figure.manufacturer} · {figure.brand} · {figure.releaseYear}
        </p>
      </div>
    </div>
  );
}

export default function FiguresPage() {
  const [sortBy, setSortBy] = useState('default');

  // 模拟数据
  const figures = [
    { id: 1, name: '粘土人 蕾姆', price: 6800, manufacturer: 'GSC', brand: '粘土人', releaseYear: '2026年' },
    { id: 2, name: 'figma 阿尔托莉雅', price: 12800, manufacturer: 'Max Factory', brand: 'figma', releaseYear: '2026年' },
    { id: 3, name: 'POP UP PARADE 拉姆', price: 5500, manufacturer: 'GSC', brand: 'POP UP PARADE', releaseYear: '2026年' },
    { id: 4, name: '哈利·波特 邓布利多', price: 27800, manufacturer: 'INART', brand: '比例手办', releaseYear: '2027年' },
    { id: 5, name: '钢铁侠 Mark 4', price: 26800, manufacturer: 'Hot Toys', brand: '比例手办', releaseYear: '2026年' },
    { id: 6, name: '粘土人 惠惠', price: 6800, manufacturer: 'GSC', brand: '粘土人', releaseYear: '2026年' },
    { id: 7, name: 'figma 初音未来', price: 9800, manufacturer: 'Max Factory', brand: 'figma', releaseYear: '2026年' },
    { id: 8, name: '比例手办 Saber', price: 25000, manufacturer: 'Alter', brand: '比例手办', releaseYear: '2027年' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑 */}
        <nav className="text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">手办列表</span>
        </nav>

        <div className="flex gap-8">
          {/* 侧边栏 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* 主内容区 */}
          <div className="flex-1">
            {/* 顶部工具栏 */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                共 <span className="font-medium text-gray-900">{figures.length}</span> 个手办
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="default">默认排序</option>
                <option value="price_asc">价格从低到高</option>
                <option value="price_desc">价格从高到低</option>
                <option value="newest">最新发布</option>
              </select>
            </div>

            {/* 手办网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {figures.map((figure) => (
                <FigureCard key={figure.id} figure={figure} />
              ))}
            </div>

            {/* 分页 */}
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50">
                  上一页
                </button>
                {[1, 2, 3, '...', 10].map((page, i) => (
                  <button
                    key={i}
                    className={`px-3 py-2 rounded ${
                      page === 1
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 text-gray-700 hover:text-gray-900">
                  下一页
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}