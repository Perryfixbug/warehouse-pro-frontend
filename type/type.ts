export interface Product {
  id: number;
  name: string;
  unit: string;
  price_per_unit: number;
  quantity: number;
  detail: string;
  product_code: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  role: "admin" | "manager" | "staff";
  birth_date: string;
  created_at: string;
}

export interface Agency {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  created_at: string;
}

export interface OrderedProduct {
  id: number;
  quantity: number;
  price_per_unit: number;
  product_id: number;
  order_id: number;
  product: Product;
  total: number;
}

export interface Order {
  id: number;
  type: "ImportOrder" | "ExportOrder";
  created_at: string;
  agency: Agency;
  user: User;
  ordered_products: OrderedProduct[];
  total_price: number;
}

export interface OrderFormData {
  type: "ImportOrder" | "ExportOrder";
  agency_id: number;
  ordered_products_attributes: { product_id: number; quantity: number }[];
}

export interface DashboardStat {
  total_products: number;
  inventory_value: number;
  low_stock: number;
  order: {
    this_week: number;
    change: number;
    is_positive: boolean;
  };
}

export interface Alert {
  id: number;
  name: string;
  quantity: number;
  message: string;
}

export interface Notification {
  id: number;
  noti_type: string;
  content: string;
  created_at: string;
  updated_at: string;
  read: boolean;
}

export interface ProductSearchQuery {
  name_cont?: string;
  unit_eq?: string;
  price_per_unit_gteq?: number;
  price_per_unit_lteq?: number;
  page?: number;
}

export interface UserSearchQuery {
  fullname_or_email_cont?: string;
  role_eq?: string;
  page?: number;
}

export interface OrderSearchQuery {
  id_or_agency_name_cont?: string;
  type_eq?: string;
  page?: number;
}

export interface AgencySearchQuery {
  name_or_phone_or_email_cont?: string;
  page?: number;
}
