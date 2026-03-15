import { ProductPurchased } from "../owner-site/admin/payment-gateway";

export interface SuperAdminPaymentSummary {
  total_received: number;
  total_paid: number;
  pending_balance: number;
}

export interface TenantTransfer {
  id: number;
  tenant: string;
  amount: string;
  transfer_date: string;
  reference_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CentralPaymentHistory {
  id: number;
  tenant: string;
  payment_type: "esewa" | "khalti";
  pay_amount: string;
  transaction_id: string;
  products_purchased: ProductPurchased[];
  status: "pending" | "transferred";
  additional_info: any;
  created_at: string;
  updated_at: string;
}

export interface CreateTransferRequest {
  tenant: string;
  amount: number | string;
  transfer_date: string;
  reference_note?: string;
}
