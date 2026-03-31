import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FigureHub - 手办信息聚合平台",
  description: "手办信息聚合平台，为您追踪最新情报、价格动态和发售信息。支持多平台数据同步，让您不错过任何一款心仪的手办。",
  keywords: ["手办", "figure", "收藏", "情报", "价格监控", "Hpoi", "GSC"],
  authors: [{ name: "FigureHub Team" }],
  openGraph: {
    title: "FigureHub - 手办信息聚合平台",
    description: "手办信息聚合平台，为您追踪最新情报、价格动态和发售信息。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
