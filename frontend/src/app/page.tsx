import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero区域 */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            欢迎来到 FigureHub
          </h1>
          <p className="text-lg opacity-90 mb-6">
            手办信息聚合平台，追踪最新情报、价格动态和发售信息
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/figures"
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              浏览手办
            </Link>
            <Link
              href="/news"
              className="px-6 py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition"
            >
              最新情报
            </Link>
          </div>
        </section>

        {/* 统计卡片 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-indigo-600">15,234</div>
            <div className="text-gray-600 text-sm mt-1">手办总数</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600">+5</div>
            <div className="text-gray-600 text-sm mt-1">今日新品</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-amber-600">1,234</div>
            <div className="text-gray-600 text-sm mt-1">预定中</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">156</div>
            <div className="text-gray-600 text-sm mt-1">厂商数</div>
          </div>
        </section>

        {/* 最新情报 */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">最新情报</h2>
            <Link href="/news" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              查看全部 →
            </Link>
          </div>
          <div className="grid gap-4">
            {/* 情报卡片1 */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex items-start gap-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">出荷时间</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Hot Toys MMS855D79 钢铁侠Mark 4 现已发售</h3>
                  <p className="text-sm text-gray-500 mt-1">Hot Toys · 5小时前</p>
                </div>
              </div>
            </div>
            {/* 情报卡片2 */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex items-start gap-4">
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">预定时间</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">GSC 粘土人 蕾姆 开放预购</h3>
                  <p className="text-sm text-gray-500 mt-1">Good Smile Company · 昨天</p>
                </div>
              </div>
            </div>
            {/* 情报卡片3 */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex items-start gap-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">制作决定</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">INART 哈利·波特 阿不思·邓布利多 2027年出荷</h3>
                  <p className="text-sm text-gray-500 mt-1">INART · 2天前</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 热门手办 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">为你推荐</h2>
            <Link href="/figures" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 手办卡片 */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                <div className="aspect-[3/4] bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    图片
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
                    预定中
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">粘土人 蕾姆</h3>
                  <p className="text-indigo-600 font-bold mt-1">¥6,800</p>
                  <p className="text-xs text-gray-500 mt-1">GSC · 粘土人 · 2026年</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}