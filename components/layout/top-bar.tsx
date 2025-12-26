'use client'

import { Search, User, Settings, LogOut, UserCog } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import NotificationBell from '@/components/notification-bell'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function TopBar() {
  const { info } = useAuth()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const {logout} = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = async () => {
    try {
      logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleNavigate = (path: string) => {
    router.push(path)
    setIsDropdownOpen(false)
  }

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

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className='w-fit py-1 px-2'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <User size={20} />
            <span className="ml-2">{info?.fullname}</span>
          </Button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-border">
                <p className="font-medium text-sm">{info?.fullname}</p>
                <p className="text-xs text-muted-foreground">{info?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => handleNavigate('/profile')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 transition-colors"
                >
                  <UserCog size={16} />
                  Hồ Sơ Cá Nhân
                </button>

                <button
                  onClick={() => handleNavigate('/settings')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 transition-colors"
                >
                  <Settings size={16} />
                  Cài Đặt
                </button>

                <div className="border-t border-border my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Đăng Xuất
                </button>
              </div>
            </div>
          )}
        </div>

        <Button 
          variant="ghost" size="icon"
          onClick={() => router.push('/settings')}
        >
          <Settings size={20} />
        </Button>
      </div>
    </div>
  )
}
