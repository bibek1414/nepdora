import { Metadata } from "next";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = {
  title: "Become a Nepdora Partner | Join Our Agency Program in Nepal",
  description:
    "Partner with Nepal's #1 website builder. Agencies, freelancers, and consultants can earn commissions and grow their business with Nepdora.",
};

export default function PartnersPage() {
  return (
    <main className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-8 text-4xl font-extrabold md:text-6xl">
          Grow Your Business with the{" "}
          <span className="text-primary">Nepdora Partner</span> Program
        </h1>
        <p className="mb-12 text-xl text-slate-600">
          Join the ecosystem of creators building the future of the Nepalese
          internet.
        </p>
        <div className="grid gap-8 text-left md:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-10">
            <h3 className="mb-4 text-2xl font-bold">For Agencies</h3>
            <p className="text-slate-600">
              Build faster, deliver better results to your clients, and get
              dedicated support.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-10">
            <h3 className="mb-4 text-2xl font-bold">For Affiliates</h3>
            <p className="text-slate-600">
              Earn recurring commissions for every business you bring online
              with Nepdora.
            </p>
          </div>
        </div>
      </div>
      <CTASection />
    </main>
  );
}
