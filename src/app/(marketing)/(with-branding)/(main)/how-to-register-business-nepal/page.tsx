import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import {
  ChevronRight,
  FileText,
  Landmark,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";

import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title:
    "How to Register a Business in Nepal (2026 Guide) | Company Registration Step-by-Step",
  description:
    "Learn how to register a company in Nepal step by step. Complete guide covering Office of Company Registrar, PAN/VAT registration, required documents, fees, and process explained simply.",
  path: "/how-to-register-business-nepal",
  ogTitle: "How to Register a Business in Nepal (2026 Guide)",
  ogSubtitle:
    "Step-by-step company registration, PAN/VAT process, and legal requirements in Nepal.",
});

export default function BusinessRegistrationPage() {
  const steps = [
    {
      title: "Name reservation",
      description:
        "Submit your proposed company name to the Office of Company Registrar (OCR) for approval.",
      icon: <ClipboardCheck className="h-6 w-6" />,
      details: "Check online at OCR portal for name availability.",
    },
    {
      title: "Document submission",
      description:
        "Prepare and submit your Memorandum of Association (MOA) and Articles of Association (AOA).",
      icon: <FileText className="h-6 w-6" />,
      details:
        "Requires specialized lawyer or consultant support for complex companies.",
    },
    {
      title: "Tax registration",
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

      <StandardMarketingHero
        badgeText="Founders guide"
        badgeIcon={Sparkles}
        title={
          <>
            Turn your idea into a{" "}
            <span className="text-sky-600">legal business</span> in Nepal.
          </>
        }
        description="A complete founder's guide to navigating the registration process, legal requirements, and tax compliance for Nepali startups."
        centered
      />

      {/* Steps Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-200">
                  {step.icon}
                </div>
                <div className="mb-2 text-xs font-bold tracking-tight text-sky-600">
                  Step 0{index + 1}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed font-medium text-slate-500">
                  {step.description}
                </p>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs font-medium text-slate-400">
                  {step.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Content */}
      <section className="border-t border-slate-100 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Why register your business?
            </h2>
            <div className="prose prose-slate prose-lg font-medium text-slate-600">
              <p>
                Operating as a registered entity in Nepal opens doors to several
                benefits:
              </p>
              <ul className="mb-8 list-disc space-y-2 pl-6">
                <li>Legal validity for contracts and partnerships.</li>
                <li>Access to bank loans and startup funding.</li>
                <li>Exclusive government subsidies and support programs.</li>
                <li>Protection of your business name and brand identity.</li>
              </ul>

              <h3 className="mt-12 mb-6 text-2xl font-bold text-slate-900">
                Documents you'll need
              </h3>
              <p>
                Before you begin the online or physical application, ensure you
                have the following ready:
              </p>
              <ul className="mb-8 list-disc space-y-2 pl-6">
                <li>Citizenship certificate of all promoters (founders).</li>
                <li>Proposed name and alternative options.</li>
                <li>Rental agreement for the office location.</li>
                <li>Passport-sized photos of promoters.</li>
              </ul>

              <h3 className="mt-12 mb-6 text-2xl font-bold text-slate-900">
                Post-registration checklist
              </h3>
              <p>
                Once your company is registered, the journey just begins. Your
                next steps are:
              </p>
              <ul className="mb-12 list-disc space-y-2 pl-6">
                <li>Opening a business bank account.</li>
                <li>PAN/VAT portal setup.</li>
                <li className="font-bold text-sky-600">
                  Setting up your online presence (Website & Email).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <StandardMarketingCTA
        title="Ready to take your business online?"
        description="Now that you've got the vision, build the professional image it deserves. Nepdora is the easiest way for new Nepali companies to get a high-performing website."
        buttonText="Build My Business Website"
        buttonHref="/pricing"
      />
    </div>
  );
}
