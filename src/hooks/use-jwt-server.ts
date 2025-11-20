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

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) {
    return null;
  }

  try {
    const payload = decodeJWT(authToken) as JWTPayload;

    if (!payload || isTokenExpired(payload.exp)) {
      return null;
    }

    return {
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
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
