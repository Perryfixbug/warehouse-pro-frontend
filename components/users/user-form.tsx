'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { User } from '@/type/type'

interface UserFormProps {
  user?: User | null
  onSave: (data: Omit<User, 'id' >) => void
  onClose: () => void
}

export function UserForm({ user, onSave, onClose }: UserFormProps) {
  const [formData, setFormData] = useState<Omit<User, 'id' >>({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    role: user?.role || 'staff',
    birth_date: user?.birth_date || new Date().toISOString().split('T')[0],
    created_at: user?.created_at || ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold">
            {user ? 'Cập Nhật Người Dùng' : 'Thêm Người Dùng Mới'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Tên *</label>
            <Input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Nhập tên"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Email *</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Số Điện Thoại</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0987654321"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Địa Chỉ</label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Vai Trò *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="staff">Nhân Viên</option>
              <option value="manager">Người Quản Lý</option>
              <option value="admin">Quản Trị Viên</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Ngày Sinh</label>
            <Input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              {user ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
