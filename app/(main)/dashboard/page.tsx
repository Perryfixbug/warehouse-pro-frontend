'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon, Package, Package2, PackageOpen, ReceiptText } from 'lucide-react'
import { OrderChart } from '@/components/dashboard/order-chart'
import { AlertList } from '@/components/dashboard/alert-list'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { fetchClient } from '@/lib/fetchClient'
import { DashboardStat } from '@/type/type'
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStat>();

  useEffect(()=>{
    async function fetchStats(){
      const statsData = await fetchClient("/dashboard/stats")
      setStats(statsData)
    } 
    fetchStats()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Package />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{stats?.total_products}</span>
                <span className="text-xs text-muted-foreground">Sản phẩm</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng tồn kho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Package2 />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{stats?.inventory_value}</span>
                <span className="text-xs text-muted-foreground">VNĐ</span>
              </div> 
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sản phẩm sắp hết hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <PackageOpen />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{stats?.low_stock}</span>
                <span className="text-xs text-muted-foreground">Sản phẩm</span>
              </div> 
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <ReceiptText />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{stats?.order.this_week}</span>
                <span className="text-xs text-muted-foreground">Đơn</span>
              </div>
              {stats?.order.change &&
                <div className="flex items-center gap-1 text-xs">
                  <span className={stats?.order.is_positive ? 'text-chart-2' : 'text-destructive'}>
                    {stats?.order.change}%
                  </span>
                  <span className="text-muted-foreground">so với tuần trước</span>
                </div>
              }   
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Tabs */}
      <Tabs defaultValue='overview'>
        <TabsList>
          <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
          <TabsTrigger value='alerts'>Cảnh báo</TabsTrigger>
        </TabsList>

        {/* Content */}
        <TabsContent value='overview'>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OrderChart />
            </div>
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='alerts'>
          <AlertList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
