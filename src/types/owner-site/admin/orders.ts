export interface OrderItem {
  id?: number;
  product_id?: number;
  variant_id?: number | null;
  quantity: number;
  price: string;
  product?: {
    id: number;
    name: string;
    slug: string;
    price: string;
    market_price: string;
    thumbnail_image: string;
    thumbnail_alt_description: string;
  };
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  customer_address: string;
  customer_phone: string;
  order_status?: string;
  total_amount: string;
  items: OrderItem[];
  payment_type?: string;
  transaction_id?: string;
  is_paid?: boolean;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  shipping_address: string;
  total_amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  order_items?: OrderItem[];
  payment_type?: string;
  transaction_id?: string;
  is_paid?: boolean;
}

export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

// New interfaces for pagination and filtering
export interface OrderPaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface UpdateOrderPaymentRequest {
  transaction_id: string;
  payment_type: string;
  is_paid: boolean;
}
