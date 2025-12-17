'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Agency } from '@/type/type'
import { dateToLocaleString } from '@/lib/utils/dateToLocaleString'

interface AgencyDetailsModalProps {
  agency: Agency
  onClose: () => void
}

export function AgencyDetailsModal({
  agency,
  onClose,
}: AgencyDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <div>
            <CardTitle className="text-xl">{agency.name}</CardTitle>
            <CardDescription>{agency.email}</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Số Điện Thoại</p>
              <p className="text-base font-semibold">{agency.phone}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base font-semibold">{agency.email}</p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Địa Điểm</p>
              <p className="text-base font-semibold">{agency.location}</p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Ngày Tạo</p>
              <p className="text-base font-semibold">
                {dateToLocaleString(agency.created_at)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
