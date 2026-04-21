import { NextResponse } from "next/server";
import { khaltiAPI } from "@/lib/khalti-api";
import { esewaAPI } from "@/lib/esewa-api";
import { buildPreviewApi, getTenantDomain } from "@/config/site";

interface PaymentGatewayBackend {
  id: number;
  payment_type: "esewa" | "khalti";
  secret_key: string;
  merchant_code: string | null;
  is_enabled: boolean;
}

// Helper function to extract subdomain
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
 * Fetch central Nepdora credentials if tenant has not provided theirs
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
          "X-Tenant-Domain": (await getTenantDomain()) || "",
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

/**
 * Report a successful "Nepdora Managed" transaction to central history
 */
async function reportToCentralPaymentHistory(data: {
  subdomain: string;
  payment_type: string;
  pay_amount: string;
  transaction_id: string;
  products_purchased?: any;
  additional_info?: any;
}) {
  try {
    const centralApiUrl =
      "https://nepdora.baliyoventures.com/api/tenant-central-payments/";
    console.log(
      `Reporting managed transaction for ${data.subdomain} to central history...`
    );

    const response = await fetch(centralApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant": data.subdomain,
        "X-Tenant-Domain": (await getTenantDomain()) || "",
      },
      body: JSON.stringify({
        tenant: data.subdomain, // Required field on backend
        payment_type: data.payment_type,
        pay_amount: data.pay_amount,
        transaction_id: data.transaction_id,
        products_purchased: data.products_purchased || [],
        status: "received",
        additional_info: {
          ...data.additional_info,
          tenant_subdomain: data.subdomain,
        },
      }),
    });

    console.log(
      "Central reporting payload:",
      JSON.stringify(
        {
          tenant: data.subdomain,
          payment_type: data.payment_type,
          pay_amount: data.pay_amount,
          transaction_id: data.transaction_id,
          products_count: data.products_purchased?.length || 0,
          status: "received",
        },
        null,
        2
      )
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `Central history reporting failed (${response.status}) for ${data.subdomain}:`,
        errorText
      );
    } else {
      console.log(
        `Central history reporting successful for ${data.subdomain} (ID: ${data.transaction_id}, Order: ${data.additional_info?.order_id})`
      );
    }
  } catch (error) {
    console.error("Error reporting to central payment history:", error);
  }
}

/**
 * Report a successful transaction to the tenant's own payment history
 */
async function reportToTenantPaymentHistory(data: {
  subdomain: string;
  payment_type: string;
  pay_amount: string;
  transaction_id: string;
  products_purchased?: any;
  additional_info?: any;
}) {
  try {
    // Determine tenant API base URL
    const baseUrl = buildPreviewApi(data.subdomain);
    const historyUrl = `${baseUrl}/api/payment-gateway/history/`;

    console.log(
      `Reporting tenant transaction for ${data.subdomain} to ${historyUrl}...`
    );

    const response = await fetch(historyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Domain": (await getTenantDomain()) || "",
      },
      body: JSON.stringify({
        payment_type: data.payment_type,
        pay_amount: data.pay_amount,
        transaction_id: data.transaction_id,
        products_purchased: data.products_purchased || [],
        status: "received",
        additional_info: {
          ...data.additional_info,
        },
      }),
    });

    console.log(
      "Tenant reporting payload:",
      JSON.stringify(
        {
          subdomain: data.subdomain,
          payment_type: data.payment_type,
          pay_amount: data.pay_amount,
          transaction_id: data.transaction_id,
          products_count: data.products_purchased?.length || 0,
          status: "received",
        },
        null,
        2
      )
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `Tenant history reporting failed (${response.status}):`,
        errorText
      );
    } else {
      console.log("Tenant history reporting successful");
    }
  } catch (error) {
    console.error("Error reporting to tenant payment history:", error);
  }
}

/**
 * Get payment gateway by type and handle fallback if credentials are missing
 */
async function getPaymentGateway(
  subdomain: string | null,
  paymentType: "esewa" | "khalti"
): Promise<PaymentGatewayBackend & { is_fallback?: boolean }> {
  if (!subdomain) {
    throw new Error("Subdomain is required to fetch payment gateway");
  }

  const apiUrl = buildPreviewApi(subdomain);
  const response = await fetch(`${apiUrl}/api/payment-gateway/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Domain": (await getTenantDomain()) || "",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch payment gateways: ${response.statusText}`);
  }

  const data = await response.json();
  const gateways = data.data || data;

  const gateway = gateways.find(
    (g: PaymentGatewayBackend) => g.payment_type === paymentType && g.is_enabled
  );

  if (!gateway) {
    throw new Error(
      `${paymentType} payment gateway is not enabled for this store`
    );
  }

  // Check if credentials are missing (fallback logic)
  if (
    !gateway.secret_key ||
    (paymentType === "esewa" && !gateway.merchant_code)
  ) {
    console.log(
      `${paymentType} credentials missing for tenant during verification. Falling back to Nepdora central credentials.`
    );
    const centralCreds = await fetchNepdoraCentralCredentials(paymentType);

    return {
      ...gateway,
      secret_key: centralCreds.secret_key,
      merchant_code: centralCreds.merchant_code,
      is_fallback: true,
    };
  }

  return { ...gateway, is_fallback: false };
}

export async function POST(req: Request) {
  console.log("Received POST request to /api/verify-payment");

  try {
    const body = await req.json();
    const {
      pidx,
      method,
      data,
      products_purchased,
      order_id,
      customer_name,
      mobile,
    } = body;
    console.log("Verify payment request body:", JSON.stringify(body, null, 2));

    if (!method) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment method is required",
        },
        { status: 400 }
      );
    }

    // Extract subdomain from request
    const subdomain = extractSubdomainFromRequest(req);
    console.log("Extracted subdomain:", subdomain);

    switch (method) {
      case "khalti": {
        if (!pidx) {
          return NextResponse.json(
            {
              success: false,
              error: "Payment ID (pidx) is required for Khalti verification",
            },
            { status: 400 }
          );
        }

        console.log(`Verifying Khalti payment with pidx: ${pidx}`);

        // Fetch Khalti gateway config from backend
        const khaltiGateway = await getPaymentGateway(subdomain, "khalti");

        // Initialize Khalti API with credentials
        const khaltiAPI_instance = khaltiAPI.initialize({
          secretKey: khaltiGateway.secret_key,
        });

        const verificationResponse =
          await khaltiAPI_instance.verifyPayment(pidx);

        if (!verificationResponse.success) {
          console.error(
            "Khalti verification failed:",
            verificationResponse.error
          );
          return NextResponse.json(
            {
              success: false,
              error: verificationResponse.error,
              details: verificationResponse.details,
            },
            { status: verificationResponse.status_code || 500 }
          );
        }

        const paymentData = verificationResponse.data;
        const statusValidation = khaltiAPI_instance.validatePaymentStatus(
          paymentData.status
        );

        console.log(
          `Khalti payment verification completed. Status: ${paymentData.status}`
        );

        const totalAmount = khaltiAPI_instance.formatAmountFromPaisa(
          paymentData.total_amount
        );

        // Report to history
        if (statusValidation.isSuccess && subdomain) {
          const reportData = {
            subdomain,
            payment_type: "khalti",
            pay_amount: totalAmount,
            transaction_id: paymentData.transaction_id || pidx,
            products_purchased: products_purchased,
            additional_info: {
              pidx: paymentData.pidx,
              status: paymentData.status,
              is_fallback: khaltiGateway.is_fallback,
              order_id,
              customer_info: {
                name: customer_name || "Customer",
              },
              mobile: mobile || body.mobile, // Khalti ID or mobile
            },
          };

          if (khaltiGateway.is_fallback) {
            await reportToCentralPaymentHistory(reportData);
          } else {
            await reportToTenantPaymentHistory(reportData);
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            pidx: paymentData.pidx,
            status: paymentData.status,
            transaction_id: paymentData.transaction_id,
            total_amount: totalAmount,
            fee: khaltiAPI_instance.formatAmountFromPaisa(paymentData.fee),
            refunded: paymentData.refunded,
            is_success: statusValidation.isSuccess,
            should_provide_service: statusValidation.shouldProvideService,
            products_purchased: products_purchased,
          },
          message: statusValidation.message,
        });
      }

      case "esewa": {
        if (!data) {
          return NextResponse.json(
            {
              success: false,
              error: "Payment data is required for eSewa verification",
            },
            { status: 400 }
          );
        }

        console.log(`Verifying eSewa payment with encoded data`);

        // Fetch eSewa gateway config from backend
        const esewaGateway = await getPaymentGateway(subdomain, "esewa");

        // Initialize eSewa API with credentials
        const esewaAPI_instance = esewaAPI.initialize({
          merchantCode: esewaGateway.merchant_code!,
          secretKey: esewaGateway.secret_key,
        });

        const verificationResponse = await esewaAPI_instance.verifyPayment({
          data: data,
        });

        if (!verificationResponse.success) {
          console.error(
            "eSewa verification failed:",
            verificationResponse.error
          );
          return NextResponse.json(
            {
              success: false,
              error: verificationResponse.error,
              details: verificationResponse.details,
            },
            { status: verificationResponse.status_code || 500 }
          );
        }

        const paymentData = verificationResponse.data;

        console.log(
          `eSewa payment verification completed. Status: ${paymentData.status}`
        );

        // Report to history
        if (paymentData.is_success && subdomain) {
          const reportData = {
            subdomain,
            payment_type: "esewa",
            pay_amount: paymentData.total_amount.toString(),
            transaction_id:
              paymentData.transaction_code || paymentData.transaction_uuid,
            products_purchased: products_purchased,
            additional_info: {
              transaction_uuid: paymentData.transaction_uuid,
              ref_id: paymentData.ref_id,
              status: paymentData.status,
              is_fallback: esewaGateway.is_fallback,
              order_id,
              customer_info: {
                name: customer_name || "Customer",
              },
              mobile, // eSewa username or mobile
            },
          };

          if (esewaGateway.is_fallback) {
            await reportToCentralPaymentHistory(reportData);
          } else {
            await reportToTenantPaymentHistory(reportData);
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            transaction_code: paymentData.transaction_code,
            transaction_uuid: paymentData.transaction_uuid,
            status: paymentData.status,
            total_amount: paymentData.total_amount.toString(),
            ref_id: paymentData.ref_id,
            is_success: paymentData.is_success,
            should_provide_service: paymentData.should_provide_service,
            products_purchased: products_purchased,
          },
          message: verificationResponse.message,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unsupported payment method for verification",
          },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Payment verification error:", err);

    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: "Payment verification failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
