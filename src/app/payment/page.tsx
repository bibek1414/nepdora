// components/PaymentGateway.tsx
"use client";

import { useState, useEffect } from "react";

interface PaymentGateway {
  id: number;
  payment_type: "esewa" | "khalti";
  merchant_code: string | null;
  is_enabled: boolean;
}

interface PaymentConfig {
  data: PaymentGateway[];
  enabled: {
    esewa: PaymentGateway | undefined;
    khalti: PaymentGateway | undefined;
  };
}

export default function PaymentGateway() {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(100);
  const [paymentType, setPaymentType] = useState<"esewa" | "khalti">("esewa");

  /**
   * Fetch payment gateways from API
   */
  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        setLoading(true);

        // Extract subdomain from current URL
        const url = new URL(window.location.href);
        const hostname = url.hostname;
        const subdomain = hostname.split(".")[0];

        const response = await fetch(
          `/api/payment-gateway?subdomain=${subdomain}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payment gateways");
        }

        const data: PaymentConfig = await response.json();
        setPaymentConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Payment gateway error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentGateways();
  }, []);

  /**
   * Handle eSewa payment
   */
  const handleEsewaPayment = async () => {
    if (!paymentConfig?.enabled.esewa) {
      setError("eSewa is not enabled");
      return;
    }

    try {
      const esewaGateway = paymentConfig.enabled.esewa;

      const response = await fetch("/api/payment-gateway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "initiate",
          amount,
          productCode: "NEPDORA_PAYMENT",
          paymentType: "esewa",
          subdomain: new URL(window.location.href).hostname.split(".")[0],
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`eSewa Payment initiated for: ${amount}`);
        console.log("eSewa Response:", data);
        // Redirect to eSewa payment page
        // window.location.href = esewaPaymentUrl;
      } else {
        setError("Failed to initiate eSewa payment");
      }
    } catch (err) {
      setError("Error processing eSewa payment");
      console.error("eSewa error:", err);
    }
  };

  /**
   * Handle Khalti payment
   */
  const handleKhaltiPayment = async () => {
    if (!paymentConfig?.enabled.khalti) {
      setError("Khalti is not enabled");
      return;
    }

    try {
      const khaltiGateway = paymentConfig.enabled.khalti;

      const response = await fetch("/api/payment-gateway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "initiate",
          amount,
          purchaseOrderId: `ORDER_${Date.now()}`,
          paymentType: "khalti",
          subdomain: new URL(window.location.href).hostname.split(".")[0],
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Khalti Payment initiated for: ${amount}`);
        console.log("Khalti Response:", data);
        // Redirect to Khalti payment page
        // window.location.href = khaltiPaymentUrl;
      } else {
        setError("Failed to initiate Khalti payment");
      }
    } catch (err) {
      setError("Error processing Khalti payment");
      console.error("Khalti error:", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading payment gateways...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!paymentConfig) {
    return <div className="p-6">No payment configuration found</div>;
  }

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Payment Gateway</h2>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          min="1"
        />
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Payment Method</label>
        <select
          value={paymentType}
          onChange={e => setPaymentType(e.target.value as "esewa" | "khalti")}
          className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {paymentConfig.enabled.esewa && <option value="esewa">eSewa</option>}
          {paymentConfig.enabled.khalti && (
            <option value="khalti">Khalti</option>
          )}
        </select>
      </div>

      {/* Payment Buttons */}
      <div className="space-y-3">
        {paymentConfig.enabled.esewa && (
          <button
            onClick={handleEsewaPayment}
            disabled={paymentType !== "esewa"}
            className="w-full rounded-lg bg-green-600 py-2 font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-400"
          >
            Pay with eSewa
          </button>
        )}

        {paymentConfig.enabled.khalti && (
          <button
            onClick={handleKhaltiPayment}
            disabled={paymentType !== "khalti"}
            className="w-full rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:bg-gray-400"
          >
            Pay with Khalti
          </button>
        )}
      </div>

      {/* Debug Info */}
      <div className="mt-6 rounded-lg bg-gray-100 p-4 text-sm">
        <h3 className="mb-2 font-semibold">Enabled Gateways:</h3>
        <pre className="overflow-auto text-xs">
          {JSON.stringify(paymentConfig.enabled, null, 2)}
        </pre>
      </div>
    </div>
  );
}
