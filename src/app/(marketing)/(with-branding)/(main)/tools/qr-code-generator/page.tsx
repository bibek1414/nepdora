import { buildMarketingMetadata } from "@/lib/seo";
import QRGeneratorClient from "./qr-generator-client";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title: "Free Universal QR Code Generator | URL, WiFi, Payments & More",
  description:
    "Generate professional, high-quality QR codes for URLs, WiFi, emails, and payments (eSewa, Khalti, Fonepay). Customize with centers logos and brand colors.",
  path: "/tools/qr-code-generator",
  keywords: [
    "universal qr code generator",
    "free qr generator nepal",
    "qr code for website",
    "wifi qr code generator",
    "esewa qr generator",
    "khalti qr generator",
    "fonepay qr generator",
    "business qr code nepal",
  ],
});

export default function QRGeneratorPage() {
  return (
    <>
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Universal QR Code Generator",
          applicationCategory: "BusinessApplication",
          description:
            "Create high-quality, professional QR codes for URLs, WiFi networks, emails, and Nepali payment wallets (eSewa, Khalti, Fonepay) with custom branding.",
          url: "https://www.nepdora.com/tools/qr-code-generator",
          offers: { "@type": "Offer", price: "0" },
        }}
      />
      <QRGeneratorClient />
    </>
  );
}
