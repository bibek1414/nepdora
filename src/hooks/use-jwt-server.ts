// hooks/use-jwt-server.ts
import { cookies } from "next/headers";
import { decodeJWT, isTokenExpired, JWTPayload } from "@/lib/jwt-utils";

export interface User {
  id: number;
  email: string;
  name: string;
  storeName: string;
  role: string;
  phoneNumber: string;
  domain: string;
  subDomain: string;
  hasProfile: boolean;
  hasProfileCompleted: boolean;
  isFirstLogin?: boolean;
  isOnboardingComplete?: boolean;
  avatar: string;
}

interface GoogleAuthUser {
  user_id?: number;
  email: string;
  store_name: string;
  has_profile: boolean;
  role: string;
  phone_number: string;
  domain: string;
  sub_domain: string;
  has_profile_completed: boolean;
  first_login: boolean;
  is_onboarding_complete: boolean;
}

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();

  // Check for both normal auth token and Google auth token
  const authToken = cookieStore.get("authToken")?.value;
  const googleAuthToken = cookieStore.get("google_auth_token")?.value;
  const googleAuthUser = cookieStore.get("google_auth_user")?.value;

  console.log("[getServerUser] Auth check:", {
    hasAuthToken: !!authToken,
    hasGoogleAuthToken: !!googleAuthToken,
    hasGoogleAuthUser: !!googleAuthUser,
  });

  // Priority 1: Check Google auth first
  if (googleAuthToken && googleAuthUser) {
    try {
      console.log("[getServerUser] Processing Google auth...");

      // Parse Google auth user data
      let userData: GoogleAuthUser;
      try {
        userData = JSON.parse(googleAuthUser);
      } catch (e) {
        // Try URL decoding if regular parse fails
        const decoded = decodeURIComponent(googleAuthUser);
        userData = JSON.parse(decoded);
      }

      console.log("[getServerUser] Google user data:", userData);

      // Also decode the token to get additional fields
      let tokenPayload: JWTPayload | null = null;
      try {
        tokenPayload = decodeJWT(googleAuthToken) as JWTPayload;
        console.log("[getServerUser] Google token payload:", tokenPayload);
      } catch (error) {
        console.error("[getServerUser] Error decoding Google token:", error);
      }

      const user: User = {
        id: userData.user_id || tokenPayload?.user_id || 0,
        email: userData.email || tokenPayload?.email || "",
        name: userData.store_name || tokenPayload?.store_name || "",
        storeName: userData.store_name || tokenPayload?.store_name || "",
        role: userData.role || tokenPayload?.role || "owner",
        phoneNumber: userData.phone_number || tokenPayload?.phone_number || "",
        domain: userData.domain || tokenPayload?.domain || "",
        subDomain: userData.sub_domain || tokenPayload?.sub_domain || "",
        hasProfile: userData.has_profile ?? tokenPayload?.has_profile ?? true,
        hasProfileCompleted:
          userData.has_profile_completed ??
          tokenPayload?.has_profile_completed ??
          false,
        isFirstLogin: userData.first_login ?? tokenPayload?.first_login ?? true,
        isOnboardingComplete:
          userData.is_onboarding_complete ??
          tokenPayload?.is_onboarding_complete ??
          false,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.store_name || tokenPayload?.store_name || "User"
        )}&background=3b82f6&color=ffffff&size=32&rounded=true&bold=true`,
      };

      console.log("[getServerUser] Google auth user created:", user);
      return user;
    } catch (error) {
      console.error("[getServerUser] Error processing Google auth:", error);
      // Fall through to normal auth token check
    }
  }

  // Priority 2: Check normal auth token
  if (authToken) {
    try {
      console.log("[getServerUser] Processing normal auth token...");
      const payload = decodeJWT(authToken) as JWTPayload;

      if (!payload || isTokenExpired(payload.exp)) {
        console.log("[getServerUser] Token expired or invalid");
        return null;
      }

      const user: User = {
        id: payload.user_id,
        email: payload.email,
        name: payload.store_name,
        storeName: payload.store_name,
        role: payload.role,
        phoneNumber: payload.phone_number,
        domain: payload.domain,
        subDomain: payload.sub_domain,
        hasProfile: payload.has_profile,
        hasProfileCompleted: payload.has_profile_completed,
        isFirstLogin: payload.first_login,
        isOnboardingComplete: payload.is_onboarding_complete,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          payload.store_name
        )}&background=3b82f6&color=ffffff&size=32&rounded=true&bold=true`,
      };

      console.log("[getServerUser] Normal auth user created:", user);
      return user;
    } catch (error) {
      console.error("[getServerUser] Error decoding normal JWT:", error);
      return null;
    }
  }

  console.log("[getServerUser] No valid auth found");
  return null;
}

// Helper function to clear Google auth cookies (for after redirect)
export async function clearGoogleAuthCookies() {
  const cookieStore = await cookies();

  const cookiesToClear = [
    "google_auth_token",
    "google_auth_refresh_token",
    "google_auth_user",
    "google_auth_sub_domain",
  ];

  cookiesToClear.forEach(cookieName => {
    cookieStore.delete(cookieName);
  });

  console.log("[clearGoogleAuthCookies] Google auth cookies cleared");
}
