'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, AlertCircle, Users, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Sản phẩm', icon: Package },
  { href: '/orders', label: 'Đơn hàng', icon: ShoppingCart },
  { href: '/inventory', label: 'Cảnh báo', icon: AlertCircle },
  { href: '/users', label: 'Người dùng', icon: Users },
  { href: '/settings', label: 'Cài đặt', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed w-64 bg-slate-900 text-white h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold">WMS</h1>
        <p className="text-sm text-slate-400">Warehouse Management</p>
      </div>

      <nav className="space-y-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm">Admin</p>
            <p className="text-xs text-slate-400">Quản trị viên</p>
          </div>
        </div>
      </div>
    </div>
  )
}
