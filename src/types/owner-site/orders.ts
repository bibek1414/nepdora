export interface OrderItem {
  id?: number;
  product_id: number;
  quantity: number;
  price: string;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  customer_address: string;
  total_amount: string;
  items: OrderItem[];
}

export interface Order extends CreateOrderRequest {
  id: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}
