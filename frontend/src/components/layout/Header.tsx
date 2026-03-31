// Header 组件
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUserStore } from '@/store';

export default function Header() {
  const { isAuthenticated, user, logout } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">📊</span>
              <span className="text-xl font-bold text-indigo-600">FigureHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition">
              首页
            </Link>
            <Link href="/figures" className="text-gray-700 hover:text-indigo-600 transition">
              手办列表
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-indigo-600 transition">
              情报
            </Link>
            <Link href="/manufacturers" className="text-gray-700 hover:text-indigo-600 transition">
              厂商
            </Link>
            <Link href="/brands" className="text-gray-700 hover:text-indigo-600 transition">
              品牌
            </Link>
          </div>

          {/* Search & User */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索手办..."
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/user" className="text-gray-700 hover:text-indigo-600 transition">
                  {user?.username || '用户中心'}
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                登录
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">首页</Link>
              <Link href="/figures" className="text-gray-700 hover:text-indigo-600">手办列表</Link>
              <Link href="/news" className="text-gray-700 hover:text-indigo-600">情报</Link>
              <Link href="/manufacturers" className="text-gray-700 hover:text-indigo-600">厂商</Link>
              <Link href="/brands" className="text-gray-700 hover:text-indigo-600">品牌</Link>
              {isAuthenticated ? (
                <>
                  <Link href="/user" className="text-gray-700 hover:text-indigo-600">用户中心</Link>
                  <button onClick={logout} className="text-left text-gray-500">退出</button>
                </>
              ) : (
                <Link href="/login" className="text-indigo-600 font-medium">登录</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
