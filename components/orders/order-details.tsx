"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { Order } from "@/type/type";

export function OrderDetails({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {

  const getTypeLabel = (type: string) =>
    type === "import" ? "Nhập Hàng" : "Xuất Hàng";

  const handleExportPDF = () => {
    window.open(`http://localhost:8000/orders/${order.id}/export_pdf`, "_blank");
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <div>
            <CardTitle className="text-2xl">{order.id}</CardTitle>
            <CardDescription>
              {getTypeLabel(order.type)} -
              {new Date(order.created_at).toLocaleDateString("vi-VN")}
            </CardDescription>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Nhà Cung Cấp/Đại Lý
              </p>
              <p className="font-semibold text-lg">{order.agency.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày</p>
              <p className="font-semibold text-lg">
                {new Date(order.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-3">Chi Tiết Hàng Hóa</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">
                      Tên Sản Phẩm
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Số Lượng
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Đơn Giá
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Thành Tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.ordered_products.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <td className="py-3 px-4">{item.product.name}</td>
                      <td className="py-3 px-4 text-right">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">
                        {item.price_per_unit.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {(item.price_per_unit * item.quantity).toLocaleString("vi-VN")} VNĐ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-muted border-t border-border p-4 flex items-center justify-between">
                <span className="font-semibold">Tổng Cộng:</span>
                <span className="text-xl font-bold text-primary">
                  {order.total_price.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleExportPDF}
            >
              <Download size={16} /> Xuất PDF
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
