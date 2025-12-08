'use client'

import { Search, User, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import NotificationBell from '@/components/notification-bell'

export default function TopBar() {
  const { info } = useAuth()
  return (
    <div className="fixed w-[calc(100%-16rem)] bg-card border-b border-border px-6 py-4 flex items-center justify-between gap-4 z-50">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Tìm kiếm sản phẩm, đơn hàng..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="h-8 w-px bg-border" />

        <Button variant="ghost" size="icon" className='w-fit py-1 px-2'>
          <User size={20} />
          { info?.fullname}
        </Button>

        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
      </div>
    </div>
  )
}
