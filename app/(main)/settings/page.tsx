'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Bell, Lock, Palette, Save } from 'lucide-react'
import { fetchClient } from '@/lib/api/fetchClient'

interface SettingsForm {
  language: string
  theme: string
  notifications: boolean
  emailNotifications: boolean
}

export default function SettingPage() {
  const [settings, setSettings] = useState<SettingsForm>({
    language: 'vi',
    theme: 'dark',
    notifications: true,
    emailNotifications: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSettingChange = (key: keyof SettingsForm, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      setSaveMessage('')
      
      // Simulate API call - adjust endpoint as needed
      // const res = await fetchClient("/settings", "PUT", {
      //   body: JSON.stringify(settings)
      // })
      
      // For now, just show success message
      setSaveMessage('Cài đặt đã được lưu thành công!')
      
      setTimeout(() => {
        setSaveMessage('')
      }, 3000)
    } catch (error) {
      setSaveMessage('Lỗi khi lưu cài đặt')
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings size={32} />
          Cài Đặt
        </h1>
        <p className="text-muted-foreground mt-2">Quản lý cài đặt ứng dụng của bạn</p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${saveMessage.includes('thành công') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {saveMessage}
        </div>
      )}

      {/* Language & Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={20} />
            Cài Đặt Hiển Thị
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Ngôn Ngữ</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Giao Diện</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="light">Sáng</option>
              <option value="dark">Tối</option>
              <option value="auto">Tự Động</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Thông Báo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Thông báo trên ứng dụng</p>
              <p className="text-sm text-muted-foreground">Nhận thông báo từ hệ thống</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Thông báo Email</p>
              <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} />
            Bảo Mật
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Change Password */}
          <div className="space-y-3 p-3 border rounded-lg">
            <p className="font-medium">Đổi Mật Khẩu</p>
            <p className="text-sm text-muted-foreground mb-3">Cập nhật mật khẩu của bạn để bảo vệ tài khoản</p>
            <Button variant="outline" className="w-full">
              Đổi Mật Khẩu
            </Button>
          </div>

          {/* Session Management */}
          <div className="space-y-3 p-3 border rounded-lg">
            <p className="font-medium">Quản Lý Phiên</p>
            <p className="text-sm text-muted-foreground mb-3">Xem và quản lý các phiên đăng nhập</p>
            <Button variant="outline" className="w-full">
              Xem Phiên
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            // Reset settings
            setSettings({
              language: 'vi',
              theme: 'dark',
              notifications: true,
              emailNotifications: true,
            })
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="gap-2"
        >
          <Save size={18} />
          {isSaving ? 'Đang lưu...' : 'Lưu Cài Đặt'}
        </Button>
      </div>
    </div>
  )
} 
