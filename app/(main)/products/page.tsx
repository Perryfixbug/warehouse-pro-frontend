'use client'

import { ReactHTMLElement, useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Trash2, Plus, Search, Upload, Filter, Eye, File, FileBox } from 'lucide-react'
import { ProductForm } from '@/components/products/product-form'
import { ProductModal } from '@/components/products/product-modal'
import { Product } from '@/type/type'
import { fetchClient } from '@/lib/fetchClient'

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-stock' | 'low-stock' | 'critical'>('all')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const filteredProducts = useMemo(() => products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }),[products, searchQuery])

  const handleAddProduct = async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const res = await fetchClient("/products", "POST", {
      body: JSON.stringify({product: data})
    })
    const newProduct = res.data
    setProducts(prev => [...prev, newProduct])
    setIsFormOpen(false)
  }
  
  const handleUpdateProduct = async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedProduct) {
      const res = await fetchClient(`/products/${selectedProduct.id}`, "PUT", {
        body: JSON.stringify({product: data})
      })
      const changedProduct = res.data
      setProducts(products.map(p => p.id === changedProduct.id ? changedProduct : p))
      setSelectedProduct(null)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    await fetchClient(`/products/${id}`, "DELETE")
    setProducts(products.filter(p => p.id !== id))
  }

  const handleImportOpen = ()=>{
    fileInputRef?.current?.click()
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  }

  const handleSendCSV = async ()=>{
    if(!selectedFile) return
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('type', "Product")
    try{
      await fetchClient('/csv', "POST", 
        {
          body: formData,
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        }
      )
      console.log("Đang thực hiện import..")
      setSelectedFile(null)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(()=>{
    const fetchProducts = async () =>{
      const res = await fetchClient("/products");
      const data = res.data
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản Lý Sản Phẩm</h1>
        <p className="text-muted-foreground">Quản lý tất cả sản phẩm trong kho hàng</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
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
                onClick={() => setFilterStatus(filterStatus === 'critical' ? 'all' : 'critical')}
              >
                <Filter size={16} />
                Bộ lọc
              </Button>
              { selectedFile == null ? 
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleImportOpen}
              >
                <Upload size={16} />
                Nhập CSV
              </Button>:
              <div className='outline px-2 py-1 rounded-sm flex gap-1 items-center justify-center'>
                <FileBox size='15'/>
                {selectedFile.name}
              </div>
              }
              <Input 
                type='file'
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {selectedFile == null ?
                <Button
                  onClick={() => {
                    setSelectedProduct(null)
                    setIsFormOpen(true)
                  }}
                  size="sm"
                  className="gap-2"
                >
                  <Plus size={16} />
                  Thêm Sản Phẩm
                </Button>:
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    onClick={handleSendCSV}
                  >
                    Xác nhận
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={()=>setSelectedFile(null)}
                  >
                    Hủy
                  </Button>
                </div>
              }
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Mã </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tên Sản Phẩm</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Đơn vị</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Giá</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Tồn Kho</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Mô tả</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">{product.product_code}</td>
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4">{product.unit}</td>
                    {/* <td className="py-3 px-4 text-muted-foreground">{product.supplier}</td> */}
                    <td className="py-3 px-4 text-right text-muted-foreground">
                      đ {product.price_per_unit.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">{product.quantity}</td>
                    <td className="py-3 px-4 text-left text-muted-foreground">{product.detail}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedProduct(product)
                            setIsFormOpen(true)
                          }}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Không tìm thấy sản phẩm nào
              </div>
            )}
          </div>
        </CardContent>

        <CardContent className="border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Hiển thị {filteredProducts.length} / {products.length} sản phẩm</span>
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onSave={selectedProduct ? handleUpdateProduct : handleAddProduct}
          onClose={() => {
            setIsFormOpen(false)
            setSelectedProduct(null)
          }}
        />
      )}

      {selectedProduct && !isFormOpen && (
        <ProductModal
          product={selectedProduct}
          onDelete={handleDeleteProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
