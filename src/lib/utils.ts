import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type JwtPayload = Record<string, unknown>;

export function decodeJwt<T extends JwtPayload = JwtPayload>(
  token: string
): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const jsonPayload = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(jsonPayload) as T;
  } catch (_e) {
    return null;
  }
}

export function buildTenantFrontendUrl(
  subdomain: string,
  opts?: { path?: string; isDev?: boolean; baseDomain?: string; port?: number }
): string {
  const path = opts?.path ?? "/";
  const isDev = opts?.isDev ?? process.env.NODE_ENV !== "production";
  const baseDomain = opts?.baseDomain ?? "nepdora.com";
  const port = opts?.port ?? 3000;
  if (isDev) {
    return `http://${subdomain}.localhost:${port}${path}`;
  }
  return `https://${subdomain}.${baseDomain}${path}`;
}

export const getButtonVariant = (variant: string) => {
  switch (variant) {
    case "primary":
      return "default";
    case "secondary":
      return "secondary";
    case "outline":
      return "outline";
    default:
      return "default";
  }
};

/**
 * Converts a hex color string to an RGBA color string with the specified opacity.
 * @param hex - The hex color string (e.g., "#3B82F6" or "3B82F6").
 * @param opacity - The opacity value (0 to 1).
 * @returns The RGBA color string.
 */
export function hexToRgba(hex: string, opacity: number = 1): string {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;

  let cleanHex = hex.replace("#", "");

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map(char => char + char)
      .join("");
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
