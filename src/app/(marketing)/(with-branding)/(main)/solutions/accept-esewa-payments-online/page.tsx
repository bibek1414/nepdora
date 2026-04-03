import { Metadata } from "next";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Accept eSewa & Khalti Payments Online in Nepal | One-Click Setup",
  description:
    "Integrate eSewa, Khalti, IME Pay, and ConnectIPS into your website instantly. No coding required with Nepdora's payment solution.",
  metadataBase: new URL(absoluteUrl()),
  alternates: {
    canonical: absoluteUrl("/solutions/accept-esewa-payments-online"),
  },
  openGraph: {
    title: "Accept eSewa & Khalti Payments Online in Nepal | One-Click Setup",
    description:
      "Integrate eSewa, Khalti, IME Pay, and ConnectIPS into your website instantly. No coding required with Nepdora's payment solution.",
    url: absoluteUrl("/solutions/accept-esewa-payments-online"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Accept eSewa & Khalti Payments Online in Nepal",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accept eSewa & Khalti Payments Online in Nepal | Nepdora",
    description:
      "Integrate eSewa, Khalti, and more into your website instantly with Nepdora.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const solutionSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Online Payment Integration Nepal",
  description:
    "Native integration for eSewa, Khalti, and major wallets for websites in Nepal.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
};

export default function AcceptPaymentsSolution() {
  return (
    <main className="bg-white py-16 md:py-24">
      <JsonLd id="payment-solution-schema" data={solutionSchema} />
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-extrabold md:text-6xl">
          Accept <span className="text-[#60BB46]">eSewa</span> &{" "}
          <span className="text-[#5C2D91]">Khalti</span> Hassle-Free
        </h1>
        <div className="prose prose-slate lg:prose-xl">
          <p>
            Selling products online in Nepal shouldn't be hard. Our platform
            comes with pre-integrated payment gateways so you can start making
            money from day one.
          </p>
          <h2>Supported Proxies</h2>
          <ul>
            <li>eSewa Mobile Wallet</li>
            <li>Khalti Payment Gateway</li>
            <li>IME Pay</li>
            <li>ConnectIPS (Bank Transfers)</li>
            <li>Fonepay QR</li>
          </ul>
        </div>
      </div>
      <CTASection />
    </main>
  );
}
