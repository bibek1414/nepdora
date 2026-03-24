import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createServerHeaders, getServerApiBaseUrl } from "@/config/server-site";
import { getServerUser } from "@/hooks/use-jwt-server";
import { getPublishSiteTag } from "@/lib/publish-page-cache";

export async function POST() {
  try {
    const user = await getServerUser();

    if (!user?.sub_domain) {
      return NextResponse.json(
        { message: "Unauthorized publish request" },
        { status: 401 }
      );
    }

    const baseUrl = await getServerApiBaseUrl();
    const headers = await createServerHeaders();
    const response = await fetch(`${baseUrl}/api/publish-all/`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { message: text || "Failed to publish site" },
        { status: response.status }
      );
    }

    revalidateTag(getPublishSiteTag(user.sub_domain), "max");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to publish and revalidate site:", error);
    return NextResponse.json(
      { message: "Failed to publish site" },
      { status: 500 }
    );
  }
}
