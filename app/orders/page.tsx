'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Eye, Trash2, Download, Truck, LogOut } from 'lucide-react'
// import { OrderForm } from './order-form'
// import { OrderDetails } from './order-details'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  type: 'import' | 'export'
  date: string
  agency: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  notes: string
}

const initialOrders: Order[] = [
  {
    id: 'IM-2024-001',
    type: 'import',
    date: '2024-01-15',
    agency: 'Dell Inc',
    items: [
      { productId: 1, productName: 'Laptop Dell', quantity: 10, price: 15000000, total: 150000000 },
      { productId: 4, productName: 'Chuột Logitech', quantity: 50, price: 800000, total: 40000000 },
    ],
    total: 190000000,
    status: 'completed',
    notes: 'Hóa đơn nhập hàng từ nhà cung cấp',
  },
  {
    id: 'EX-2024-001',
    type: 'export',
    date: '2024-01-14',
    agency: 'Đại lý ABC',
    items: [
      { productId: 2, productName: 'Màn hình LG 27"', quantity: 5, price: 5000000, total: 25000000 },
    ],
    total: 25000000,
    status: 'completed',
    notes: 'Xuất hàng cho đại lý ABC',
  },
  {
    id: 'IM-2024-002',
    type: 'import',
    date: '2024-01-13',
    agency: 'Sony Vietnam',
    items: [
      { productId: 5, productName: 'Tai nghe Sony', quantity: 20, price: 3500000, total: 70000000 },
    ],
    total: 70000000,
    status: 'pending',
    notes: 'Đang chờ xác nhận',
  },
  {
    id: 'EX-2024-002',
    type: 'export',
    date: '2024-01-12',
    agency: 'Cửa hàng XYZ',
    items: [
      { productId: 1, productName: 'Laptop Dell', quantity: 3, price: 15000000, total: 45000000 },
      { productId: 4, productName: 'Chuột Logitech', quantity: 30, price: 800000, total: 24000000 },
    ],
    total: 69000000,
    status: 'completed',
    notes: 'Xuất hàng lần 2',
  },
]

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [activeTab, setActiveTab] = useState<'all' | 'import' | 'export'>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.type === activeTab
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.agency.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleAddOrder = (data: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...data,
      id: `${data.type === 'import' ? 'IM' : 'EX'}-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
    }
    setOrders([newOrder, ...orders])
    setIsFormOpen(false)
  }

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-chart-2/10 text-chart-2'
      case 'pending':
        return 'bg-accent/10 text-accent'
      case 'cancelled':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn Thành'
      case 'pending':
        return 'Chờ Xác Nhận'
      case 'cancelled':
        return 'Hủy'
      default:
        return 'Khác'
    }
  }

  const getTypeLabel = (type: string) => {
    return type === 'import' ? 'Nhập Hàng' : 'Xuất Hàng'
  }

  const importTotal = orders
    .filter(o => o.type === 'import' && o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0)

  const exportTotal = orders
    .filter(o => o.type === 'export' && o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản Lý Nhập/Xuất Hàng</h1>
        <p className="text-muted-foreground">Ghi nhận và theo dõi phiếu nhập xuất hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Truck size={16} className="text-primary" />
              Tổng Nhập Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{importTotal.toLocaleString('vi-VN')} VNĐ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <LogOut size={16} className="text-chart-3" />
              Tổng Xuất Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{exportTotal.toLocaleString('vi-VN')} VNĐ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Phiếu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Tìm kiếm mã phiếu, nhà cung cấp..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download size={16} />
                Xuất Excel
              </Button>
              <Button
                onClick={() => {
                  setSelectedOrder(null)
                  setIsFormOpen(true)
                }}
                size="sm"
                className="gap-2"
              >
                <Plus size={16} />
                Tạo Phiếu
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList>
              <TabsTrigger value="all">Tất Cả ({orders.length})</TabsTrigger>
              <TabsTrigger value="import">Nhập Hàng ({orders.filter(o => o.type === 'import').length})</TabsTrigger>
              <TabsTrigger value="export">Xuất Hàng ({orders.filter(o => o.type === 'export').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Mã Phiếu</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Loại</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Ngày</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nhà Cung Cấp/Đại Lý</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Số Lượng</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Tổng Giá Trị</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Trạng Thái</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-primary">{order.id}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.type === 'import' 
                              ? 'bg-primary/10 text-primary' 
                              : 'bg-chart-3/10 text-chart-3'
                          }`}>
                            {getTypeLabel(order.type)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(order.date).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3 px-4">{order.agency}</td>
                        <td className="py-3 px-4 text-right">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} đơn vị
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {order.total.toLocaleString('vi-VN')} VNĐ
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Không tìm thấy phiếu nào
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardContent className="border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Hiển thị {filteredOrders.length} / {orders.length} phiếu</span>
          </div>
        </CardContent>
      </Card>

      {/* Forms & Modals */}
      {isFormOpen && (
        <OrderForm
          onSave={handleAddOrder}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}
