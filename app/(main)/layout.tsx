import '@/app/globals.css'
import Sidebar from '@/components/layout/sidebar';
import TopBar from '@/components/layout/top-bar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <div className='ml-64 w-[calc(100%-16rem)] h-full'>
        <TopBar />
        <div className='mt-18'>
          {children}
        </div>
      </div>
    </div>
  )
}
