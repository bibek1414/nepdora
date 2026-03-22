import { Metadata } from "next";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = {
  title: "Become a Nepdora Partner | Join Our Agency Program in Nepal",
  description: "Partner with Nepal's #1 website builder. Agencies, freelancers, and consultants can earn commissions and grow their business with Nepdora.",
};

export default function PartnersPage() {
  return (
    <main className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8">
          Grow Your Business with the <span className="text-primary">Nepdora Partner</span> Program
        </h1>
        <p className="text-xl text-slate-600 mb-12">
            Join the ecosystem of creators building the future of the Nepalese internet.
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100">
                <h3 className="text-2xl font-bold mb-4">For Agencies</h3>
                <p className="text-slate-600">Build faster, deliver better results to your clients, and get dedicated support.</p>
            </div>
            <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100">
                <h3 className="text-2xl font-bold mb-4">For Affiliates</h3>
                <p className="text-slate-600">Earn recurring commissions for every business you bring online with Nepdora.</p>
            </div>
        </div>
      </div>
      <CTASection />
    </main>
  );
}
