export const googleClientId = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID;
export const googleClientSecret = process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET;
export const googleRedirectUri =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI;

type GOOGLE_AUTH_KEYS =
  | "client_id"
  | "client_secret"
  | "endpoint"
  | "redirect_uri"
  | "response_type"
  | "scopes"
  | "prompt"
  | "access_type";

export const oauth_google: Record<GOOGLE_AUTH_KEYS, string> = {
  client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || "",
  client_secret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET || "",
  prompt: "consent",
  access_type: "offline",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI || "",
  response_type: "code",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};
