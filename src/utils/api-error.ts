interface FieldErrors {
  [fieldName: string]: string[];
}

interface ApiErrorData {
  message?: string;
  error?: {
    code?: number;
    message?: string;
    params?: {
      constraint_type?: string;
      constraint?: string;
      field_errors?: FieldErrors;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

export interface ApiError extends Error {
  status: number;
  data: ApiErrorData;
  fieldErrors?: FieldErrors;
}

export const handleApiError = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorData;

    let errorMessage =
      errorData.message || `HTTP ${response.status}: ${response.statusText}`;

    // Handle validation errors (400)
    if (response.status === 400 && errorData.error?.params?.field_errors) {
      const fieldErrors = errorData.error.params.field_errors;
      const fieldNames = Object.keys(fieldErrors);

      if (fieldNames.length > 0) {
        // Create a user-friendly message for validation errors
        const errorList = fieldNames
          .map(field => `${field}: ${fieldErrors[field].join(", ")}`)
          .join("; ");
        errorMessage = `Validation failed: ${errorList}`;
      }

      const error = new Error(errorMessage) as ApiError;
      error.status = response.status;
      error.data = errorData;
      error.fieldErrors = fieldErrors; // Attach field errors for form handling
      throw error;
    }

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

    // Handle other specific status codes
    if (response.status === 413) {
      errorMessage = "File size too large. Maximum allowed size is 5MB.";
    }

    if (response.status === 415) {
      errorMessage = "Invalid file type. Please upload a valid image file.";
    }

    const error = new Error(errorMessage) as ApiError;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response;
};

// File validation utility
export const validateFile = (
  file: File
): { valid: boolean; error?: string } => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const MIN_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size must not exceed 5MB",
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a JPEG, PNG, or WebP image",
    };
  }

  return { valid: true };
};

// URL validation utility
export const validateUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return true;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

// Social media URL validators
export const validateSocialUrls = (data: {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}): { valid: boolean; errors: FieldErrors } => {
  const errors: FieldErrors = {};

  if (data.facebook && !validateUrl(data.facebook)) {
    errors.facebook = ["Enter a valid URL"];
  }

  if (data.instagram && !validateUrl(data.instagram)) {
    errors.instagram = ["Enter a valid URL"];
  }

  if (data.linkedin && !validateUrl(data.linkedin)) {
    errors.linkedin = ["Enter a valid URL"];
  }

  if (data.twitter && !validateUrl(data.twitter)) {
    errors.twitter = ["Enter a valid URL"];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
