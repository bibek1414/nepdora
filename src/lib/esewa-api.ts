import {
  EsewaInitiateRequest,
  EsewaInitiateResponse,
  EsewaVerificationRequest,
  EsewaVerificationResponse,
  EsewaStatusCheckRequest,
  EsewaStatusCheckResponse,
  EsewaErrorResponse,
  ApiResponse,
  EsewaPaymentStatus,
} from "@/types/payment";

interface EsewaConfig {
  merchantCode: string;
  secretKey: string;
}

class EsewaAPIService {
  private baseUrl: string;
  private merchantCode: string | null = null;
  private secretKey: string | null = null;

  constructor() {
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://epay.esewa.com.np/api/epay"
        : "https://rc-epay.esewa.com.np/api/epay";
  }

  /**
   * Initialize eSewa API with config
   * Call this before making any API requests
   */
  initialize(config: EsewaConfig): this {
    if (!config.merchantCode || !config.secretKey) {
      throw new Error("eSewa merchant code and secret key are required");
    }
    this.merchantCode = config.merchantCode;
    this.secretKey = config.secretKey;

    console.log("eSewa API Configuration:", {
      baseUrl: this.baseUrl,
      merchantCode: this.merchantCode ? "***" : "NOT SET",
      secretKey: this.secretKey ? "***" : "NOT SET",
      nodeEnv: process.env.NODE_ENV,
    });

    return this;
  }

  private validateInitialized(): void {
    if (!this.merchantCode || !this.secretKey) {
      throw new Error("eSewa API not initialized. Call initialize() first.");
    }
  }

  async generateSignature(message: string): Promise<string> {
    this.validateInitialized();

    const CryptoJS = await import("crypto-js");
    console.log("Generating signature for message:", message);
    console.log("Using secret key:", this.secretKey ? "***" : "NOT SET");

    const hash = CryptoJS.HmacSHA256(message, this.secretKey!);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    console.log("Generated signature:", signature);
    return signature;
  }

  async initiatePayment(
    paymentData: EsewaInitiateRequest
  ): Promise<ApiResponse<EsewaInitiateResponse>> {
    try {
      this.validateInitialized();

      const transactionUuid = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const productCode = this.merchantCode!;

      // Ensure total_amount is a string with proper format for eSewa
      const totalAmount = paymentData.total_amount;

      const esewaConfig = {
        amount: paymentData.amount,
        tax_amount: paymentData.tax_amount || 0,
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: productCode,
        product_service_charge: paymentData.product_service_charge || 0,
        product_delivery_charge: paymentData.product_delivery_charge || 0,
        success_url: paymentData.success_url,
        failure_url: paymentData.failure_url,
        signed_field_names: "total_amount,transaction_uuid,product_code",
      };

      // Generate signature - must match the order in signed_field_names
      const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${productCode}`;
      console.log("Signature input string:", signatureString);
      console.log("Secret key length:", this.secretKey?.length);
      const signature = await this.generateSignature(signatureString);
      console.log("Generated signature:", signature);

      return {
        success: true,
        data: {
          ...esewaConfig,
          signature,
          payment_url: `${this.baseUrl}/main/v2/form`,
        },
        message: "eSewa payment session created successfully",
      };
    } catch (error) {
      console.error("eSewa payment initiation error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment initiation failed",
      };
    }
  }

  async verifyPayment(
    verificationData: EsewaVerificationRequest
  ): Promise<ApiResponse<EsewaVerificationResponse>> {
    try {
      this.validateInitialized();

      console.log(
        "Verifying eSewa payment with data:",
        verificationData.data.substring(0, 100) + "..."
      );

      // Decode the base64 encoded response
      let decodedResponse;
      try {
        const decodedString = Buffer.from(
          verificationData.data,
          "base64"
        ).toString("utf-8");
        console.log("Decoded eSewa response string:", decodedString);
        decodedResponse = JSON.parse(decodedString);
      } catch (decodeError) {
        console.error("Failed to decode eSewa response:", decodeError);
        return {
          success: false,
          error: "Invalid eSewa response format - failed to decode data",
          status_code: 400,
        };
      }

      console.log("Decoded eSewa response object:", decodedResponse);

      // Check if required fields exist
      if (!decodedResponse.signed_field_names || !decodedResponse.signature) {
        return {
          success: false,
          error: "Invalid eSewa response - missing signature fields",
          status_code: 400,
        };
      }

      // Validate signature
      const signatureFields = decodedResponse.signed_field_names.split(",");
      const signatureString = signatureFields
        .map(
          (field: string) => `${field.trim()}=${decodedResponse[field.trim()]}`
        )
        .join(",");

      console.log("Signature string for verification:", signatureString);

      const expectedSignature = await this.generateSignature(signatureString);
      console.log("Expected signature:", expectedSignature);
      console.log("Received signature:", decodedResponse.signature);

      if (expectedSignature !== decodedResponse.signature) {
        console.error("Signature mismatch - payment verification failed");
        return {
          success: false,
          error: "Invalid signature - payment verification failed",
          details: {
            expected: expectedSignature,
            received: decodedResponse.signature,
            signatureString: signatureString,
          },
          status_code: 400,
        };
      }

      // Map eSewa status to our standard format
      const paymentStatus = this.mapEsewaStatus(decodedResponse.status);
      const statusValidation = this.validatePaymentStatus(paymentStatus);

      console.log("eSewa payment verification successful:", {
        status: paymentStatus,
        is_success: statusValidation.isSuccess,
      });

      return {
        success: true,
        data: {
          transaction_code: decodedResponse.transaction_code,
          status: paymentStatus,
          total_amount: parseFloat(decodedResponse.total_amount),
          transaction_uuid: decodedResponse.transaction_uuid,
          product_code: decodedResponse.product_code,
          ref_id: decodedResponse.transaction_code,
          is_success: statusValidation.isSuccess,
          should_provide_service: statusValidation.shouldProvideService,
        },
        message: statusValidation.message,
      };
    } catch (error) {
      console.error("eSewa payment verification error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment verification failed",
        details: error instanceof Error ? error.stack : undefined,
      };
    }
  }

  async checkPaymentStatus(
    statusData: EsewaStatusCheckRequest
  ): Promise<ApiResponse<EsewaStatusCheckResponse>> {
    try {
      this.validateInitialized();

      const queryParams = new URLSearchParams({
        product_code: statusData.product_code,
        total_amount: statusData.total_amount.toString(),
        transaction_uuid: statusData.transaction_uuid,
      });

      const statusUrl = `${this.baseUrl}/transaction/status/?${queryParams}`;
      console.log("Checking eSewa payment status at:", statusUrl);

      const response = await fetch(statusUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("eSewa status check response:", responseData);

      // Handle service unavailable response
      if ("error_message" in responseData) {
        return {
          success: false,
          error: responseData.error_message,
          status_code: response.status,
        };
      }

      const paymentStatus = this.mapEsewaStatus(responseData.status);
      const statusValidation = this.validatePaymentStatus(paymentStatus);

      return {
        success: true,
        data: {
          ...responseData,
          status: paymentStatus,
          is_success: statusValidation.isSuccess,
          should_provide_service: statusValidation.shouldProvideService,
        },
        message: statusValidation.message,
      };
    } catch (error) {
      console.error("eSewa status check error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Status check request failed",
        details: error instanceof Error ? error.stack : undefined,
      };
    }
  }

  private mapEsewaStatus(status: string): EsewaPaymentStatus {
    const statusMap: Record<string, EsewaPaymentStatus> = {
      COMPLETE: "COMPLETE",
      PENDING: "PENDING",
      FULL_REFUND: "FULL_REFUND",
      PARTIAL_REFUND: "PARTIAL_REFUND",
      AMBIGUOUS: "AMBIGUOUS",
      NOT_FOUND: "NOT_FOUND",
      CANCELED: "CANCELED",
    };

    return statusMap[status] || "AMBIGUOUS";
  }

  validatePaymentStatus(status: EsewaPaymentStatus): {
    isSuccess: boolean;
    shouldProvideService: boolean;
    message: string;
  } {
    switch (status) {
      case "COMPLETE":
        return {
          isSuccess: true,
          shouldProvideService: true,
          message: "Payment completed successfully",
        };

      case "PENDING":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message:
            "Payment is pending. Please wait or contact support if this persists.",
        };

      case "FULL_REFUND":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment has been fully refunded.",
        };

      case "PARTIAL_REFUND":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment has been partially refunded.",
        };

      case "AMBIGUOUS":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment is in an ambiguous state. Please contact support.",
        };

      case "NOT_FOUND":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment session expired or not found.",
        };

      case "CANCELED":
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Payment has been canceled.",
        };

      default:
        return {
          isSuccess: false,
          shouldProvideService: false,
          message: "Unknown payment status. Please contact support.",
        };
    }
  }

  formatAmount(amount: string): number {
    return parseFloat(amount);
  }
}

export const esewaAPI = new EsewaAPIService();
