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
