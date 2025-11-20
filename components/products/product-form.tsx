'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { Product } from '@/type/type'


interface ProductFormProps {
  product: Product | null
  onSave: (data: Omit<Product, 'id'>) => void
  onClose: () => void
}

export function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    price: 0,
    quantity: 0,
    minQuantity: 0,
    supplier: '',
  })

  useEffect(() => {
    if (product) {
      const { id, status, ...rest } = product
      setFormData(rest)
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'minQuantity' ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Determine status based on quantity
    let status: 'in-stock' | 'low-stock' | 'critical' = 'in-stock'
    if (formData.quantity === 0) status = 'critical'
    else if (formData.quantity <= formData.minQuantity) status = 'low-stock'

    onSave({
      ...formData,
      status,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold">
            {product ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
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
            <label className="text-sm font-medium text-foreground">Tên Sản Phẩm *</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Đơn Vị *</label>
              <Input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="cái, hộp, bộ..."
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Nhà Cung Cấp *</label>
              <Input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Tên nhà cung cấp"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Giá Nhập (VNĐ) *</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Tồn Kho *</label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Tối Thiểu *</label>
              <Input
                type="number"
                name="minQuantity"
                value={formData.minQuantity}
                onChange={handleChange}
                placeholder="0"
                required
                className="mt-1"
              />
            </div>
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
              {product ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
