export interface OrderItem {
  id?: number;
  product_id: number;
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
}

// Updated Order interface to match API response
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
}

export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}
