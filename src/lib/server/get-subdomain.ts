"use server";

import { cookies } from "next/headers";
import { decodeJWT, isTokenExpired, JWTPayload } from "@/lib/jwt-utils";

export async function getSubDomain(): Promise<string | null> {
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

    return payload.sub_domain || null;
  } catch (error) {
    console.error("Error decoding JWT for subdomain:", error);
    return null;
  }
}
