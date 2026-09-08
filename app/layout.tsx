import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import "./fonts/misans/misans.css"
import { THEME_INIT_SCRIPT } from "@/lib/theme/theme"

// 字体：Geist 管英文和数字；中文 Mac 走苹方，Windows 走 MiSans 切片兜底
//（由 scripts/fonts/prepare-misans.mjs 在 postinstall 生成，输出目录已 gitignore）。
// woff2 复制自 geist@1.7.2，SIL OFL 1.1，许可证见 app/fonts/GEIST-LICENSE.txt。本地加载，不依赖外网。
const geistSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
})
const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
})

export const metadata: Metadata = {
  title: "数据看板",
  description: "基于 KA Pilot 设计系统的数据看板",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-theme-mode="bw"
      suppressHydrationWarning
    >
      <body>
        {/* 首屏前按本机记忆设置主题模式与主色，避免闪一下默认色。规则必须和 lib/theme/theme.ts 保持一致。 */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  )
}
