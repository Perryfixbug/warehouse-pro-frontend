'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Search, Eye } from 'lucide-react'
import { fetchClient } from '@/lib/api/fetchClient'
import { Agency, AgencySearchQuery } from '@/type/type'
import { useDebounce } from '@/hooks/useDebounce'
import { AgencyForm } from '@/components/agencies/agency-form'
import { AgencyDetailsModal } from '@/components/agencies/agency-details-modal'
import { getAgencies } from '@/lib/api/getAgencies'
import { dateToLocaleString } from '@/lib/utils/dateToLocaleString'
import { useLoading } from '@/hooks/useLoading'
import { ClipLoader } from 'react-spinners'
import Pagination from '@/components/layout/paginattion'

export default function AgencyManagement() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<AgencySearchQuery>({})
  const searchQueryDebounce = useDebounce(searchQuery, 500)
  const {loading, withLoading} = useLoading()
  const [total_pages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)

  const handleAddAgency = async (data: Omit<Agency, 'id' | 'created_at'>) => {
    const res = await fetchClient('/agencies', 'POST', {
      body: JSON.stringify({ agency: data }),
    })
    setAgencies(prev => [res.data, ...prev])
  }

  const handleUpdateAgency = async (data: Omit<Agency, 'id' | 'created_at'>) => {
    if (!selectedAgency) return
    const res = await fetchClient(`/agencies/${selectedAgency.id}`, 'PUT', {
      body: JSON.stringify({ agency: data }),
    })
    const updated = res.data
    setAgencies(prev =>
      prev.map(a => (a.id === updated.id ? updated : a))
    )
    setSelectedAgency(null)
  }

  const handleDeleteAgency = async (id: number) => {
    if (!confirm('Xóa agency này?')) return
    await fetchClient(`/agencies/${id}`, 'DELETE')
    setAgencies(prev => prev.filter(a => a.id !== id))
  }

  useEffect(() => {
    const fetchData = async () => {
      withLoading(async () => {
        const res = await getAgencies(searchQueryDebounce, page)
        const data = res.data
        const meta = res.meta
        setTotalPages(meta.total_pages)
        setAgencies(data)
      })
    }
    fetchData()
  }, [searchQueryDebounce, page])

  useEffect(() => {
    setPage(1)
  }, [searchQueryDebounce])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản Lý Agency</h1>
        <p className="text-muted-foreground">Quản lý thông tin các agency</p>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  className="pl-10"
                  placeholder="Tìm kiếm tên, email..."
                  value={searchQuery.name_or_phone_or_email_cont || ''}
                  onChange={e => {
                    setSearchQuery(prev => ({
                      ...prev,
                      name_or_phone_or_email_cont: e.target.value,
                    }))
                  }}
                />
              </div>

              <Button
                className="gap-2"
                size="sm"
                onClick={() => setFormOpen(true)}
              >
                <Plus size={16} />
                Thêm Agency
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Tên</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">SĐT</th>
                  <th className="py-3 px-4 text-left">Địa điểm</th>
                  <th className="py-3 px-4 text-left">Ngày tạo</th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {!loading && agencies.map(agency => (
                  <tr key={agency.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{agency.name}</td>
                    <td className="py-3 px-4">{agency.email}</td>
                    <td className="py-3 px-4">{agency.phone}</td>
                    <td className="py-3 px-4">{agency.location}</td>
                    <td className="py-3 px-4">
                      {dateToLocaleString(agency.created_at)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedAgency(agency)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAgency(agency)
                            setFormOpen(true)
                          }}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteAgency(agency.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className='flex justify-center items-center py-8'>
                <ClipLoader size={30} color="#000000" />
              </div>
            )}

            {!loading && agencies.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Không có agency nào
              </div>
            )}
          </div>

          {!loading && agencies.length > 0 && (
            <Pagination meta={{
              current_page: page,
              total_pages: total_pages
            }}
            setPage={setPage}
            />
          )}
        </CardContent>

        {formOpen && (
          <AgencyForm
            agency={selectedAgency}
            onSave={selectedAgency ? handleUpdateAgency : handleAddAgency}
            onClose={() => {
              setFormOpen(false)
              setSelectedAgency(null)
            }}
          />
        )}

        {selectedAgency && !formOpen && (
          <AgencyDetailsModal
            agency={selectedAgency}
            onClose={() => setSelectedAgency(null)}
          />
        )}
      </Card>
    </div>
  )
}
