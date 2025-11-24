'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const data = [
  { date: 'T2', import: 240, export: 180, stock: 2400 },
  { date: 'T3', import: 320, export: 210, stock: 2510 },
  { date: 'T4', import: 280, export: 220, stock: 2570 },
  { date: 'T5', import: 390, export: 250, stock: 2710 },
  { date: 'T6', import: 350, export: 260, stock: 2800 },
  { date: 'T7', import: 410, export: 280, stock: 2930 },
  { date: 'CN', import: 280, export: 200, stock: 3010 },
]

export function InventoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống Kê Nhập/Xuất Hàng (Tuần)</CardTitle>
        <CardDescription>Biểu đồ nhập hàng, xuất hàng và tồn kho trong tuần</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
