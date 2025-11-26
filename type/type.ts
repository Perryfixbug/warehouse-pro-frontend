export interface Product{
  id: number,
  name: string,
  unit: string,
  price_per_unit: number,
  quantity: number,
  detail: string,
  product_code: string,
  created_at: Date,
  updated_at: Date
}

export interface User {
  id: number
  fullname: string
  email: string
  phone: string
  address: string
  role: 'admin' | 'manager' | 'staff'
  birth_date: string
  created_at: string
}
