'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { Agency } from '@/type/type'

interface AgencyFormProps {
  agency?: Agency | null
  onSave: (data: Omit<Agency, 'id' | 'created_at'>) => void
  onClose: () => void
}

export function AgencyForm({
  agency,
  onSave,
  onClose,
}: AgencyFormProps) {
  const [formData, setFormData] = useState<
    Omit<Agency, 'id' | 'created_at'>
  >({
    name: agency?.name || '',
    email: agency?.email || '',
    phone: agency?.phone || '',
    location: agency?.location || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
            {agency ? 'Cập Nhật Agency' : 'Thêm Agency Mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Tên Agency *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên agency"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Email *
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@agency.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Số Điện Thoại
            </label>
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
            <label className="text-sm font-medium text-foreground">
              Địa Điểm
            </label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Nhập địa điểm"
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              {agency ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
