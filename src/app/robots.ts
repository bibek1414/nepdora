import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/account/",
        "/admin/",
        "/logout/",
        "/builder/",
        "/preview/",
        "/publish/",
        "/superadmin/",
        "/subscription/",
        "/payment/",
        "/location/",
        "/test/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
