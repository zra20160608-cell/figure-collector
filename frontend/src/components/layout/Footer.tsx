// Footer 组件
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 关于 */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📊</span>
              <span className="text-xl font-bold text-indigo-600">FigureHub</span>
            </div>
            <p className="text-gray-600 text-sm">
              手办信息聚合平台，为您追踪最新情报、价格动态和发售信息。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/figures" className="hover:text-indigo-600 transition">
                  手办列表
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-indigo-600 transition">
                  最新情报
                </Link>
              </li>
              <li>
                <Link href="/manufacturers" className="hover:text-indigo-600 transition">
                  厂商大全
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-indigo-600 transition">
                  品牌线
                </Link>
              </li>
            </ul>
          </div>

          {/* 用户 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">用户</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition">
                  登录
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-600 transition">
                  注册
                </Link>
              </li>
              <li>
                <Link href="/user" className="hover:text-indigo-600 transition">
                  用户中心
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-indigo-600 transition">
                  设置
                </Link>
              </li>
            </ul>
          </div>

          {/* 关于项目 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">关于</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-indigo-600 transition">
                  关于我们
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/zra20160608-cell/figure-collector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-indigo-600 transition">
                  反馈建议
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 FigureHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
