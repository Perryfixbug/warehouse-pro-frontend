"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Eye,
  Trash2,
  Download,
  Truck,
  LogOut,
} from "lucide-react";
import { OrderForm } from "@/components/orders/order-form";
import { OrderDetails } from "@/components/orders/order-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchClient } from "@/lib/api/fetchClient";
import { Order, OrderFormData, OrderSearchQuery } from "@/type/type"
import { useDebounce } from "@/hooks/useDebounce";
import { getOrders } from "@/lib/api/getOrders";
import { dateToLocaleString } from "@/lib/utils/dateToLocaleString";
import { ClipLoader } from "react-spinners";
import { useLoading } from "@/hooks/useLoading";
import Pagination from "@/components/layout/paginattion";

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "ImportOrder" | "ExportOrder">(
    "all"
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<OrderSearchQuery>({});
  const searchQueryDebounce = useDebounce(searchQuery, 500);
  const {loading, withLoading} = useLoading();
  const [page, setPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);

  const handleAddOrder = async (data: OrderFormData) =>{
    try {
      const res = await fetchClient("/orders", "POST",  
        { body: JSON.stringify(data) }
      )
      const newOrder = res.data
      alert("Tạo phiếu thành công!");
      setOrders(prev=>[newOrder, ...prev])
      setIsFormOpen(false)
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi tạo phiếu");
    }
  }

  const handleDeleteOrder = async (id: number) => {
    await fetchClient(`/orders/${id}`, "DELETE")
    alert("Xóa đơn hàng thành công");
    setOrders(orders.filter((o) => o.id !== id));
  };

  const getTypeLabel = (type: string) =>
    type === "ImportOrder" ? "Nhập Hàng" : "Xuất Hàng";

  let importTotal = useMemo(()=> orders
    .filter((o) => o.type === "ImportOrder")
    .reduce((sum, o) => sum + o.total_price, 0),
  [orders]);

  let exportTotal = useMemo(()=> orders
    .filter((o) => o.type === "ExportOrder")
    .reduce((sum, o) => sum + o.total_price, 0),
  [orders]);

  useEffect(() => {
    if(!searchQueryDebounce) return;

    async function fetchOrder() {
      withLoading(async () => {
        const res = await getOrders(searchQueryDebounce, page)
        const data = res.data
        const meta = res.meta
        setTotalPages(meta.total_pages)
        setOrders(data)
      })
    }
    fetchOrder()
  }, [searchQueryDebounce, page]);

  useEffect(() => {
    setPage(1)
  }, [searchQueryDebounce])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Quản Lý Nhập/Xuất Hàng
        </h1>
        <p className="text-muted-foreground">
          Ghi nhận và theo dõi phiếu nhập xuất hàng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Truck size={16} className="text-primary" /> Tổng Nhập Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {importTotal.toLocaleString("vi-VN")} VNĐ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <LogOut size={16} className="text-chart-3" /> Tổng Xuất Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {exportTotal.toLocaleString("vi-VN")} VNĐ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Phiếu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:w-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Tìm kiếm mã phiếu, nhà cung cấp..."
              className="pl-10"
              value={searchQuery.id_or_agency_name_cont || ""}
              onChange={(e) => {
                setSearchQuery((prev) => ({
                  ...prev,
                  id_or_agency_name_cont: e.target.value,
                }));
              }}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} /> Xuất Excel
            </Button>
            <Button
              onClick={() => setIsFormOpen(true)}
              size="sm"
              className="gap-2"
            >
              <Plus size={16} /> Tạo Phiếu
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="all">Tất Cả ({orders.length})</TabsTrigger>
              <TabsTrigger value="ImportOrder">
                Nhập Hàng ({orders.filter((o) => o.type === "ImportOrder").length})
              </TabsTrigger>
              <TabsTrigger value="ExportOrder">
                Xuất Hàng ({orders.filter((o) => o.type === "ExportOrder").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <ClipLoader size={30} color="#000000" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Mã Phiếu
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Loại
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Ngày
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Nhà Cung Cấp/Đại Lý
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                        Số Lượng
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                        Tổng Giá Trị
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && orders.filter(order=> (activeTab === "all" ? order : order.type === activeTab)).map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-primary">
                          {order.id}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              order.type === "ExportOrder"
                                ? "bg-primary/10 text-primary"
                                : "bg-chart-3/10 text-chart-3"
                            }`}
                          >
                            {getTypeLabel(order.type)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {dateToLocaleString(order.created_at)}
                        </td>
                        <td className="py-3 px-4">{order.agency.name}</td>
                        <td className="py-3 px-4 text-right">
                          {order.ordered_products.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {order.total_price.toLocaleString("vi-VN")} VNĐ
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {loading && (
                  <div className='flex justify-center items-center py-8'>
                    <ClipLoader size={30} color="#000000" />
                  </div>
                )}

                {!loading && orders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Không tìm thấy phiếu nào
                  </div>
                )}

                {!loading && orders.length > 0 && (
                  <Pagination meta={{
                    current_page: page,
                    total_pages: total_pages
                  }}
                  setPage={setPage}
                  />
                )}
              </div>
            )}
            </TabsContent>
          </Tabs>
        </CardContent>

        {isFormOpen && 
        <OrderForm 
          onSave={handleAddOrder}
          onClose={() => setIsFormOpen(false)}   
        />}
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </Card>
    </div>
  );
}
