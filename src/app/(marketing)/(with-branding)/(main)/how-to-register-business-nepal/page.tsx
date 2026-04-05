import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  Landmark,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title: "How to Register a Business in Nepal (2026 Guide) | Step-by-Step",
  description:
    "A comprehensive step-by-step guide on how to register a company in Nepal. Company registration process, documents required, and tax (PAN/VAT) registration.",
  path: "/how-to-register-business-nepal",
  ogTitle: "Starting a Business in Nepal: The Complete Registration Guide",
  ogSubtitle:
    "From Office of Company Registrar to PAN/VAT registration. Everything you need.",
});

export default function BusinessRegistrationPage() {
  const steps = [
    {
      title: "Name Reservation",
      description:
        "Submit your proposed company name to the Office of Company Registrar (OCR) for approval.",
      icon: <ClipboardCheck className="h-6 w-6" />,
      details: "Check online at OCR portal for name availability.",
    },
    {
      title: "Document Submission",
      description:
        "Prepare and submit your Memorandum of Association (MOA) and Articles of Association (AOA).",
      icon: <FileText className="h-6 w-6" />,
      details:
        "Requires specialized lawyer or consultant support for complex companies.",
    },
    {
      title: "Tax Registration",
      description:
        "Obtain your Permanent Account Number (PAN) or Value Added Tax (VAT) from the Inland Revenue Department.",
      icon: <Landmark className="h-6 w-6" />,
      details: "Essential for legal financial transactions and invoicing.",
    },
    {
      title: "Local registration",
      description:
        "Register with your local ward office and industry-specific departments if needed.",
      icon: <ClipboardCheck className="h-6 w-6" />,
      details: "Required for municipal compliance and business permits.",
    },
  ];

  const registrationSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Register a Business in Nepal",
    description: "Step-by-step process of company registration in Nepal.",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="registration-schema" data={registrationSchema} />

      {/* Hero */}
      <section className="bg-linear-to-br from-slate-900 to-slate-800 py-16 text-white md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              Turn Your Idea into a{" "}
              <span className="text-blue-400">Legal Business</span> in Nepal
            </h1>
            <p className="text-xl text-slate-400">
              A complete founder's guide to navigating the registration process,
              legal requirements, and tax compliance for Nepali startups.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  {step.icon}
                </div>
                <div className="mb-2 text-sm font-bold tracking-wider text-blue-600 uppercase">
                  Step 0{index + 1}
                </div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="mb-4 text-sm text-slate-600">
                  {step.description}
                </p>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500 italic">
                  {step.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Content */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">
              Why Register Your Business?
            </h2>
            <div className="prose prose-slate prose-lg text-slate-600">
              <p>
                Operating as a registered entity in Nepal opens doors to several
                benefits:
              </p>
              <ul className="mb-8 list-disc pl-6">
                <li>Legal validity for contracts and partnerships.</li>
                <li>Access to bank loans and startup funding.</li>
                <li>Exclusive government subsidies and support programs.</li>
                <li>Protection of your business name and brand identity.</li>
              </ul>

              <h3 className="mt-12 mb-6 text-2xl font-bold text-slate-900">
                Documents You'll Need
              </h3>
              <p>
                Before you begin the online or physical application, ensure you
                have the following ready:
              </p>
              <ul className="mb-8 list-disc pl-6">
                <li>Citizenship certificate of all promoters (founders).</li>
                <li>Proposed name and alternative options.</li>
                <li>Rental agreement for the office location.</li>
                <li>Passport-sized photos of promoters.</li>
              </ul>

              <h3 className="mt-12 mb-6 text-2xl font-bold text-slate-900">
                Post-Registration Checklist
              </h3>
              <p>
                Once your company is registered, the journey just begins. Your
                next steps are:
              </p>
              <ul className="mb-12 list-disc pl-6">
                <li>Opening a business bank account.</li>
                <li>PAN/VAT portal setup.</li>
                <li className="font-bold text-blue-600 underline">
                  Setting up your online presence (Website & Email).
                </li>
              </ul>
            </div>

            {/* Bottom CTA Card */}
            <div className="rounded-3xl bg-blue-600 p-8 text-white md:px-12 md:py-16">
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex-1">
                  <h3 className="mb-4 text-3xl font-bold">
                    Ready to take your business online?
                  </h3>
                  <p className="mb-8 text-blue-100">
                    Now that you've got the vision, build the professional image
                    it deserves. Nepdora is the easiest way for new Nepali
                    companies to get a high-performing website.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-blue-600 transition-all hover:bg-blue-50"
                  >
                    Start Building Free <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-blue-500/50">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
