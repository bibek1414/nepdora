import { getAuthToken, getAuthTokenCustomer } from "./auth";

export const createHeaders = (
  includeAuth: boolean = true,
  isFormData: boolean = false
): HeadersInit => {
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const createHeadersCustomer = (
  includeAuth: boolean = true
): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthTokenCustomer();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};
