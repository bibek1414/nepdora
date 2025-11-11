import { NextResponse } from "next/server";
import { khaltiAPI } from "@/lib/khalti-api";
import { esewaAPI } from "@/lib/esewa-api";
import { buildPreviewApi } from "@/config/site";

interface PaymentGatewayBackend {
  id: number;
  payment_type: "esewa" | "khalti";
  secret_key: string;
  merchant_code: string | null;
  is_enabled: boolean;
}

// Helper function to extract subdomain
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

// Helper function to fetch payment gateway
async function getPaymentGateway(
  subdomain: string | null,
  paymentType: "esewa" | "khalti"
): Promise<PaymentGatewayBackend> {
  if (!subdomain) {
    throw new Error("Subdomain is required to fetch payment gateway");
  }

  const apiUrl = buildPreviewApi(subdomain);
  const response = await fetch(`${apiUrl}/api/payment-gateway/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

  return gateway;
}

export async function POST(req: Request) {
  console.log("Received POST request to /api/verify-payment");

  try {
    const { pidx, method, data } = await req.json();

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

        return NextResponse.json({
          success: true,
          data: {
            pidx: paymentData.pidx,
            status: paymentData.status,
            transaction_id: paymentData.transaction_id,
            total_amount: khaltiAPI_instance.formatAmountFromPaisa(
              paymentData.total_amount
            ),
            fee: khaltiAPI_instance.formatAmountFromPaisa(paymentData.fee),
            refunded: paymentData.refunded,
            is_success: statusValidation.isSuccess,
            should_provide_service: statusValidation.shouldProvideService,
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
