'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react'
import { fetchClient } from '@/lib/api/fetchClient'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { info } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    fullname: info?.fullname || '',
    email: info?.email || '',
    phone: info?.phone || '',
    address: info?.address || '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setMessage('')

      await fetchClient(`/users/${info?.id}`, 'PUT', {
        body: JSON.stringify({ user: formData })
      })

      setIsEditing(false)
      setMessage('Cập nhật thành công!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Lỗi cập nhật hồ sơ')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullname: info?.fullname || '',
      email: info?.email || '',
      phone: info?.phone || '',
      address: info?.address || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Hồ Sơ Cá Nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin tài khoản</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('thành công') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thông Tin Cá Nhân</CardTitle>
          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 size={16} />
              Chỉnh Sửa
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fullname */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User size={16} />
              Họ Tên
            </label>
            {isEditing ? (
              <Input
                value={formData.fullname}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">{formData.fullname}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail size={16} />
              Email
            </label>
            {isEditing ? (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">{formData.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone size={16} />
              Số Điện Thoại
            </label>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">{formData.phone || 'Chưa cập nhật'}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin size={16} />
              Địa Chỉ
            </label>
            {isEditing ? (
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            ) : (
              <p className="px-3 py-2 bg-muted rounded-md">{formData.address || 'Chưa cập nhật'}</p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 gap-2"
              >
                <X size={18} />
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 gap-2"
              >
                <Save size={18} />
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Tài Khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between p-2">
            <span className="text-sm text-muted-foreground">Vai trò:</span>
            <span className="font-medium capitalize">{info?.role}</span>
          </div>
          <div className="flex justify-between p-2">
            <span className="text-sm text-muted-foreground">ID:</span>
            <span className="font-medium text-xs">{info?.id}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
