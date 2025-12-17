'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchClient } from '@/lib/api/fetchClient'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function OrderChart() {
  const [chartData, setChartData] = useState([])

  useEffect(()=>{
    async function fetchChartData(){
      const res = await fetchClient('/dashboard/chart')
      const data = res.data
      setChartData(data)
    }
    fetchChartData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống Kê Nhập/Xuất Hàng (Tuần)</CardTitle>
        <CardDescription>Biểu đồ nhập hàng, xuất hàng và tồn kho trong tuần</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
              }}
              labelStyle={{ color: 'var(--color-foreground)' }}
            />
            <Legend />
            <Bar dataKey="import" fill="var(--color-chart-1)" name="Nhập Hàng" radius={[8, 8, 0, 0]} />
            <Bar dataKey="export" fill="var(--color-chart-3)" name="Xuất Hàng" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
