// lib/server-api-client.ts
"use server";

import { getServerApiBaseUrl, createServerHeaders } from "@/config/server-site";
import { handleApiError } from "@/utils/api-error";

/**
 * Generic server-side API client
 * Automatically handles authentication, tenant headers, and subdomain routing
 */

interface FetchOptions extends Omit<RequestInit, "headers"> {
  // Allow additional headers to be merged
  headers?: HeadersInit;
}

/**
 * Make a GET request
 */
export async function serverGet<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const baseUrl = await getServerApiBaseUrl();
  const baseHeaders = await createServerHeaders();

  const url = `${baseUrl}${endpoint}`;
  
  const headers = {
    ...baseHeaders,
    ...options?.headers,
  };

  console.log(`[serverGet] ${url}`);
  console.log(`[serverGet] X-Tenant-Domain:`, (headers as any)["X-Tenant-Domain"] || (headers as any)["x-tenant-domain"]);

  const response = await fetch(url, {
    method: "GET",
    ...options,
    headers,
    cache: options?.cache || "no-store",
  });

  await handleApiError(response);
  const data = await response.json();
  console.log(`[serverGet] Response:`, data);
  return data;
}

/**
 * Make a POST request
 */
export async function serverPost<T>(
  endpoint: string,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  options?: FetchOptions
): Promise<T> {
  const baseUrl = await getServerApiBaseUrl();
  const baseHeaders = await createServerHeaders();

  const url = `${baseUrl}${endpoint}`;
  
  const headers = {
    ...baseHeaders,
    ...options?.headers,
  };

  console.log(`[serverPost] ${url}`);
  console.log(`[serverPost] X-Tenant-Domain:`, (headers as any)["X-Tenant-Domain"] || (headers as any)["x-tenant-domain"]);
  console.log(`[serverPost] Body:`, data);

  const response = await fetch(url, {
    method: "POST",
    ...options,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await handleApiError(response);
  const responseData = await response.json();
  console.log(`[serverPost] Response:`, responseData);
  return responseData;
}

/**
 * Make a PATCH request
 */
export async function serverPatch<T>(
  endpoint: string,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  options?: FetchOptions
): Promise<T> {
  const baseUrl = await getServerApiBaseUrl();
  const baseHeaders = await createServerHeaders();

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "PATCH",
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  await handleApiError(response);
  return response.json();
}

/**
 * Make a PUT request
 */
export async function serverPut<T>(
  endpoint: string,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  options?: FetchOptions
): Promise<T> {
  const baseUrl = await getServerApiBaseUrl();
  const baseHeaders = await createServerHeaders();

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "PUT",
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  await handleApiError(response);
  return response.json();
}

/**
 * Make a DELETE request
 */
export async function serverDelete<T = void>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const baseUrl = await getServerApiBaseUrl();
  const baseHeaders = await createServerHeaders();

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "DELETE",
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
  });

  await handleApiError(response);

  // DELETE might return empty response
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}
