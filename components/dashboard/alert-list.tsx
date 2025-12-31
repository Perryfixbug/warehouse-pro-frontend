'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchClient } from '@/lib/api/fetchClient'
import { Alert } from '@/type/type'
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
