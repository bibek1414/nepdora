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
  variant?: {
    id: number;
    product: {
      id: number;
      name: string;
      slug: string;
      price: string;
      market_price: string;
      thumbnail_image: string;
      thumbnail_alt_description: string | null;
    };
    price: string;
    stock: number;
    image: string | null;
    option_values: Array<{
      id: number;
      value: string;
    }>;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  customer_address: string;
  customer_phone: string;
  city: string;
  shipping_city?: string;
  note?: string;
  order_status?: string;
  total_amount: string;
  delivery_charge: string;
  items: OrderItem[];
  payment_type?: string;
  transaction_id?: string;
  promo_code?: number;
  discount_amount?: string;
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
  is_manual?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  location_accuracy?: number | null;
  location_timestamp?: number | null;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  customer_details?: any;
  // New fields
  city?: string;
  note?: string;
  delivery_charge?: string;
  cart_weight?: string;
}

export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export interface OrderPaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;

  is_manual?: boolean;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface UpdateOrderPaymentRequest {
  transaction_id: string;
  payment_type: string;
  is_paid: boolean;
}
