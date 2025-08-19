interface ApiErrorData {
  message?: string;
  [key: string]: unknown;
}

interface ApiError extends Error {
  status: number;
  data: ApiErrorData;
}

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorData;
    const error = new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    ) as ApiError;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response;
};
