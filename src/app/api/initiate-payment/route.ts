/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { khaltiAPI } from "@/lib/khalti-api";
import { esewaAPI } from "@/lib/esewa-api";
import {
  PaymentMethod,
  PaymentRequestData,
  KhaltiInitiateRequest,
  EsewaInitiateRequest,
} from "@/types/payment";
import { buildPreviewApi } from "@/config/site";

interface PaymentGatewayBackend {
  id: number;
  payment_type: "esewa" | "khalti";
  secret_key: string;
  merchant_code: string | null;
  is_enabled: boolean;
}

// Cache for payment gateways
const cachedGateways: Map<string, PaymentGatewayBackend[]> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const lastCacheTime: Map<string, number> = new Map();

function validatePaymentRequest(data: any): {
  isValid: boolean;
  errors: string[];
  validatedData?: PaymentRequestData;
} {
  const errors: string[] = [];

  if (
    !data.amount ||
    isNaN(parseFloat(data.amount)) ||
    parseFloat(data.amount) <= 0
  ) {
    errors.push("Valid amount is required");
  }

  if (
    !data.productName ||
    typeof data.productName !== "string" ||
    data.productName.trim().length === 0
  ) {
    errors.push("Product name is required");
  }

  if (
    !data.transactionId ||
    typeof data.transactionId !== "string" ||
    data.transactionId.trim().length === 0
  ) {
    errors.push("Transaction ID is required");
  }

  if (!data.method || !["esewa", "khalti"].includes(data.method)) {
    errors.push("Valid payment method is required (esewa or khalti)");
  }

  if (data.amount && parseFloat(data.amount) < 10) {
    errors.push("Amount should be greater than Rs. 10");
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData:
      errors.length === 0 ? (data as PaymentRequestData) : undefined,
  };
}

/**
 * Fetch payment gateways from backend API
 */
async function fetchPaymentGatewaysFromBackend(
  subdomain: string
): Promise<PaymentGatewayBackend[]> {
  try {
    // Check cache first
    const now = Date.now();
    const lastTime = lastCacheTime.get(subdomain) || 0;

    if (cachedGateways.has(subdomain) && now - lastTime < CACHE_DURATION) {
      console.log(`Using cached payment gateways for subdomain: ${subdomain}`);
      return cachedGateways.get(subdomain)!;
    }

    const apiUrl = buildPreviewApi(subdomain);
    console.log(
      `Fetching payment gateways from: ${apiUrl}/api/payment-gateway/`
    );

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
    const gateways = data.data || data;

    // Cache the gateways
    cachedGateways.set(subdomain, gateways);
    lastCacheTime.set(subdomain, now);

    console.log(`Payment gateways cached for subdomain: ${subdomain}`);
    return gateways;
  } catch (error) {
    console.error("Error fetching payment gateways:", error);
    throw new Error(
      `Failed to fetch payment gateways: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get payment gateway by type
 */
async function getPaymentGateway(
  subdomain: string | null,
  paymentType: "esewa" | "khalti"
): Promise<PaymentGatewayBackend> {
  if (!subdomain) {
    throw new Error("Subdomain is required to fetch payment gateway");
  }

  const gateways = await fetchPaymentGatewaysFromBackend(subdomain);
  const gateway = gateways.find(
    g => g.payment_type === paymentType && g.is_enabled
  );

  if (!gateway) {
    throw new Error(
      `${paymentType} payment gateway is not enabled for this store`
    );
  }

  return gateway;
}

/**
 * Build redirect URLs with subdomain
 */
function buildRedirectUrls(req: Request, subdomain: string | null) {
  const hostHeader = req.headers.get("host") || "";
  const isLocalhost = hostHeader.includes("localhost");
  const protocol = isLocalhost
    ? "http"
    : process.env.NEXT_PUBLIC_PROTOCOL || "https";

  let baseUrl: string;

  if (subdomain) {
    if (isLocalhost) {
      baseUrl = `${protocol}://${subdomain}.localhost:${process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000}`;
    } else {
      baseUrl = `${protocol}://${subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || "rugkala.com"}`;
    }

    const successUrl = `${baseUrl}/preview/${subdomain}/success?method=`;
    const failureUrl = `${baseUrl}/preview/${subdomain}/failure?method=`;
    return { successUrl, failureUrl };
  } else {
    baseUrl = `${protocol}://${hostHeader}`;
    const successUrl = `${baseUrl}/success?method=`;
    const failureUrl = `${baseUrl}/failure?method=`;
    return { successUrl, failureUrl };
  }
}

/**
 * Extract subdomain from request host header
 */
function extractSubdomainFromRequest(req: Request): string | null {
  const host = req.headers.get("host") || "";

  if (host.includes("localhost")) {
    const match = host.match(/^([^.]+)\.localhost/);
    if (match?.[1] && match[1] !== "localhost") {
      return match[1];
    }
    return null;
  }

  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "rugkala.com";
  if (host.endsWith(`.${baseDomain}`)) {
    const subdomain = host.replace(`.${baseDomain}`, "").split(":")[0];
    if (subdomain && subdomain !== "www") {
      return subdomain;
    }
  }

  return null;
}

export async function POST(req: Request) {
  console.log("Received POST request to /api/initiate-payment");

  try {
    // Extract subdomain from request headers
    const subdomain = extractSubdomainFromRequest(req);
    console.log("Extracted subdomain:", subdomain);

    const rawData = await req.json();
    const validation = validatePaymentRequest(rawData);

    if (!validation.isValid) {
      console.error("Validation failed:", validation.errors);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const paymentData = validation.validatedData!;
    const { amount, productName, transactionId, method } = paymentData;

    console.log(`Initiating ${method} payment for amount: ${amount}`);

    // Get redirect URLs
    const { successUrl, failureUrl } = buildRedirectUrls(req, subdomain);

    switch (method as PaymentMethod) {
      case "esewa": {
        // Fetch eSewa gateway config from backend
        const esewaGateway = await getPaymentGateway(subdomain, "esewa");

        // Initialize eSewa API with credentials from backend
        const esewaAPI_instance = esewaAPI.initialize({
          merchantCode: esewaGateway.merchant_code!,
          secretKey: esewaGateway.secret_key,
        });

        const esewaRequest: EsewaInitiateRequest = {
          amount: amount,
          tax_amount: 0,
          total_amount: parseFloat(amount),
          product_service_charge: 0,
          product_delivery_charge: 0,
          success_url: `${successUrl}esewa&`,
          failure_url: `${failureUrl}esewa&`,
        };

        const response = await esewaAPI_instance.initiatePayment(esewaRequest);

        if (!response.success) {
          console.error("eSewa payment initiation failed:", response.error);
          return NextResponse.json(
            {
              success: false,
              error: response.error,
              details: response.details,
            },
            { status: response.status_code || 500 }
          );
        }

        console.log("eSewa payment initiated successfully");

        return NextResponse.json({
          success: true,
          data: {
            amount: amount,
            esewaConfig: response.data,
            transactionId: response.data.transaction_uuid,
          },
          message: "eSewa payment session created successfully",
        });
      }

      case "khalti": {
        // Fetch Khalti gateway config from backend
        const khaltiGateway = await getPaymentGateway(subdomain, "khalti");

        // Initialize Khalti API with credentials from backend
        const khaltiAPI_instance = khaltiAPI.initialize({
          secretKey: khaltiGateway.secret_key,
        });

        const khaltiRequest: KhaltiInitiateRequest = {
          return_url: `${successUrl}khalti`,
          website_url: process.env.NEXT_PUBLIC_BASE_URL!,
          amount: khaltiAPI_instance.formatAmount(amount),
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_info: {
            name: "Test User",
            email: "test@example.com",
            phone: "9800000000",
          },
          amount_breakdown: [
            {
              label: productName,
              amount: khaltiAPI_instance.formatAmount(amount),
            },
          ],
          product_details: [
            {
              identity: transactionId,
              name: productName,
              total_price: khaltiAPI_instance.formatAmount(amount),
              quantity: 1,
              unit_price: khaltiAPI_instance.formatAmount(amount),
            },
          ],
        };

        const response =
          await khaltiAPI_instance.initiatePayment(khaltiRequest);

        if (!response.success) {
          console.error("Khalti payment initiation failed:", response.error);
          return NextResponse.json(
            {
              success: false,
              error: response.error,
              details: response.details,
            },
            { status: response.status_code || 500 }
          );
        }

        console.log("Khalti payment initiated successfully");

        return NextResponse.json({
          success: true,
          data: {
            khaltiPaymentUrl: response.data.payment_url,
            pidx: response.data.pidx,
            expires_at: response.data.expires_at,
            expires_in: response.data.expires_in,
          },
          message: "Khalti payment session created successfully",
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid payment method",
          },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Payment API Error:", err);

    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create payment session",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
