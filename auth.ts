import NextAuth, { type NextAuthOptions } from "next-auth";
import { type JWT } from "next-auth/jwt";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import Google from "next-auth/providers/google";
import { oauth_google } from "./google-config";
import { cookies } from "next/headers";
import { siteConfig } from "./src/config/site";

interface DecodedToken extends JwtPayload {
  user_type?: string;
  user_id?: number | string;
  email?: string;
  username?: string;
  store_name?: string;
  has_usable_password?: boolean;
  has_profile?: boolean;
  role?: string;
  phone_number?: string;
  domain?: string;
  sub_domain?: string;
  has_profile_completed?: boolean;
  first_login?: boolean;
  is_onboarding_complete?: boolean;
  first_name?: string;
  last_name?: string;
  grade?: string;
}

const GOOGLE_STORE_NAME_COOKIE = "google_store_name";
const GOOGLE_PHONE_NUMBER_COOKIE = "google_phone_number";
const GOOGLE_WEBSITE_TYPE_COOKIE = "google_website_type";
const GOOGLE_AUTH_ERROR_COOKIE = "google_auth_error";

const getPendingGoogleSignupMetadata = async () => {
  try {
    const cookieStore = await cookies();
    const storeName = cookieStore.get(GOOGLE_STORE_NAME_COOKIE)?.value;
    const phoneNumber = cookieStore.get(GOOGLE_PHONE_NUMBER_COOKIE)?.value;
    const websiteType = cookieStore.get(GOOGLE_WEBSITE_TYPE_COOKIE)?.value;

    return { storeName, phoneNumber, websiteType };
  } catch (error) {
    console.error("Failed to read Google signup metadata:", error);
    return {
      storeName: undefined,
      phoneNumber: undefined,
      websiteType: undefined,
    };
  }
};

const persistGoogleAuthError = async (
  message: string,
  options?: { force?: boolean }
) => {
  try {
    const cookieStore = await cookies();
    if (!options?.force && cookieStore.get(GOOGLE_AUTH_ERROR_COOKIE)?.value) {
      return;
    }

    cookieStore.set(GOOGLE_AUTH_ERROR_COOKIE, message, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 5 * 60 * 1000),
      path: "/",
    });
  } catch (error) {
    console.error("Failed to persist Google auth error:", error);
  }
};

const clearGoogleAuthError = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.set(GOOGLE_AUTH_ERROR_COOKIE, "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });
  } catch (error) {
    console.error("Failed to clear Google auth error:", error);
  }
};

// Extend the NextAuth Session and JWT types to include your custom properties
declare module "next-auth" {
  interface User {
    id: number | string;
    username?: string;
    email: string;
    store_name: string;
    has_usable_password?: boolean;
    user_id?: number;
    has_profile?: boolean;
    role?: string;
    phone_number?: string;
    domain?: string;
    sub_domain?: string;
    has_profile_completed?: boolean;
    first_login?: boolean;
    is_onboarding_complete?: boolean;
    // Additional fields from OAuth/backend
    name?: string;
    display?: string;
    user_type?: string;
    accessToken?: string;
    refreshToken?: string;
    first_name?: string | null;
    last_name?: string | null;
    grade?: string;
  }
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token_type?: string;
    exp?: number;
    iat?: number;
    jti?: string;
    // Core user fields matching User type from AuthContext
    id?: number | string;
    user_id?: number;
    username?: string;
    email?: string;
    store_name?: string;
    has_usable_password?: boolean;
    has_profile?: boolean;
    role?: string;
    phone_number?: string;
    domain?: string;
    sub_domain?: string;
    has_profile_completed?: boolean;
    first_login?: boolean;
    is_onboarding_complete?: boolean;
    // Additional OAuth/backend fields
    user_type?: string;
    first_name?: string | null;
    last_name?: string | null;
    accessToken?: string;
    refreshToken?: string;
    grade?: string;
    display?: string;
    name?: string;
    image?: string;
    error?: string;
  }
}

const nextAuthOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: oauth_google.client_id,
      clientSecret: oauth_google.client_secret,
      authorization: {
        params: {
          prompt: oauth_google.prompt,
          access_type: oauth_google.access_type,
          response_type: oauth_google.response_type,
        },
      },
    }),
  ],
  pages: {
    signIn: "/admin/signup",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "google") {
          try {
            // Fetch the pending signup metadata: store_name and phone
            const { storeName, phoneNumber, websiteType } =
              await getPendingGoogleSignupMetadata();
            console.log("[Google Auth] Store name:", storeName);
            console.log("[Google Auth] Phone number:", phoneNumber);
            console.log("[Google Auth] Website type:", websiteType);

            // ⭐ FIXED: backend expects "phone", not "phone_number"
            const requestBody = {
              provider: "google",
              process: "login",
              token: {
                client_id: oauth_google.client_id,
                id_token: account.id_token,
                access_token: account.access_token,
              },

              data: {
                app: {
                  store_name: storeName || null,
                  phone: phoneNumber || null,
                  website_type: websiteType || "ecommerce",
                },
              },
            };

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/_allauth/browser/v1/auth/provider/token`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error("Error response body:", errorText);
              let backendErrorMessage =
                "We couldn't sign you in with Google. Please try again or use email login.";
              try {
                const parsed = JSON.parse(errorText);
                backendErrorMessage =
                  parsed?.errors?.[0]?.message ||
                  parsed?.error ||
                  parsed?.message ||
                  backendErrorMessage;
              } catch (parseError) {
                console.warn(
                  "Failed to parse Google auth error response:",
                  parseError
                );
              }
              await persistGoogleAuthError(backendErrorMessage, {
                force: true,
              });
              throw new Error(
                `GoogleAuthBackendError(${response.status}): ${backendErrorMessage}`
              );
            }

            const data = await response.json();
            console.log("[Google Auth] Data:", data);
            const decodedToken = jwtDecode<DecodedToken>(
              data.data.user.access_token
            );

            console.log("[Google Auth] Decoded token:", decodedToken);

            if (!decodedToken.sub_domain) {
              await persistGoogleAuthError(
                "We couldn't find a workspace connected to this Google account. Please contact support or complete your signup.",
                { force: true }
              );
              throw new Error("GoogleAuthMissingSubdomain");
            }

            // Store sub_domain and tokens in cookies for redirect callback
            // Use same cookie format as AuthContext for consistency
            if (decodedToken.sub_domain) {
              const cookieStore = await cookies();
              const baseDomain = siteConfig.baseDomain;
              const expires = new Date(Date.now() + 60 * 1000); // 60 seconds

              // Store sub_domain
              cookieStore.set(
                "google_auth_sub_domain",
                decodedToken.sub_domain,
                {
                  httpOnly: false,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  expires: expires,
                  path: "/",
                }
              );

              // Store tokens for redirect URL (same format as AuthContext)
              if (data.data.user.access_token) {
                cookieStore.set(
                  "google_auth_token",
                  data.data.user.access_token,
                  {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    expires: expires,
                    path: "/",
                  }
                );
              }
              if (data.data.user.refresh_token) {
                cookieStore.set(
                  "google_auth_refresh_token",
                  data.data.user.refresh_token,
                  {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    expires: expires,
                    path: "/",
                  }
                );
              }

              // Also store user data in cookie (similar to authUser cookie)
              const persistedUser = {
                user_id: data.data.user.id,
                email: decodedToken.email || data.data.user.email || "",
                store_name:
                  decodedToken.store_name || data.data.user.display || "",
                has_profile: decodedToken.has_profile ?? false,
                role: decodedToken.role,
                phone_number: decodedToken.phone_number,
                domain: decodedToken.domain,
                sub_domain: decodedToken.sub_domain,
                has_profile_completed: decodedToken.has_profile_completed,
                is_onboarding_complete: decodedToken.is_onboarding_complete,
              };
              cookieStore.set(
                "google_auth_user",
                JSON.stringify(persistedUser),
                {
                  httpOnly: false,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  expires: expires,
                  path: "/",
                }
              );
            }

            await clearGoogleAuthError();

            return {
              ...token,
              // Core user fields from backend response and decoded token
              id: data.data.user.id,
              user_id: data.data.user.id,
              email: data.data.user.email || decodedToken.email || "",
              username: data.data.user.username || decodedToken.username,
              store_name:
                decodedToken.store_name || data.data.user.display || "",
              has_usable_password:
                data.data.user.has_usable_password ??
                decodedToken.has_usable_password ??
                false,
              has_profile: decodedToken.has_profile ?? false,
              role: decodedToken.role,
              phone_number: decodedToken.phone_number,
              domain: decodedToken.domain,
              sub_domain: decodedToken.sub_domain,
              has_profile_completed: decodedToken.has_profile_completed,
              first_login: decodedToken.first_login,
              is_onboarding_complete: decodedToken.is_onboarding_complete,
              // OAuth/backend fields
              accessToken: data.data.user.access_token,
              refreshToken: data.data.user.refresh_token,
              first_name: decodedToken.first_name,
              last_name: decodedToken.last_name,
              display: data.data.user.display || decodedToken.store_name || "",
              user_type: decodedToken.user_type,
              name:
                user.name ||
                data.data.user.display ||
                decodedToken.store_name ||
                "",
              image: user.image,
              grade: decodedToken.grade,
              iat: decodedToken.iat,
              exp: decodedToken.exp,
              jti: decodedToken.jti,
            } as JWT;
          } catch (error) {
            console.error("Google auth error:", error);
            await persistGoogleAuthError(
              "Google sign-in failed. Please try again in a moment.",
              { force: false }
            );
            throw error;
          }
        }
        // This is for credentials provider
        // if (user.accessToken) {
        //   const decoded = jwtDecode<DecodedToken>(user.accessToken);
        //   return {
        //     ...token,
        //     ...user,
        //     has_profile: decoded?.has_profile || false,
        //   } as JWT;
        // }
        return { ...token, ...user } as JWT;
      }

      // if (token.exp && Date.now() > token.exp) {
      //   try {
      //     const response = await fetch(
      //       `${globalConfig.baseUrl}/_allauth/browser/v1/auth/token/refresh`,
      //       {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //         body: JSON.stringify({
      //           refresh_token: token.refreshToken,
      //         }),
      //       }
      //     );

      //     if (response.ok) {
      //       const data = await response.json();
      //       const decoded = jwtDecode<DecodedToken>(data.data.access_token);
      //       return {
      //         ...token,
      //         accessToken: data.data.access_token,
      //         tokenExpiry: (decoded.exp ?? 0) * 1000,
      //       };
      //     }
      //   } catch (error) {
      //     console.error("Token refresh failed:", error);
      //     return { ...token, error: "RefreshAccessTokenError" };
      //   }
      // }

      return token as JWT;
    },
    async session({ session, token }) {
      if (session.user) {
        // Core user fields matching User type from AuthContext
        session.user.id = (token.id || token.user_id || session.user.id) as
          | number
          | string;
        session.user.user_id = token.user_id;
        session.user.email = token.email || session.user.email || "";
        session.user.username = token.username || session.user.email || "";
        session.user.store_name = token.store_name || "";
        session.user.has_usable_password = token.has_usable_password || false;
        session.user.has_profile = token.has_profile || false;
        session.user.role = token.role;
        session.user.phone_number = token.phone_number;
        session.user.domain = token.domain;
        session.user.sub_domain = token.sub_domain;
        session.user.has_profile_completed = token.has_profile_completed;
        session.user.first_login = token.first_login;
        session.user.is_onboarding_complete = token.is_onboarding_complete;
        // Additional OAuth/backend fields
        session.user.name =
          token.name || session.user.name || session.user.email || "";
        session.user.display = token.display || session.user.name || "";
        session.user.user_type = token.user_type;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.accessToken = token.accessToken || "";
        session.user.refreshToken = token.refreshToken || "";
        session.user.grade = token.grade;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
};

// Export the configuration for use in route handler
export default nextAuthOptions;

// Export auth utilities (for client-side use)
export const getServerAuth = () => {
  return NextAuth(nextAuthOptions);
};
