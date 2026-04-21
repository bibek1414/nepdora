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

/**
 * Fetch central Nepdora credentials from API if environment variables are missing
 */
async function fetchNepdoraCentralCredentials(
  paymentType: "esewa" | "khalti"
): Promise<{ secret_key: string; merchant_code: string | null }> {
  try {
    const centralApiUrl =
      "https://nepdora.baliyoventures.com/api/nepdora-payments/";
    console.log(
      `Fetching central credentials for ${paymentType} from: ${centralApiUrl}?payment_type=${paymentType}`
    );

    const response = await fetch(
      `${centralApiUrl}?payment_type=${paymentType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch central credentials: ${response.statusText}`
      );
    }

    const data = await response.json();
    const centralGateway = data.find(
      (g: any) => g.payment_type === paymentType
    );

    if (!centralGateway) {
      throw new Error(`Central credentials for ${paymentType} not found`);
    }

    return {
      secret_key: centralGateway.secret_key,
      merchant_code: centralGateway.merchant_code,
    };
  } catch (error) {
    console.error("Error fetching central credentials:", error);
    throw error;
  }
}

async function getCredentials(paymentType: "esewa" | "khalti") {
  const envMap = {
    esewa: {
      merchant_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
      secret_key: process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY,
    },
    khalti: {
      merchant_code: null,
      secret_key: process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY,
    },
  };

  const creds = envMap[paymentType];

  if (creds.secret_key && (paymentType !== "esewa" || creds.merchant_code)) {
    return creds;
  }

  console.log(
    `Missing ${paymentType} env variables for subscription, fetching from central API...`
  );
  return await fetchNepdoraCentralCredentials(paymentType);
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
 * Build redirect URLs with subdomain for subscription flow
 */
function buildRedirectUrls(req: Request, subdomain: string | null) {
  const hostHeader =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
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
  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";

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

    // Get credentials (with fallback)
    const creds = await getCredentials(method as "esewa" | "khalti");

    switch (method as PaymentMethod) {
      case "esewa": {
        // Initialize eSewa API with credentials
        const esewaAPI_instance = esewaAPI.initialize({
          merchantCode: creds.merchant_code as string,
          secretKey: creds.secret_key as string,
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
        // Initialize Khalti API with credentials
        const khaltiAPI_instance = khaltiAPI.initialize({
          secretKey: creds.secret_key as string,
        });

        const khaltiRequest: KhaltiInitiateRequest = {
          return_url: `${successUrl}khalti`,
          website_url: process.env.NEXT_PUBLIC_BASE_URL!,
          amount: khaltiAPI_instance.formatAmount(amount),
          purchase_order_id: transactionId,
          purchase_order_name: productName,
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
