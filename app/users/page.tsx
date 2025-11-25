'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Search, Eye, Shield, Users } from 'lucide-react'
import { fetchClient } from '@/lib/fetchClient'
import { User } from '@/type/type'
import { UserForm } from '@/components/users/user-form'
import { UserDetailsModal } from '@/components/users/user-details-modal'

const roleLabels: Record<string, string> = {
  admin: 'Quản Trị Viên',
  manager: 'Người Quản Lý',
  staff: 'Nhân Viên',
}
const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  staff: 'bg-green-100 text-green-800',
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'manager' | 'staff'>('all')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchClient("/users")
        const data = res.data
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users', error)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleAddUser = async (data: Omit<User, 'id'>) => {
    const res = await fetchClient("/users", "POST", {
      body: JSON.stringify({ user: data })
    })
    const newUser = res.data
    setUsers(prev=>[newUser, ...prev])
  }

  const handleUpdateUser = async (data: Omit<User, 'id' >) => {
    if(selectedUser){
      const res = await fetchClient(`/users/${selectedUser.id}`, "PUT", {
        body: JSON.stringify({user: data})
      })
      const changedUser = res.data
      setUsers(users.map(u=> u.id === changedUser.id ? changedUser : u))
      setSelectedUser(null)
    }
  }
  const handleDeleteUser = async (id: number) => {
    if (!confirm('Xóa người dùng này?')) return
    try {
      await fetchClient(`/users/${id}`, "DELETE")
      setUsers(users.filter((u) => u.id !== id))
    } catch (error) {
      console.error('Error deleting user', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và vai trò</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users size={16} className="text-chart-2" />
              Tổng Người Dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>

        {['admin', 'manager', 'staff'].map((role) => (
          <Card key={role}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield size={16} className="text-chart-2" />
                {roleLabels[role]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === role).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                className="pl-10"
                placeholder="Tìm kiếm tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-3 py-2 rounded-lg border bg-background text-foreground text-sm"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản Trị Viên</option>
                <option value="manager">Người Quản Lý</option>
                <option value="staff">Nhân Viên</option>
              </select>

              <Button 
                className="gap-2" size="sm"
                onClick={()=>setFormOpen(true)}
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
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Tên</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Email</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">SĐT</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Địa chỉ</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Vai Trò</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Ngày Tham Gia</th>
                  <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{user.fullname}</td>
                   <td className="py-3 px-4 max-w-[150px] truncate" title={user.email}>{user.email}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4 max-w-[200px] truncate" title={user.address}>{user.address}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye size={16} />
                        </Button>

                        <Button 
                          variant="ghost" size="icon"
                          onClick={()=>{
                              setFormOpen(true)
                              setSelectedUser(user)
                            }
                          }
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
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
              <div className="text-center py-6 text-muted-foreground">
                Không tìm thấy người dùng nào
              </div>
            )}
          </div>
        </CardContent>

        {formOpen && 
          <UserForm 
            user={selectedUser}
            onSave={selectedUser ? handleUpdateUser : handleAddUser}
            onClose={()=>{
              setFormOpen(false)
              setSelectedUser(null)
            }}
          />
        }

        {selectedUser && !formOpen && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </Card>
    </div>
  )
}
