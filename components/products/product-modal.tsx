'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Trash2 } from 'lucide-react'
import { Product } from '@/type/type'

export function ProductModal(
  { product, onDelete, onClose }: 
  { 
    product: Product; 
    onDelete: (id: number) => void,
    onClose: () => void
  }) {
  // Tính status dựa trên quantity
  const getStatus = () => {
    if (product.quantity <= 0) return 'critical'
    if (product.quantity <= 10) return 'low-stock'
    return 'in-stock'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
      case 'low-stock':
        return 'bg-accent/10 text-accent border-accent/20'
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-muted text-muted-foreground border-muted/20'
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

  const status = getStatus()

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardDescription>Mã: {product.product_code}</CardDescription>
            <CardTitle className='text-xl'>{product.name}</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Trạng Thái:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
              {getStatusLabel(status)}
            </span>
          </div>

          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Đơn Vị</p>
              <p className="text-lg font-semibold">{product.unit}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Giá Nhập</p>
              <p className="text-lg font-semibold">{product.price_per_unit.toLocaleString('vi-VN')} VNĐ</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tồn Kho Hiện Tại</p>
              <p className="text-lg font-semibold text-primary">{product.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Giá Trị Tồn Kho</p>
              <p className="text-lg font-semibold text-primary">
                {(product.quantity * product.price_per_unit).toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Mô tả</p>
            <p className="text-base text-foreground">{product.detail}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 gap-2 text-destructive hover:text-destructive"
              onClick={()=>{
                onDelete(product.id)
                onClose()
              }}
            >
              <Trash2 size={16} />
              Xóa
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}