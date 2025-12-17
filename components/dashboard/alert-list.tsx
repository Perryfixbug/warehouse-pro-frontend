'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchClient } from '@/lib/api/fetchClient'
import { Alert } from '@/type/type'
import { AlertTriangle, CheckCircle, AlertCircle, Bell } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export function AlertList({ limit }: { limit?: number }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const displayAlerts = useMemo(() => limit ? alerts.slice(0, limit) : alerts, [alerts, limit])

  useEffect(()=>{
    async function fetchAlerts(){
      const res = await fetchClient("/dashboard/alerts")
      const data = res.data
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
              className={`p-3 rounded-lg border flex gap-3`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{alert.name}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
