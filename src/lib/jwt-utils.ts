// lib/jwt-utils.ts

export function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }

  try {
    const decoded = atob(str);
    return decodeURIComponent(escape(decoded));
  } catch (error) {
    console.error("Error decoding base64:", error);
    return "";
  }
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    const payload = base64UrlDecode(parts[1]);
    if (!payload) {
      console.error("Failed to decode JWT payload");
      return null;
    }

    return JSON.parse(payload) as JWTPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function isTokenExpired(exp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= exp;
}

// Define the JWTPayload interface with website_type
export interface JWTPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  email: string;
  store_name: string;
  has_profile: boolean;
  role: string;
  phone_number: string;
  domain: string;
  sub_domain: string;
  has_profile_completed: boolean;
  is_template_account: boolean;
  first_login?: boolean;
  is_onboarding_complete?: boolean;
  website_type?: string;
}
