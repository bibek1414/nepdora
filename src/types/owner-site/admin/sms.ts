export interface SMSBalance {
  client: string;
  sms_enabled: boolean;
  sms_credit: number;
}

export interface SMSPurchaseHistory {
  id: number;
  amount: number;
  price: string;
  transaction_id: string;
  purchased_at: string;
}

export interface SMSHistory {
  id: number;
  receiver_number: string;
  message: string;
  credits_used: number;
  sent_at: string;
  status: string;
  response_data: {
    success: boolean;
    message: string;
    [key: string]: any;
  };
}

export interface CreateSMSPurchaseRequest {
  amount: number;
  transaction_id: string;
  price?: string;
}

export interface UpdateSMSPurchaseRequest {
  price?: string;
}
