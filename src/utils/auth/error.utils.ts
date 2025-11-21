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

    // Handle new error format with errors array
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return this.handleErrorsArray(data.errors, status);
    }

    // Handle specific API error responses (old format)
    if (data?.error) {
      return this.handleApiError(data, status);
    }

    // Handle allauth flow responses
    if (data?.data?.flows) {
      return this.handleFlowError(data);
    }

    // Handle general HTTP status codes
    return this.handleHttpStatusError(status, data);
  }

  private static handleErrorsArray(
    errors: Array<{ code: string; message: string; param?: string }>,
    status: number
  ): FormErrorState {
    const firstError = errors[0];
    const { code, message } = firstError;

    switch (code) {
      case "email_password_mismatch":
        return {
          message:
            "Invalid email or password. Please check your credentials and try again.",
          type: "error",
        };

      case "email_not_verified":
      case "account_not_verified":
        return {
          message:
            "Your email address is not verified yet. Please check your email and click the verification link.",
          type: "warning",
          action: {
            label: "Resend verification email",
            href: "#",
          },
        };

      case "account_disabled":
      case "account_suspended":
        return {
          message:
            "Your account has been suspended. Please contact support for assistance.",
          type: "error",
        };

      case "email_exists":
        return {
          message:
            "An account with this email already exists. Please use a different email or try logging in.",
          type: "error",
          action: {
            label: "Login instead",
            href: "/login",
          },
        };

      case "store_name_taken":
        return {
          message:
            "This store name is already taken. Please choose a different store name.",
          type: "error",
        };

      case "phone_invalid":
        return {
          message:
            "Please enter a valid phone number (numbers only, max 15 digits).",
          type: "error",
        };

      case "too_many_login_attempts":
        return {
          message:
            "Too many attempts. Please wait a few minutes before trying again.",
          type: "warning",
        };

      case "user_not_found":
        return {
          message:
            "Account not found. Please check your email address or sign up for a new account.",
          type: "error",
          action: {
            label: "Sign up instead",
            href: "/signup",
          },
        };

      default:
        // Return the message from the API if available
        return {
          message: message || "An error occurred. Please try again.",
          type: "error",
        };
    }
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
          href: `/account/verify-email`,
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
    // Check new errors array format
    const errors = error.response?.data?.errors;
    if (errors && Array.isArray(errors)) {
      const fieldError = errors.find(err => err.param === field);
      if (fieldError) {
        return fieldError.message;
      }
    }

    // Check old format
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
    // Check new errors array format
    const errors = error.response?.data?.errors;
    if (errors && Array.isArray(errors)) {
      return errors.some(
        err =>
          err.code === "email_not_verified" ||
          err.code === "account_not_verified"
      );
    }

    // Check flows (old format)
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
    // Check new errors array format
    const errors = error.response?.data?.errors;
    if (errors && Array.isArray(errors)) {
      return errors.some(err => err.code === "too_many_login_attempts");
    }

    // Check old format
    const errorCode = error.response?.data?.data?.errors?.[0]?.code;
    return (
      errorCode === AuthErrorCodes.TOO_MANY_ATTEMPTS ||
      error.response?.status === 429
    );
  }
}
