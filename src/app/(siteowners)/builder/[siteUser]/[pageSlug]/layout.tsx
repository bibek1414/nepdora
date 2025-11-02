import { DynamicFontProvider } from "@/providers/dynamic-font-provider";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Website Builder",
    pageDescription:
      "Access the powerful website builder for {storeName}. Customize pages, layouts, and design elements in real time for a seamless building experience.",
    pageRoute: "/builder",
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <DynamicFavicon />
      <DynamicFontProvider>
        <body>{children}</body>
      </DynamicFontProvider>
    </html>
  );
}
