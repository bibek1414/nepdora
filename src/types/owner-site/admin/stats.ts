export interface UnreadCounts {
  unread_appointments: number;
  unread_popup_forms: number;
  unread_contacts: number;
  unread_orders: number;
  unread_newsletters: number;
  unread_own_payment: number;
  unread_tenant_payments: number;
}

export interface ChannelDistribution {
  pos_order: boolean;
  count: number;
  amount: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  amount: number;
}

export interface CityDistribution {
  city: string;
  count: number;
  amount: number;
}

export interface ProductStat {
  product__id: number | null;
  product__name: string | null;
  product__thumbnail_image: string | null;
  qty_sold: number;
  amount: number;
}

export interface DailyStat {
  date: string;
  revenue: number;
  orders: number;
}

export interface AnalyticsStats {
  revenue: number;
  orders: number;
  delivery_charge: number;
  online_payments: number;
  unique_customers: number;
  average_order_value: number;
  channel_distribution: ChannelDistribution[];
  status_distribution: StatusDistribution[];
  top_cities: CityDistribution[];
  top_selling_products: ProductStat[];
  least_selling_products: ProductStat[];
  revenue_contribution_by_product: ProductStat[];
  daily_stats: DailyStat[];
}
