import { Metadata } from "next";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = {
  title: "Accept eSewa & Khalti Payments Online in Nepal | One-Click Setup",
  description:
    "Integrate eSewa, Khalti, IME Pay, and ConnectIPS into your website instantly. No coding required with Nepdora's payment solution.",
};

export default function AcceptPaymentsSolution() {
  return (
    <main className="bg-white py-16 md:py-24">
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
