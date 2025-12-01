"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";
import { Agency, Product, OrderFormData } from "@/type/type";
import { fetchClient } from "@/lib/fetchClient";

interface OrderedItem {
  product_id: number;
  quantity: number;
  price_per_unit: number;
  total: number;
}

interface OrderFormProps {
  onSave: (data: OrderFormData) => void;
  onClose: () => void;
}

export function OrderForm({ onSave, onClose }: OrderFormProps) {
  const [type, setType] = useState<"ImportOrder" | "ExportOrder">(
    "ImportOrder"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [agencyId, setAgencyId] = useState<number | "">("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<OrderedItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const productRes = await fetchClient("/products");
        setProducts(productRes.data);

        const agencyRes = await fetchClient("/agencies");
        setAgencies(agencyRes.data);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải dữ liệu sản phẩm/agency");
      }
    }
    fetchData();
  }, []);

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newItem: OrderedItem = {
      product_id: product.id,
      quantity,
      price_per_unit: product.price_per_unit,
      total: product.price_per_unit * quantity,
    };

    const existing = items.find((i) => i.product_id === product.id);
    if (existing) {
      setItems(
        items.map((i) =>
          i.product_id === product.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                total: (i.quantity + quantity) * i.price_per_unit,
              }
            : i
        )
      );
    } else {
      setItems([...items, newItem]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (productId: number) => {
    setItems(items.filter((i) => i.product_id !== productId));
  };

  const calculateTotal = () => {
    return items.reduce((sum, i) => sum + i.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyId || items.length === 0) {
      alert("Vui lòng chọn agency và thêm sản phẩm");
      return;
    }

    const payload = {
      type: type,
      agency_id: agencyId,
      ordered_products_attributes: items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      })),
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold">Tạo Phiếu Nhập/Xuất</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* TYPE */}
          <div>
            <label className="text-sm font-medium">Loại phiếu</label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "ImportOrder" | "ExportOrder")
              }
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            >
              <option value="ImportOrder">Nhập hàng</option>
              <option value="ExportOrder">Xuất hàng</option>
            </select>
          </div>

          {/* AGENCY */}
          <div>
            <label className="text-sm font-medium">Chọn Agency *</label>
            <select
              value={agencyId}
              onChange={(e) =>
                setAgencyId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="">-- Chọn đại lý / nhà cung cấp --</option>
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* ADD PRODUCT */}
          <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
            <h3 className="font-semibold text-sm">Thêm sản phẩm</h3>

            <div className="grid grid-cols-3 gap-2">
              <select
                value={selectedProduct || ""}
                onChange={(e) =>
                  setSelectedProduct(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="px-3 py-2 rounded-lg border border-border text-sm"
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />

              <Button onClick={handleAddItem} disabled={!selectedProduct}>
                <Plus size={16} /> Thêm
              </Button>
            </div>
          </div>

          {/* ITEM TABLE */}
          {items.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-2 px-3">Sản phẩm</th>
                    <th className="text-right py-2 px-3">SL</th>
                    <th className="text-right py-2 px-3">Đơn giá</th>
                    <th className="text-right py-2 px-3">Tổng</th>
                    <th className="text-center py-2 px-3">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const product = products.find(
                      (p) => p.id === item.product_id
                    );
                    return (
                      <tr
                        key={item.product_id}
                        className="border-t border-border"
                      >
                        <td className="py-2 px-3">{product?.name}</td>
                        <td className="text-right py-2 px-3">
                          {item.quantity}
                        </td>
                        <td className="text-right py-2 px-3">
                          {item.price_per_unit.toLocaleString("vi-VN")}
                        </td>
                        <td className="text-right py-2 px-3 font-semibold">
                          {item.total.toLocaleString("vi-VN")}
                        </td>
                        <td className="text-center py-2 px-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.product_id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="bg-muted/50 border-t border-border p-3 flex items-center justify-between">
                <span className="font-semibold">Tổng cộng:</span>
                <span className="text-lg font-bold text-primary">
                  {calculateTotal().toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            </div>
          )}

          {/* ACTION */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Tạo phiếu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
