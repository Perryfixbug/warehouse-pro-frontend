import '@/app/globals.css'
import ProtectedLayout from '@/components/layout/protected';
import Sidebar from '@/components/layout/sidebar';
import TopBar from '@/components/layout/top-bar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedLayout>
      <div className="flex">
        <Sidebar />
        <div className='ml-64 w-[calc(100%-16rem)] h-full'>
          <TopBar />
          <div className='mt-18'>
            {children}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
