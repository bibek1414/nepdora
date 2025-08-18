export const siteConfig = {
  name: " ",
  description: "Nepdora",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com",
  protocol:
    process.env.NEXT_PUBLIC_PROTOCOL ||
    (process.env.NODE_ENV === "production" ? "https" : "http"),
  isDev: process.env.NODE_ENV !== "production",
  frontendDevPort: Number(process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000),
};

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    try {
      const authTokens = localStorage.getItem("authTokens");
      if (authTokens) {
        const tokens = JSON.parse(authTokens);
        const accessToken = tokens.access_token;

        if (accessToken) {
          const parts = accessToken.split(".");
          if (parts.length === 3) {
            const payload = parts[1];
            // Base64 URL decode
            let str = payload.replace(/-/g, "+").replace(/_/g, "/");
            while (str.length % 4) {
              str += "=";
            }

            try {
              const decoded = JSON.parse(decodeURIComponent(escape(atob(str))));
              if (decoded.domain) {
                return `https://${decoded.domain}`;
              }
            } catch (error) {
              console.error("Error decoding JWT for API base URL:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error getting API base URL from JWT:", error);
    }
  }

  return siteConfig.apiBaseUrl;
};
