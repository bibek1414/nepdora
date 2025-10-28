// utils/api-error.ts

interface ApiErrorData {
  message?: string;
  error?: {
    code?: number;
    message?: string;
    params?: {
      constraint_type?: string;
      constraint?: string;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

interface ApiError extends Error {
  status: number;
  data: ApiErrorData;
}

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorData;

    let errorMessage =
      errorData.message || `HTTP ${response.status}: ${response.statusText}`;

    // Handle unique constraint error (409)
    if (response.status === 409 && errorData.error?.params) {
      const { constraint_type, constraint } = errorData.error.params;

      if (constraint_type === "unique" && constraint === "unique_together") {
        errorMessage =
          "This entry already exists. Please use a different value.";
      } else if (constraint_type === "unique") {
        errorMessage =
          "This entry already exists. Please use a different value.";
      }
    }

    const error = new Error(errorMessage) as ApiError;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response;
};
