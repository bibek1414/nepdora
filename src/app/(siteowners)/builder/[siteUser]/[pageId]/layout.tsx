import { Metadata } from "next";
import { DynamicFontProvider } from "@/providers/dynamic-font-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <DynamicFontProvider>
        <body>{children}</body>
      </DynamicFontProvider>
    </html>
  );
}
