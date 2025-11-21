'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, Lock, Shield, Users } from 'lucide-react'
// import { UserForm } from './user-form'
// import { UserDetailsModal } from './user-details-modal'
// import { PermissionsModal } from './permissions-modal'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'staff'
  status: 'active' | 'inactive'
  joinDate: string
  lastLogin: string
  permissions: string[]
}

const initialUsers: User[] = [
  {
    id: 'U-001',
    name: 'Nguyễn Văn A',
    email: 'admin@warehouse.com',
    phone: '0987654321',
    role: 'admin',
    status: 'active',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-15 14:30',
    permissions: ['view_all', 'manage_products', 'manage_orders', 'manage_users', 'view_reports', 'manage_alerts'],
  },
  {
    id: 'U-002',
    name: 'Trần Thị B',
    email: 'manager@warehouse.com',
    phone: '0912345678',
    role: 'manager',
    status: 'active',
    joinDate: '2023-06-20',
    lastLogin: '2024-01-15 13:15',
    permissions: ['view_all', 'manage_products', 'manage_orders', 'view_reports'],
  },
  {
    id: 'U-003',
    name: 'Lê Văn C',
    email: 'staff1@warehouse.com',
    phone: '0923456789',
    role: 'staff',
    status: 'active',
    joinDate: '2023-08-10',
    lastLogin: '2024-01-15 10:45',
    permissions: ['view_products', 'view_orders', 'create_orders'],
  },
  {
    id: 'U-004',
    name: 'Phạm Thị D',
    email: 'staff2@warehouse.com',
    phone: '0934567890',
    role: 'staff',
    status: 'inactive',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-10 09:00',
    permissions: ['view_products', 'view_orders'],
  },
]

const roleColors = {
  admin: 'bg-destructive/10 text-destructive',
  manager: 'bg-primary/10 text-primary',
  staff: 'bg-chart-2/10 text-chart-2',
}

const roleLabels = {
  admin: 'Quản Trị Viên',
  manager: 'Người Quản Lý',
  staff: 'Nhân Viên',
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showPermissions, setShowPermissions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'manager' | 'staff'>('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleAddUser = (data: Omit<User, 'id' | 'lastLogin'>) => {
    const newUser: User = {
      ...data,
      id: `U-${String(users.length + 1).padStart(3, '0')}`,
      lastLogin: new Date().toISOString(),
    }
    setUsers([...users, newUser])
    setIsFormOpen(false)
  }

  const handleUpdateUser = (data: Omit<User, 'id' | 'lastLogin'>) => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id
        ? { ...data, id: u.id, lastLogin: u.lastLogin }
        : u
      ))
      setSelectedUser(null)
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const handleUpdatePermissions = (permissions: string[]) => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id
        ? { ...u, permissions }
        : u
      ))
      setShowPermissions(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-chart-2/10 text-chart-2'
      : 'bg-muted text-muted-foreground'
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản Lý Người Dùng</h1>
        <p className="text-muted-foreground">Quản lý tài khoản, phân quyền và quyền truy cập</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users size={16} className="text-chart-2" />
              Tổng Người Dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield size={16} className="text-destructive" />
              Quản Trị Viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              Người Quản Lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.filter(u => u.role === 'manager').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield size={16} className="text-chart-2" />
              Nhân Viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.filter(u => u.role === 'staff').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Tìm kiếm tên, email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản Trị Viên</option>
                <option value="manager">Người Quản Lý</option>
                <option value="staff">Nhân Viên</option>
              </select>

              <Button
                onClick={() => {
                  setSelectedUser(null)
                  setIsFormOpen(true)
                }}
                size="sm"
                className="gap-2"
              >
                <Plus size={16} />
                Thêm Người Dùng
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tên</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Vai Trò</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Trạng Thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Ngày Tham Gia</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Lần Đăng Nhập Cuối</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status === 'active' ? 'Hoạt Động' : 'Vô Hiệu Hóa'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{user.lastLogin}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowPermissions(true)
                          }}
                          title="Quản lý quyền"
                        >
                          <Lock size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsFormOpen(true)
                          }}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Không tìm thấy người dùng nào
              </div>
            )}
          </div>
        </CardContent>

        <CardContent className="border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Hiển thị {filteredUsers.length} / {users.length} người dùng</span>
          </div>
        </CardContent>
      </Card>

      {/* Forms & Modals */}
      {isFormOpen && (
        <UserForm
          user={selectedUser}
          onSave={selectedUser ? handleUpdateUser : handleAddUser}
          onClose={() => {
            setIsFormOpen(false)
            setSelectedUser(null)
          }}
        />
      )}

      {showPermissions && selectedUser && (
        <PermissionsModal
          user={selectedUser}
          onSave={handleUpdatePermissions}
          onClose={() => {
            setShowPermissions(false)
            setSelectedUser(null)
          }}
        />
      )}
    </div>
  )
}
