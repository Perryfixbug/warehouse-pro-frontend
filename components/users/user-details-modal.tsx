'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { User } from '@/type/type'

interface UserDetailsModalProps {
  user: User
  onClose: () => void
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <div>
            <CardTitle className='text-xl'>{user.fullname}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Số Điện Thoại</p>
              <p className="text-base font-semibold">{user.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Địa Chỉ</p>
              <p className="text-base font-semibold">{user.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vai Trò</p>
              <p className="text-base font-semibold">
                {user.role === 'admin' ? 'Quản Trị Viên' :
                 user.role === 'manager' ? 'Người Quản Lý' :
                 'Nhân Viên'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày Sinh</p>
              <p className="text-base font-semibold">{new Date(user.birth_date).toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày Tham Gia</p>
              <p className="text-base font-semibold">{new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
