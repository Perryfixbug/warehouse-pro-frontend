import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingDown, TrendingUp, FileText } from 'lucide-react'

export function QuickActions({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thao Tác Nhanh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
          <Plus size={16} />
          Nhập Hàng
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
          <TrendingDown size={16} />
          Xuất Hàng
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
          <FileText size={16} />
          Tạo Phiếu
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          size="sm"
          onClick={() => onNavigate?.('products')}
        >
          <TrendingUp size={16} />
          Quản Lý Hàng
        </Button>
      </CardContent>
    </Card>
  )
}
