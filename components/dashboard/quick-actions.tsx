import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, FileText } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thao Tác Nhanh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link 
          href="orders"
          className="w-full justify-start gap-2 border flex rounded-sm px-2 py-1 items-center"
        >
          <FileText size={16} />
          Tạo Phiếu
        </Link>
        <Link 
          href="products"
          className="w-full justify-start gap-2 border flex rounded-sm px-2 py-1 items-center" 
        >
          <TrendingUp size={16} />
          Quản Lý Hàng
        </Link>
      </CardContent>
    </Card>
  )
}
