import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/sidebar';
import TopBar from '@/components/layout/top-bar';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Warehouse Management System',
  description: 'Quản lý kho hàng chuyên nghiệp - Professional warehouse management',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans antialiased h-screen`}>
        <div className="flex">
          <Sidebar />
          <div className='ml-64 w-[calc(100%-16rem)] h-full'>
            <TopBar />
            <div className='mt-18'>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
