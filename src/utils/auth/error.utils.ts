import {
  ErrorResponse,
  FormErrorState,
  AuthErrorCodes,
  FlowTypes,
  ApiErrorResponse,
} from "@/types/auth/error.types";

export class AuthErrorHandler {
  /**
   * Parse and format authentication errors for display
   */
  static parseAuthError(error: ErrorResponse): FormErrorState {
    if (!error.response) {
      return {
        message:
          "Network error. Please check your internet connection and try again.",
        type: "error",
      };
    }

    const { status, data } = error.response;

    // Handle specific API error responses
    if (data?.error) {
      return this.handleApiError(data, status);
    }

    // Handle allauth flow responses - FIXED: Access flows through data.data
    if (data?.data?.flows) {
      return this.handleFlowError(data);
    }

    // Handle general HTTP status codes
    return this.handleHttpStatusError(status, data);
  }

  private static handleApiError(
    data: ApiErrorResponse,
    status: number
  ): FormErrorState {
    const { code, message, params } = data.error!;

    switch (code) {
      case 409: // Conflict - user/store already exists
        if (params?.email) {
          return {
            message:
              "An account with this email already exists. Please use a different email or try logging in.",
            type: "error",
            action: {
              label: "Login instead",
              href: "/login",
            },
          };
        }
        if (message.includes("store name")) {
          return {
            message:
              "This store name is already taken. Please choose a different store name.",
            type: "error",
          };
        }
        return {
          message:
            message ||
            "This information is already registered. Please try different details.",
          type: "error",
        };

      case 422: // Validation error
        if (message.includes("store name")) {
          return {
            message:
              "This store name is already taken. Please choose a different store name.",
            type: "error",
          };
        }
        if (message.includes("phone")) {
          return {
            message:
              "Please enter a valid phone number (numbers only, max 15 digits).",
            type: "error",
          };
        }
        return {
          message: message || "Please check your input and try again.",
          type: "error",
        };

      case 400: // Bad request
        return {
          message:
            message ||
            "Invalid request. Please check your information and try again.",
          type: "error",
        };

      default:
        return {
          message: message || "An error occurred. Please try again.",
          type: "error",
        };
    }
  }

  private static handleFlowError(data: ApiErrorResponse): FormErrorState {
    // FIXED: Access flows through data.data instead of data directly
    const flows = data.data?.flows || [];
    const hasVerifyEmailFlow = flows.some(
      flow => flow.id === FlowTypes.VERIFY_EMAIL && flow.is_pending
    );

    if (hasVerifyEmailFlow) {
      return {
        message:
          "Your email address is not verified yet. Please check your email and click the verification link.",
        type: "warning",
        action: {
          label: "Resend verification",
          href: "/signup/verify",
        },
      };
    }

    return {
      message: "Authentication required. Please check your credentials.",
      type: "error",
    };
  }

  private static handleHttpStatusError(
    status: number,
    data?: ApiErrorResponse
  ): FormErrorState {
    switch (status) {
      case 401:
        return {
          message:
            "Invalid email or password. Please check your credentials and try again.",
          type: "error",
        };

      case 403:
        return {
          message:
            "Your account has been suspended. Please contact support for assistance.",
          type: "error",
        };

      case 404:
        return {
          message:
            "Account not found. Please check your email address or sign up for a new account.",
          type: "error",
          action: {
            label: "Sign up instead",
            href: "/signup",
          },
        };

      case 409:
        return {
          message:
            "An account with this information already exists. Please use different details or try logging in.",
          type: "error",
          action: {
            label: "Login instead",
            href: "/login",
          },
        };

      case 422:
        return {
          message:
            data?.error?.message || "Please check your input and try again.",
          type: "error",
        };

      case 429:
        return {
          message:
            "Too many attempts. Please wait a few minutes before trying again.",
          type: "warning",
        };

      case 500:
      case 502:
      case 503:
        return {
          message: "Server error occurred. Please try again later.",
          type: "error",
        };

      default:
        return {
          message:
            data?.error?.message ||
            "An unexpected error occurred. Please try again.",
          type: "error",
        };
    }
  }

  /**
   * Get user-friendly error message for specific field validation
   */
  static getFieldError(field: string, error: ErrorResponse): string | null {
    if (!error.response?.data?.error) return null;

    const { message, params } = error.response.data.error;

    switch (field) {
      case "email":
        if (params?.email || message.includes("email")) {
          return "This email is already registered";
        }
        break;

      case "store_name":
        if (message.includes("store name")) {
          return "This store name is already taken";
        }
        break;

      case "phone":
        if (message.includes("phone")) {
          return "Please enter a valid phone number";
        }
        break;

      default:
        return null;
    }

    return null;
  }

  /**
   * Check if error indicates email verification is needed
   */
  static isEmailVerificationNeeded(error: ErrorResponse): boolean {
    // FIXED: Access flows through the correct nested path
    const flows = error.response?.data?.data?.flows;
    return (
      flows?.some(
        flow => flow.id === FlowTypes.VERIFY_EMAIL && flow.is_pending
      ) || false
    );
  }

  /**
   * Check if error indicates too many login attempts
   */
  static isTooManyAttempts(error: ErrorResponse): boolean {
    const errorCode = error.response?.data?.data?.errors?.[0]?.code;
    return (
      errorCode === AuthErrorCodes.TOO_MANY_ATTEMPTS ||
      error.response?.status === 429
    );
  }
}
