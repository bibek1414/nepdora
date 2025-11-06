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

interface PaymentGatewayConfig {
  payment_type: "esewa" | "khalti";
  secret_key: string;
  merchant_code: string | null;
  is_enabled: boolean;
}

function validateEnvironmentVariables(): {
  isValid: boolean;
  errors: string[];
  gateways?: {
    esewa: PaymentGatewayConfig;
    khalti: PaymentGatewayConfig;
  };
} {
  const errors: string[] = [];

  // Check required environment variables
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    errors.push("Secret key is required");
  }

  if (!process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE) {
    errors.push("Secret key is required");
  }

  if (!process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY) {
    errors.push("Secret key is required");
  }

  if (!process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY) {
    errors.push("Secret key is required");
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Create gateway configurations from environment variables
  const gateways = {
    esewa: {
      payment_type: "esewa" as const,
      secret_key: process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY!,
      merchant_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE!,
      is_enabled: true,
    },
    khalti: {
      payment_type: "khalti" as const,
      secret_key: process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY!,
      merchant_code: null,
      is_enabled: true,
    },
  };

  return {
    isValid: true,
    errors: [],
    gateways,
  };
}

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
 * Get payment gateway by type from environment variables
 */
function getPaymentGateway(
  paymentType: "esewa" | "khalti"
): PaymentGatewayConfig {
  const envValidation = validateEnvironmentVariables();

  if (!envValidation.isValid) {
    throw new Error(`Payment gateway configuration error`);
  }

  const gateway = envValidation.gateways![paymentType];

  if (!gateway.is_enabled) {
    throw new Error(`${paymentType} payment gateway is not enabled`);
  }

  return gateway;
}

/**
 * Build redirect URLs with subdomain for subscription flow
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
      baseUrl = `${protocol}://${subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com"}`;
    }

    const successUrl = `${baseUrl}/subscription/success?method=`;
    const failureUrl = `${baseUrl}/subscription/failure?method=`;
    return { successUrl, failureUrl };
  } else {
    baseUrl = `${protocol}://${hostHeader}`;
    const successUrl = `${baseUrl}/subscription/success?method=`;
    const failureUrl = `${baseUrl}/subscription/failure?method=`;
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

  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
  if (host.endsWith(`.${baseDomain}`)) {
    const subdomain = host.replace(`.${baseDomain}`, "").split(":")[0];
    if (subdomain && subdomain !== "www") {
      return subdomain;
    }
  }

  return null;
}

/**
 * Check if we're in development environment
 */
function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export async function POST(req: Request) {
  console.log("Received POST request to /api/initiate-payment");

  try {
    // Validate environment variables first
    const envValidation = validateEnvironmentVariables();
    if (!envValidation.isValid) {
      console.error("Environment configuration error:", envValidation.errors);

      // Don't expose specific environment variable names in production
      const errorMessage = isDevelopment()
        ? `Environment configuration error: ${envValidation.errors.join(", ")}`
        : "Payment service is currently unavailable. Please try again later.";

      return NextResponse.json(
        {
          success: false,
          error: "Service configuration error",
          details: isDevelopment() ? envValidation.errors : undefined,
        },
        { status: 500 }
      );
    }

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

    // Get redirect URLs with /subscription/ path
    const { successUrl, failureUrl } = buildRedirectUrls(req, subdomain);

    switch (method as PaymentMethod) {
      case "esewa": {
        // Get eSewa gateway config from environment variables
        const esewaGateway = getPaymentGateway("esewa");

        // Initialize eSewa API with credentials from environment
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
          failure_url: `${failureUrl}esewa`,
        };

        const response = await esewaAPI_instance.initiatePayment(esewaRequest);

        if (!response.success) {
          console.error("eSewa payment initiation failed:", response.error);
          return NextResponse.json(
            {
              success: false,
              error: response.error,
              details: isDevelopment() ? response.details : undefined,
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
        // Get Khalti gateway config from environment variables
        const khaltiGateway = getPaymentGateway("khalti");

        // Initialize Khalti API with credentials from environment
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
              details: isDevelopment() ? response.details : undefined,
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

    // Don't expose internal error details in production
    const userFriendlyError = isDevelopment()
      ? errorMessage
      : "Failed to create payment session. Please try again later.";

    return NextResponse.json(
      {
        success: false,
        error: "Payment initiation failed",
        details: isDevelopment() ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
