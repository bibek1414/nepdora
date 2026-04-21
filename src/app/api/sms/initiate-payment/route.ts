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

/**
 * Build redirect URLs with subdomain for SMS flow
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

    const successUrl = `${baseUrl}/admin/sms/payment/success?method=`;
    const failureUrl = `${baseUrl}/admin/sms/payment/failure?method=`;
    return { successUrl, failureUrl };
  } else {
    baseUrl = `${protocol}://${hostHeader}`;
    const successUrl = `${baseUrl}/admin/sms/payment/success?method=`;
    const failureUrl = `${baseUrl}/admin/sms/payment/failure?method=`;
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
 * Fetch central Nepdora credentials from API if environment variables are missing
 */
async function fetchNepdoraCentralCredentials(
  paymentType: "esewa" | "khalti"
): Promise<{ secret_key: string; merchant_code: string | null }> {
  try {
    const centralApiUrl =
      "https://nepdora.baliyoventures.com/api/nepdora-payments/";

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

  return await fetchNepdoraCentralCredentials(paymentType);
}

export async function POST(req: Request) {
  try {
    const subdomain = extractSubdomainFromRequest(req);
    const rawData = await req.json();

    const { amount, productName, transactionId, method } = rawData;

    if (!amount || isNaN(parseFloat(amount))) {
      return NextResponse.json(
        { success: false, error: "Valid amount is required" },
        { status: 400 }
      );
    }

    if (!method || !["esewa", "khalti"].includes(method)) {
      return NextResponse.json(
        { success: false, error: "Valid payment method is required" },
        { status: 400 }
      );
    }

    const { successUrl, failureUrl } = buildRedirectUrls(req, subdomain);
    const creds = await getCredentials(method as "esewa" | "khalti");

    switch (method as PaymentMethod) {
      case "esewa": {
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
          success_url: `${successUrl}esewa`,
          failure_url: `${failureUrl}esewa`,
        };

        const response = await esewaAPI_instance.initiatePayment(esewaRequest);

        if (!response.success) {
          return NextResponse.json(
            { success: false, error: response.error },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            amount: amount,
            esewaConfig: response.data,
            transactionId: response.data.transaction_uuid,
          },
        });
      }

      case "khalti": {
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
          return NextResponse.json(
            { success: false, error: response.error },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            khaltiPaymentUrl: response.data.payment_url,
            pidx: response.data.pidx,
          },
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid payment method" },
          { status: 400 }
        );
    }
  } catch (err: any) {
    console.error("SMS Payment Initiation Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
