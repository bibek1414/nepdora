import { cookies } from "next/headers";
import { decodeJWT, isTokenExpired, JWTPayload } from "@/lib/jwt-utils";
import { User } from "@/types/auth/auth";
import { generateUserAvatar } from "@/lib/user-utils";

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
  website_type?: string;
  is_template_account?: boolean;
}

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();

  // Check for both normal auth token and Google auth token
  const authToken = cookieStore.get("authToken")?.value;
  const googleAuthToken = cookieStore.get("google_auth_token")?.value;
  const googleAuthUser = cookieStore.get("google_auth_user")?.value;

  // Priority 1: Check Google auth first
  if (googleAuthToken && googleAuthUser) {
    try {
      // Parse Google auth user data
      let userData: GoogleAuthUser;
      try {
        userData = JSON.parse(googleAuthUser);
      } catch (e) {
        // Try URL decoding if regular parse fails
        const decoded = decodeURIComponent(googleAuthUser);
        userData = JSON.parse(decoded);
      }

      // Also decode the token to get additional fields
      let tokenPayload: JWTPayload | null = null;
      try {
        tokenPayload = decodeJWT(googleAuthToken) as JWTPayload;
      } catch (error) {
        console.error("[getServerUser] Error decoding Google token:", error);
      }

      const user: User = {
        id: userData.user_id || tokenPayload?.user_id || 0,
        user_id: userData.user_id || tokenPayload?.user_id || 0,
        email: userData.email || tokenPayload?.email || "",
        store_name: userData.store_name || tokenPayload?.store_name || "",
        name: userData.store_name || tokenPayload?.store_name || "",
        role: userData.role || tokenPayload?.role || "owner",
        phone_number: userData.phone_number || tokenPayload?.phone_number || "",
        domain: userData.domain || tokenPayload?.domain || "",
        sub_domain: userData.sub_domain || tokenPayload?.sub_domain || "",
        has_profile: userData.has_profile ?? tokenPayload?.has_profile ?? true,
        has_profile_completed:
          userData.has_profile_completed ??
          tokenPayload?.has_profile_completed ??
          false,
        first_login: userData.first_login ?? tokenPayload?.first_login ?? true,
        is_onboarding_complete:
          userData.is_onboarding_complete ??
          tokenPayload?.is_onboarding_complete ??
          false,
        website_type:
          userData.website_type || tokenPayload?.website_type || "ecommerce",
        is_template_account:
          userData.is_template_account ??
          tokenPayload?.is_template_account ??
          false,
        avatar: generateUserAvatar(
          userData.store_name || tokenPayload?.store_name || "User"
        ),
      };

      return user;
    } catch (error) {
      console.error("[getServerUser] Error processing Google auth:", error);
      // Fall through to normal auth token check
    }
  }

  // Priority 2: Check normal auth token
  if (authToken) {
    try {
      const payload = decodeJWT(authToken) as JWTPayload;

      if (!payload || isTokenExpired(payload.exp)) {
        return null;
      }

      const user: User = {
        id: payload.user_id,
        user_id: payload.user_id,
        email: payload.email,
        store_name: payload.store_name,
        name: payload.store_name,
        role: payload.role,
        phone_number: payload.phone_number,
        domain: payload.domain,
        sub_domain: payload.sub_domain,
        has_profile: payload.has_profile,
        has_profile_completed: payload.has_profile_completed,
        first_login: payload.first_login,
        is_onboarding_complete: payload.is_onboarding_complete,
        website_type: payload.website_type || "ecommerce",
        is_template_account: payload.is_template_account ?? false,
        avatar: generateUserAvatar(payload.store_name),
      };

      return user;
    } catch (error) {
      console.error("[getServerUser] Error decoding normal JWT:", error);
      return null;
    }
  }

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
}
