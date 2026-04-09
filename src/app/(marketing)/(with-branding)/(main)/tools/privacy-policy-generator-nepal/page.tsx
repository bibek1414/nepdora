import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  Scale,
  Lock,
  Users,
  ChevronRight,
  Clock,
  Globe,
  Smartphone,
  Zap,
  Award,
  Heart,
} from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Privacy Policy Generator for Nepali Websites | Free Tool",
  description:
    "Generate a legally compliant Privacy Policy for your Nepali business in seconds. Tailored for Nepal's IT and privacy laws.",
  path: "/tools/privacy-policy-generator-nepal",
  noIndex: true,
  keywords: [
    "privacy policy generator nepal",
    "legal policy nepal",
    "nepal it laws compliance",
  ],
});

export default function PrivacyPolicyGenerator() {
  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Privacy Policy Generator Nepal",
          provider: {
            "@type": "Organization",
            name: "Nepdora",
          },
        }}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-block rounded-full px-4 py-1 text-sm font-medium">
              Free Legal Tool
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Free Privacy Policy Generator for{" "}
              <span className="text-primary">Nepal</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Ensure your business website is compliant with local regulations.
              Generate a professional privacy policy in just a few clicks.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center -sm">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Clock className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-amber-800">
                Coming Soon
              </h2>
              <p className="mb-4 max-w-md text-amber-700">
                We are currently updating our policy templates to reflect the
                latest IT regulations in Nepal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Privacy Policy Matters */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why does your Nepali website need a{" "}
              <span className="text-primary">Privacy Policy?</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              With the rise of e-commerce and digital payments in Nepal,
              protecting customer data is not just a legal requirement but a key
              component of building trust.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Legal Compliance",
                desc: "Comply with Nepal's IT laws and data protection regulations.",
              },
              {
                icon: Users,
                title: "Build Customer Trust",
                desc: "Show visitors you take their privacy and data seriously.",
              },
              {
                icon: Scale,
                title: "Avoid Penalties",
                desc: "Protect your business from potential legal issues.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 -sm transition-all hover:-md"
              >
                <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Generator Covers */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              What our{" "}
              <span className="text-primary">Privacy Policy Generator</span>{" "}
              covers
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Get a comprehensive policy tailored for Nepali businesses
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "What information we collect (personal, payment, usage data)",
              "How we use your information (eSewa, Khalti, analytics)",
              "Data storage and security practices (local & cloud)",
              "Cookies and tracking technologies",
              "Third-party services (logistics, payment gateways)",
              "User rights (access, correction, deletion)",
              "Children's privacy policy",
              "Changes to privacy policy notification",
              "Contact information for privacy concerns",
              "Nepal-specific legal compliance clauses",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-white p-4 -sm"
              >
                <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Needs This */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Who needs a <span className="text-primary">Privacy Policy?</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              If your website collects any user data, you need a privacy policy
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Globe,
                title: "E-commerce Stores",
                desc: "Selling products online",
              },
              {
                icon: Users,
                title: "Service Businesses",
                desc: "Booking & consultation",
              },
              {
                icon: Smartphone,
                title: "Mobile Apps",
                desc: "Collecting user data",
              },
              {
                icon: FileText,
                title: "Blogs & Media",
                desc: "With comments/forms",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center -sm transition-all hover:-md"
              >
                <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nepal-Specific Compliance */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Nepal-specific{" "}
                <span className="text-primary">legal compliance</span>
              </h2>
              <p className="mb-6 text-lg font-medium text-slate-500">
                Our generator takes into account the unique legal landscape of
                Nepal, including:
              </p>
              <ul className="space-y-3">
                {[
                  "Electronic Transaction Act (ETA) 2063",
                  "IT Policy 2072",
                  "Personal Data Protection guidelines",
                  "eSewa and Khalti payment regulations",
                  "Consumer protection laws",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold text-slate-900">
                100% Nepal Compliant
              </h3>
              <p className="text-center text-sm font-medium text-slate-500">
                Our templates are reviewed by legal experts familiar with
                Nepal's regulatory environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps to Generate */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How to generate your{" "}
              <span className="text-primary">Privacy Policy</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Simple steps to get your compliant policy in minutes
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Enter Business Details",
                desc: "Provide your business name, website URL, and contact info.",
              },
              {
                step: "2",
                title: "Select Data Collection Types",
                desc: "Choose what data you collect (payments, emails, etc.).",
              },
              {
                step: "3",
                title: "Generate & Download",
                desc: "Get your customized privacy policy instantly.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center -sm"
              >
                <div className="bg-primary absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold text-white -md">
                  {item.step}
                </div>
                <div className="mt-6">
                  <h3 className="mb-2 font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mx-auto mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is a privacy policy legally required in Nepal?",
                a: "Yes, if you collect any personal data from users (names, emails, payment info), having a privacy policy is recommended under Nepal's Electronic Transaction Act.",
              },
              {
                q: "Is this generator free to use?",
                a: "Yes, our privacy policy generator is completely free for Nepali businesses using Nepdora.",
              },
              {
                q: "How often should I update my privacy policy?",
                a: "You should update your privacy policy whenever you change how you collect or process user data, add new features, or as laws change.",
              },
              {
                q: "Does this cover eSewa and Khalti payments?",
                a: "Yes, our template includes specific clauses for local payment gateways like eSewa and Khalti.",
              },
              {
                q: "Can I customize the generated policy?",
                a: "Yes, you can edit and customize the policy after generation to fit your specific business needs.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 -sm transition-all hover:-md"
              >
                <h3 className="mb-2 font-semibold text-slate-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center -sm">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white -sm">
                <Heart className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Get your free Privacy Policy today
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Protect your business and build customer trust with a
                professionally generated privacy policy.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white -md transition-all hover:scale-105">
                  Get Notified When Live
                  <ChevronRight className="h-4 w-4" />
                </button>
                <Link
                  href="/create-website"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Build Your Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="border-t border-slate-100 bg-white py-8">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-medium text-slate-400">
            Disclaimer: This tool provides a template privacy policy and does
            not constitute legal advice. We recommend consulting with a legal
            professional for your specific business needs.
          </p>
        </div>
      </section>
    </div>
  );
}
