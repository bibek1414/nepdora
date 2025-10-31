import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  // Helper function to parse hash parameters from URL
  function parseHashParams(hash: string): Record<string, string> {
    return hash
      .substring(1) // Remove the '#'
      .split("&")
      .reduce((acc: Record<string, string>, item) => {
        const [key, value] = item.split("=");
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {});
  }
  const { searchParams, hash } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");

  // Handle hash parameters (client-side flow)
  if (hash) {
    const hashParams = parseHashParams(hash);
    if (hashParams.access_token) {
      // Redirect to the auth handler with the token in query parameters
      // This is needed because hash fragments are not sent to the server
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/facebook/auth/callback?` +
          `access_token=${encodeURIComponent(hashParams.access_token)}` +
          `&expires_in=${hashParams.expires_in || ""}` +
          `&data_access_expiration_time=${hashParams.data_access_expiration_time || ""}`
      );
    }
  }

  // Handle errors from Facebook
  if (error) {
    console.error("Facebook OAuth error:", {
      error,
      errorReason,
      errorDescription,
    });
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?error=${encodeURIComponent(errorDescription || "Failed to connect to Facebook")}`
    );
  }

  // Server-side OAuth flow
  if (code) {
    try {
      // Exchange the authorization code for an access token
      const response = await axios.get(
        `https://graph.facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"}/oauth/access_token`,
        {
          params: {
            client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/facebook/callback`,
            code,
          },
        }
      );

      const { access_token: userAccessToken } = response.data;

      // Get the user's pages
      const pagesResponse = await axios.get(
        `https://graph.facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"}/me/accounts`,
        {
          params: {
            access_token: userAccessToken,
          },
        }
      );

      // Find the page that matches the configured page ID
      interface FacebookPage {
        id: string;
        access_token: string;
        name: string;
      }

      const page = (pagesResponse.data.data as FacebookPage[]).find(
        p => p.id === process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID
      );

      if (!page) {
        throw new Error(
          "Connected Facebook account does not have access to the configured page"
        );
      }

      // Redirect to the messenger page with the page access token
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/messenger?page_access_token=${encodeURIComponent(page.access_token)}&page_id=${page.id}`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during Facebook OAuth callback:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?error=${encodeURIComponent(errorMessage || "Failed to complete Facebook connection")}`
      );
    }
  }

  // If we get here, no valid parameters were provided
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?error=${encodeURIComponent("Invalid request parameters")}`
  );
}
