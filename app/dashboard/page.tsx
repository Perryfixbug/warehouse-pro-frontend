'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, AlertTriangle, Package, Plus } from 'lucide-react'
import { InventoryChart } from '@/components/dashboard/inventory-chart'
import { ProductList } from '@/components/products/product-list'
import { AlertList } from '@/components/dashboard/alert-list'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { fetchClient } from '@/lib/fetchClient'

export default function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState([]);

  

  useEffect(()=>{
    async function fetchStats(){
      const statsData = await fetchClient("/dashboard/stats")
      console.log(statsData);
      setStats(statsData)
    } 
    fetchStats()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats && stats?.map((stat: any, index: number) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  {/* <Icon className="text-primary" size={20} /> */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className={stat.isPositive ? 'text-chart-2' : 'text-destructive'}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">so với hôm qua</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Tổng Quan
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'alerts'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Cảnh Báo ({24})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InventoryChart />
              </div>
              <div className="space-y-6">
                <QuickActions onNavigate={onNavigate} />
                <AlertList limit={5} />
              </div>
            </div>
            <ProductList />
          </>
        )}

        {activeTab === 'alerts' && (
          <AlertList />
        )}
      </div>
    </div>
  )
}
