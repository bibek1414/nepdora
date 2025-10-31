import { Metadata } from "next";
import { DynamicFontProvider } from "@/providers/dynamic-font-provider";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";

export const metadata: Metadata = {
  title: "Builder Layout",
  description: "Layout for the site builder",
};
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
