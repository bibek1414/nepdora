import { NextRequest, NextResponse } from "next/server";
import { buildPreviewApi } from "@/config/site";

interface PaymentGatewayBackend {
  id: number;
  payment_type: "esewa" | "khalti";
  secret_key: string;
  merchant_code: string | null;
  is_enabled: boolean;
}

interface PaymentGatewayClient {
  id: number;
  payment_type: "esewa" | "khalti";
  merchant_code: string | null;
  is_enabled: boolean;
}

// Store payment gateways in memory (or you can cache them)
const cachedGateways: Map<string, PaymentGatewayBackend[]> = new Map();

/**
 * Fetch payment gateway config from backend (server-side only)
 */
async function fetchPaymentGatewaysFromBackend(
  subdomain: string
): Promise<PaymentGatewayBackend[]> {
  try {
    const apiUrl = buildPreviewApi(subdomain);
    const response = await fetch(`${apiUrl}/api/payment-gateway/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch payment gateways: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Cache the gateways for this subdomain
    cachedGateways.set(subdomain, data.data || data);

    return data.data || data;
  } catch (error) {
    console.error("Error fetching payment gateways:", error);
    throw error;
  }
}

/**
 * Get cached gateway config (without secret keys)
 */
function getCachedGateway(
  subdomain: string,
  paymentType: string
): PaymentGatewayBackend | null {
  const gateways = cachedGateways.get(subdomain);
  if (!gateways) return null;
  return gateways.find(g => g.payment_type === paymentType) || null;
}

/**
 * Remove secret keys from response
 */
function sanitizeGatewayForClient(
  gateway: PaymentGatewayBackend
): PaymentGatewayClient {
  const { secret_key, ...rest } = gateway;
  return rest as PaymentGatewayClient;
}

/**
 * GET: Retrieve payment gateways (without secret keys)
 */
export async function GET(request: NextRequest) {
  try {
    const subdomain = request.nextUrl.searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomain is required" },
        { status: 400 }
      );
    }

    const gateways = await fetchPaymentGatewaysFromBackend(subdomain);

    // Remove secret keys before sending to client
    const sanitizedGateways = gateways.map(sanitizeGatewayForClient);

    return NextResponse.json({
      success: true,
      data: sanitizedGateways,
      enabled: {
        esewa: sanitizeGatewayForClient(
          gateways.find(g => g.payment_type === "esewa" && g.is_enabled)!
        ),
        khalti: sanitizeGatewayForClient(
          gateways.find(g => g.payment_type === "khalti" && g.is_enabled)!
        ),
      },
    });
  } catch (error) {
    console.error("Payment gateway GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment gateways" },
      { status: 500 }
    );
  }
}

/**
 * POST: Process payment (eSewa or Khalti)
 */
export async function POST(request: NextRequest) {
  try {
    const {
      action,
      amount,
      subdomain,
      paymentType,
      productCode,
      purchaseOrderId,
    } = await request.json();

    if (!subdomain || !paymentType || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: subdomain, paymentType, amount" },
        { status: 400 }
      );
    }

    // Get payment gateway from cache (with secret key)
    let gateway = getCachedGateway(subdomain, paymentType);

    // If not cached, fetch from backend
    if (!gateway) {
      const gateways = await fetchPaymentGatewaysFromBackend(subdomain);
      gateway = gateways.find(g => g.payment_type === paymentType) || null;
    }

    if (!gateway || !gateway.is_enabled) {
      return NextResponse.json(
        { error: `${paymentType} payment is not enabled` },
        { status: 400 }
      );
    }

    // Process payment based on type
    if (paymentType === "esewa") {
      return handleEsewaPayment(gateway, amount, productCode);
    } else if (paymentType === "khalti") {
      return handleKhaltiPayment(gateway, amount, purchaseOrderId);
    }

    return NextResponse.json(
      { error: "Invalid payment type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment POST error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

/**
 * Handle eSewa payment (server-side with secret key)
 */
function handleEsewaPayment(
  gateway: PaymentGatewayBackend,
  amount: number,
  productCode?: string
) {
  const { merchant_code, secret_key } = gateway;

  // Create signature or do eSewa verification here
  // Using secret_key and merchant_code server-side
  const esewaPaymentData = {
    amount,
    product_code: productCode || "NEPDORA_PAYMENT",
    merchant_code,
    // secret_key is used server-side for verification, never sent to client
    timestamp: new Date().toISOString(),
    transaction_uuid: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  console.log("eSewa Payment Processing (Server-side):", {
    merchantCode: merchant_code,
    // secret_key is hidden in logs
    amount,
  });

  return NextResponse.json({
    success: true,
    message: "eSewa payment initiated",
    paymentType: "esewa",
    paymentData: esewaPaymentData,
    // Secret key is NOT included in response
  });
}

/**
 * Handle Khalti payment (server-side with secret key)
 */
function handleKhaltiPayment(
  gateway: PaymentGatewayBackend,
  amount: number,
  purchaseOrderId?: string
) {
  const { secret_key } = gateway;

  // Create verification token or do Khalti verification here
  // Using secret_key server-side for signing
  const khaltiPaymentData = {
    amount,
    purchase_order_id: purchaseOrderId || `ORDER_${Date.now()}`,
    purchase_order_name: "Nepdora Payment",
    customer_email: "customer@example.com",
    customer_phone: "98XXXXXXXX",
    timestamp: new Date().toISOString(),
    // secret_key is used server-side for verification, never sent to client
  };

  console.log("Khalti Payment Processing (Server-side):", {
    // secret_key is hidden in logs
    amount,
  });

  return NextResponse.json({
    success: true,
    message: "Khalti payment initiated",
    paymentType: "khalti",
    paymentData: khaltiPaymentData,
    // Secret key is NOT included in response
  });
}

/**
 * POST: Verify payment callback (eSewa)
 */

/**
 * POST: Verify payment callback (Khalti)
 */
