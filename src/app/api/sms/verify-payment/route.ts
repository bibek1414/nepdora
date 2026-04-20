/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { khaltiAPI } from "@/lib/khalti-api";
import { esewaAPI } from "@/lib/esewa-api";
import {
  PaymentMethod,
  EsewaVerificationRequest,
  KhaltiLookupRequest,
} from "@/types/payment";
import { getServerUser } from "@/hooks/use-jwt-server";
import { cookies } from "next/headers";
import { getApiBaseUrl, getTenantDomain } from "@/config/site";

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
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error(`Failed to fetch central credentials`);
    const data = await response.json();
    const centralGateway = data.find(
      (g: any) => g.payment_type === paymentType
    );
    if (!centralGateway)
      throw new Error(`Central credentials for ${paymentType} not found`);

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

/**
 * Report SMS purchase to the tenant's backend
 */
async function recordSmsPurchase(data: {
  amount: number;
  transaction_id: string;
  price: string;
  payment_type: string;
  payment_method?: string;
}) {
  const API_BASE_URL = getApiBaseUrl();
  const cookieStore = await cookies();
  const token =
    cookieStore.get("authToken")?.value ||
    cookieStore.get("google_auth_token")?.value;
  const tenantDomain = await getTenantDomain();

  const response = await fetch(`${API_BASE_URL}/api/sms/purchases/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Tenant-Domain": tenantDomain || "",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to record SMS purchase in backend:", errorText);
    throw new Error("Failed to record SMS purchase in backend");
  }

  return response.json();
}

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const { method, amount, transaction_id } = requestData;

    if (!method || !["esewa", "khalti"].includes(method)) {
      console.warn("Invalid payment method attempted:", method);
      return NextResponse.json(
        { success: false, error: "Invalid payment method" },
        { status: 400 }
      );
    }

    const creds = await getCredentials(method as "esewa" | "khalti");

    let verificationResult: any;

    if (method === "esewa") {
      const { data } = requestData;
      const esewaAPI_instance = esewaAPI.initialize({
        merchantCode: creds.merchant_code as string,
        secretKey: creds.secret_key as string,
      });

      const response = await esewaAPI_instance.verifyPayment({ data });
      if (!response.success) {
        console.error("eSewa Verification Failed:", response.error);
        return NextResponse.json(
          { success: false, error: response.error },
          { status: 500 }
        );
      }
      verificationResult = response.data;
    } else {
      const { pidx } = requestData;
      const khaltiAPI_instance = khaltiAPI.initialize({
        secretKey: creds.secret_key as string,
      });

      const response = await khaltiAPI_instance.verifyPayment(pidx);
      if (!response.success) {
        console.error("Khalti Verification Failed:", response.error);
        return NextResponse.json(
          { success: false, error: response.error },
          { status: 500 }
        );
      }

      const status = khaltiAPI_instance.validatePaymentStatus(
        response.data.status
      );
      if (!status.isSuccess) {
        console.warn("Khalti Payment Incomplete:", status.message);
        return NextResponse.json(
          { success: false, error: status.message },
          { status: 400 }
        );
      }
      verificationResult = response.data;
    }

    // Payment verified, now record in backend
    // transaction_id should be the gateway's transaction code/id
    const gatewayTransactionId =
      method === "esewa"
        ? verificationResult.transaction_code
        : verificationResult.transaction_id || verificationResult.pidx;

    // If Khalti, amount is in paisa, so divide by 100
    const finalPrice =
      method === "khalti"
        ? (Number(verificationResult.total_amount) / 100).toString()
        : (verificationResult.total_amount || amount).toString();

    await recordSmsPurchase({
      amount: Number(amount),
      transaction_id: gatewayTransactionId,
      price: finalPrice,
      payment_type: method,
      payment_method: method, // Alias for backend compatibility
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and SMS credits added",
      data: {
        price: finalPrice,
        transaction_id: gatewayTransactionId,
        amount: amount,
        payment_type: method,
      },
    });
  } catch (err: any) {
    console.error("SMS Payment Verification Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Verification failed" },
      { status: 500 }
    );
  }
}
