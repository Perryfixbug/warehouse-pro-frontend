'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Plus, Eye } from 'lucide-react'

const products = [
  { id: 1, name: 'Laptop Dell', unit: 'cái', price: 15000000, quantity: 45, status: 'in-stock' },
  { id: 2, name: 'Màn hình LG 27"', unit: 'cái', price: 5000000, quantity: 12, status: 'low-stock' },
  { id: 3, name: 'Bàn phím Mechanical', unit: 'cái', price: 2000000, quantity: 3, status: 'critical' },
  { id: 4, name: 'Chuột Logitech', unit: 'cái', price: 800000, quantity: 156, status: 'in-stock' },
  { id: 5, name: 'Tai nghe Sony', unit: 'cái', price: 3500000, quantity: 28, status: 'in-stock' },
]

export function ProductList() {
  const [showForm, setShowForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-chart-2/10 text-chart-2'
      case 'low-stock':
        return 'bg-accent/10 text-accent'
      case 'critical':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'Còn hàng'
      case 'low-stock':
        return 'Gần hết'
      case 'critical':
        return 'Sắp hết'
      default:
        return 'Khác'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Danh Sách Sản Phẩm</CardTitle>
          <CardDescription>Quản lý tất cả sản phẩm trong kho</CardDescription>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
          <Plus size={16} />
          Thêm Sản Phẩm
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tên Sản Phẩm</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Đơn vị</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Giá Nhập</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Tồn Kho</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Trạng Thái</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">{product.unit}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {product.price.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">{product.quantity}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
