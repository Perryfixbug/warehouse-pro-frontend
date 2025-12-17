'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Search, Eye, Shield, Users } from 'lucide-react'
import { fetchClient } from '@/lib/api/fetchClient'
import { User, UserSearchQuery } from '@/type/type'
import { UserForm } from '@/components/users/user-form'
import { UserDetailsModal } from '@/components/users/user-details-modal'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectGroup, SelectContent } from '@/components/ui/select'
import { USER_ROLES } from '@/type/constant'
import { getUsers } from '@/lib/api/getUser'
import { useDebounce } from '@/hooks/useDebounce'
import { dateToLocaleString } from '@/lib/utils/dateToLocaleString'
import { useLoading } from '@/hooks/useLoading'
import { ClipLoader } from 'react-spinners'
import Pagination from '@/components/layout/paginattion'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<UserSearchQuery>({})
  const searchQueryDebounce = useDebounce(searchQuery, 500)
  const { loading, withLoading } = useLoading()
  const [total_pages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)

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
      setUsers(users?.filter((u) => u.id !== id))
    } catch (error) {
      console.error('Error deleting user', error)
    }
  }

  useEffect(()=>{
    if(!searchQueryDebounce) return

    const fetchUser = async ()=>{
        withLoading(async () => {
          const res = await getUsers(searchQueryDebounce, page)
          const data = res.data
          const meta = res.meta
          setTotalPages(meta.total_pages)
          setUsers(data)
      })
    }
    fetchUser()
  }, [searchQueryDebounce, page])

  useEffect(() => {
    setPage(1)
  }, [searchQueryDebounce])

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

        {USER_ROLES.map((role) => (
          <Card key={role.value}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield size={16} className="text-chart-2" />
                {role.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {users?.filter((u) => u.role === role.value).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className='flex gap-2 w-full'>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Tìm kiếm tên, email..."
                  value={searchQuery.fullname_or_email_cont || ""}
                  onChange={(e) => {
                    setSearchQuery((prev)=>({
                      ...prev, 
                      fullname_or_email_cont: e.target.value
                    }))}
                  }
                />
              </div>

              <Select
                onValueChange={value=>{
                  setSearchQuery(prev=>({
                    ...prev,
                    role_eq: value
                  }))
                }}
              >
                <SelectTrigger className="ml-2 w-[180px]">
                  <SelectValue placeholder="Vai trò"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {USER_ROLES.map((role)=>(
                      <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

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
                {!loading && users.map((user) => { 
                const role = USER_ROLES.find((r)=>r.value === user.role)
                return (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{user.fullname}</td>
                   <td className="py-3 px-4 max-w-[150px] truncate" title={user.email}>{user.email}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4 max-w-[200px] truncate" title={user.address}>{user.address}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${role?.color}`}>
                        {role?.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">{dateToLocaleString(user.created_at)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedUser(user)
                          }}
                        >
                          <Eye size={16} />
                        </Button>

                        <Button 
                          variant="ghost" size="icon"
                          onClick={()=>{
                              setSelectedUser(user)
                              setFormOpen(true)
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
                )}
              )}
              </tbody>
            </table>
            {loading && (
              <div className='flex justify-center items-center py-8'>
                <ClipLoader size={30} color="#000000" />
              </div>
            )}
            {!loading && users.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Không tìm thấy người dùng nào
              </div>
            )}
          </div>

          {!loading && users.length > 0 && (
            <Pagination meta={{
              current_page: page,
              total_pages: total_pages
            }}
            setPage={setPage}
            />
          )}
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
