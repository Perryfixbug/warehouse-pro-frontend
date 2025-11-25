'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchClient } from '@/lib/fetchClient'
import { AlertTriangle, CheckCircle, AlertCircle, Bell } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

// const alerts = [
//   { id: 1, type: 'critical', product: 'Bàn phím Mechanical', message: 'Tồn kho chỉ còn 3 cái', time: '2 giờ trước' },
//   { id: 2, type: 'warning', product: 'Màn hình LG 27"', message: 'Tồn kho gần hết (12 cái)', time: '4 giờ trước' },
//   { id: 3, type: 'info', product: 'Hóa đơn #2024-001', message: 'Nhập 50 cái Chuột Logitech', time: '6 giờ trước' },
//   { id: 4, type: 'warning', product: 'HDD Samsung 1TB', message: 'Gần hết hàng (5 cái còn lại)', time: '1 ngày trước' },
//   { id: 5, type: 'info', product: 'Tai nghe Sony', message: 'Xuất 15 cái cho đại lý ABC', time: '1 ngày trước' },
// ]

export function AlertList({ limit }: { limit?: number }) {
  const [alerts, setAlerts] = useState([])
  const displayAlerts = useMemo(() => limit ? alerts.slice(0, limit) : alerts, [alerts, limit])


  useEffect(()=>{
    async function fetchAlerts(){
      const data = await fetchClient("/dashboard/alerts")
      setAlerts(data)
    }
    fetchAlerts()
  }, [])
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="text-destructive" size={18} />
      case 'warning':
        return <AlertCircle className="text-accent" size={18} />
      case 'info':
        return <Bell className="text-chart-2" size={18} />
      default:
        return <CheckCircle className="text-chart-2" size={18} />
    }
  }

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-destructive/5 border-destructive/20'
      case 'warning':
        return 'bg-accent/5 border-accent/20'
      case 'info':
        return 'bg-chart-2/5 border-chart-2/20'
      default:
        return 'bg-muted/5 border-muted/20'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cảnh Báo</CardTitle>
        <CardDescription>Các thông báo quan trọng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border flex gap-3 ${getAlertBgColor(alert.type)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{alert.product}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground/50 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
