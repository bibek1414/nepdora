import { Metadata } from "next";
import Hero from "@/components/marketing/hero-section/hero-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Create a Website in Nepal in 5 Minutes | Step-by-Step Guide | ${SITE_NAME}`,
  description: `Want to create a website in Nepal? ${SITE_NAME} makes it easy. From choosing a template to connecting eSewa, learn how to build your site in minutes.`,
  keywords: [
    "create website nepal",
    "how to build website in nepal",
    "website creation nepal",
    "nepal website maker",
    SITE_NAME,
  ],
  metadataBase: new URL(absoluteUrl()),
  alternates: {
    canonical: absoluteUrl("/create-website"),
  },
  openGraph: {
    title: `Create a Website in Nepal in 5 Minutes | Step-by-Step Guide | ${SITE_NAME}`,
    description: `Want to create a website in Nepal? ${SITE_NAME} makes it easy. From choosing a template to connecting eSewa, learn how to build your site in minutes.`,
    url: absoluteUrl("/create-website"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Create a Website in Nepal`,
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Create a Website in Nepal in 5 Minutes | Step-by-Step Guide | ${SITE_NAME}`,
    description: `Build your website in Nepal in minutes with ${SITE_NAME}.`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function CreateWebsite() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Create a Website in Nepal with ${SITE_NAME}`,
    description: `A step-by-step guide to launching your website in Nepal using ${SITE_NAME}.`,
    step: [
      {
        "@type": "HowToStep",
        name: "Choose a Template",
        text: "Select from over 100+ professionally designed templates tailored for Nepali businesses.",
      },
      {
        "@type": "HowToStep",
        name: "Customize Your Design",
        text: "Use our drag-and-drop builder to add your content, images, and branding.",
      },
      {
        "@type": "HowToStep",
        name: "Connect Local Payments",
        text: "Activate eSewa and Khalti with one click to start accepting payments.",
      },
      {
        "@type": "HowToStep",
        name: "Launch Your Site",
        text: "Connect your custom .com.np or .com domain and go live instantly.",
      },
    ],
  };

  return (
    <main>
      <JsonLd id="howto-schema" data={schema} />
      <Hero />
      <div className="mx-auto max-w-6xl  px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">
          How to Create Your Website in Nepal
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="text-primary mb-4 text-3xl font-bold">01</div>
            <h3 className="mb-3 text-xl font-bold">Pick Your Niche</h3>
            <p className="text-slate-600">
              Select whether you need an e-commerce store, a restaurant menu, or
              a portfolio site.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="text-primary mb-4 text-3xl font-bold">02</div>
            <h3 className="mb-3 text-xl font-bold">Customize</h3>
            <p className="text-slate-600">
              Drag and drop sections, add your products, and tell your business
              story.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="text-primary mb-4 text-3xl font-bold">03</div>
            <h3 className="mb-3 text-xl font-bold">Connect Payments</h3>
            <p className="text-slate-600">
              Add eSewa, Khalti, or Bank Transfer to start selling across Nepal.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="text-primary mb-4 text-3xl font-bold">04</div>
            <h3 className="mb-3 text-xl font-bold">Go Live</h3>
            <p className="text-slate-600">
              Hit publish and share your new professional website with the
              world.
            </p>
          </div>
        </div>
      </div>
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
