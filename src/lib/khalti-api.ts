import {
  KhaltiInitiateRequest,
  KhaltiInitiateResponse,
  KhaltiLookupRequest,
  KhaltiLookupResponse,
  KhaltiErrorResponse,
  ApiResponse,
} from "@/types/payment";

interface KhaltiConfig {
  secretKey: string;
}

class KhaltiAPIService {
  private baseUrl: string;
  private secretKey: string | null = null;

  constructor() {
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://khalti.com/api/v2"
        : "https://dev.khalti.com/api/v2";
  }

  /**
   * Initialize Khalti API with config
   * Call this before making any API requests
   */
  initialize(config: KhaltiConfig): this {
    if (!config.secretKey) {
      throw new Error("Khalti secret key is required");
    }
    this.secretKey = config.secretKey;
    console.log("Khalti API initialized:", {
      baseUrl: this.baseUrl,
      secretKey: this.secretKey ? "***" : "NOT SET",
      nodeEnv: process.env.NODE_ENV,
    });
    return this;
  }

  private getHeaders(): HeadersInit {
    if (!this.secretKey) {
      throw new Error("Khalti API not initialized. Call initialize() first.");
    }
    return {
      Authorization: `Key ${this.secretKey}`,
      "Content-Type": "application/json",
    };
  }

  async initiatePayment(
    paymentData: KhaltiInitiateRequest
  ): Promise<ApiResponse<KhaltiInitiateResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/epayment/initiate/`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = responseData as KhaltiErrorResponse;
        return {
          success: false,
          error: this.formatKhaltiError(error),
          details: error,
          status_code: response.status,
        };
      }

      return {
        success: true,
        data: responseData as KhaltiInitiateResponse,
        message: "Payment initiated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  async verifyPayment(
    pidx: string
  ): Promise<ApiResponse<KhaltiLookupResponse>> {
    try {
      const lookupData: KhaltiLookupRequest = { pidx };

      const response = await fetch(`${this.baseUrl}/epayment/lookup/`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(lookupData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = responseData as KhaltiErrorResponse;
        return {
          success: false,
          error: this.formatKhaltiError(error),
          details: error,
          status_code: response.status,
        };
      }

      return {
        success: true,
        data: responseData as KhaltiLookupResponse,
        message: "Payment verification completed",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  private formatKhaltiError(error: KhaltiErrorResponse): string {
    // Handle validation errors
    if ("error_key" in error && error.error_key === "validation_error") {
      if ("detail" in error) {
        return Array.isArray(error.detail)
          ? error.detail.join(", ")
          : error.detail;
      }

      // Format field validation errors
      const fieldErrors = Object.entries(error)
        .filter(([key]) => key !== "error_key")
        .map(([field, messages]) => {
          const fieldName = field.replace("_", " ").toLowerCase();
          return `${fieldName}: ${
            Array.isArray(messages) ? messages.join(", ") : messages
          }`;
        });

      return fieldErrors.length > 0
        ? fieldErrors.join("; ")
        : "Validation error occurred";
    }

    // Handle auth errors
    if ("detail" in error && "status_code" in error) {
      return Array.isArray(error.detail)
        ? error.detail.join(", ")
        : error.detail;
    }

    return "An unexpected error occurred";
  }

  validatePaymentStatus(status: string): {
    isSuccess: boolean;
    shouldProvideService: boolean;
    message: string;
  } {
    switch (status) {
      case "Completed":
        return {
          isSuccess: true,
          shouldProvideService: true,
          message: "Payment completed successfully",
        };

      case "Pending":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message:
            "Payment is pending. Please contact support if this persists.",
        };

      case "Expired":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment link has expired. Please try again.",
        };

      case "User canceled":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment was canceled by user.",
        };

      case "Refunded":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment has been refunded.",
        };

      case "Partially Refunded":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment has been partially refunded.",
        };

      case "Initiated":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment is still being processed.",
        };

      default:
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Unknown payment status. Please contact support.",
        };
    }
  }

  formatAmount(amountInRupees: string): number {
    // Convert rupees to paisa (multiply by 100)
    return Math.round(parseFloat(amountInRupees) * 100);
  }

  formatAmountFromPaisa(amountInPaisa: number): string {
    // Convert paisa to rupees (divide by 100)
    return (amountInPaisa / 100).toFixed(2);
  }
}

export const khaltiAPI = new KhaltiAPIService();
