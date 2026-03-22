import { MetadataRoute } from "next";

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
    sitemap: "https://www.nepdora.com/sitemap.xml",
  };
}
