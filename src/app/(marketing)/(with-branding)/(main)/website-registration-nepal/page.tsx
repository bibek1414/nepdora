import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = {
  title: "Website Registration & Legal Compliance in Nepal | Business Guide",
  description:
    "How to legally register your website and online business in Nepal. Guide on PAN/VAT, company registration, and Department of Commerce requirements.",
  metadataBase: new URL(absoluteUrl()),
  alternates: {
    canonical: absoluteUrl("/website-registration-nepal"),
  },
  openGraph: {
    title: "Website Registration & Legal Compliance in Nepal | Business Guide",
    description:
      "How to legally register your website and online business in Nepal. Guide on PAN/VAT, company registration, and Department of Commerce requirements.",
    url: absoluteUrl("/website-registration-nepal"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Website Registration & Legal Compliance in Nepal",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Registration & Legal Compliance in Nepal | Nepdora",
    description:
      "How to legally register your website and online business in Nepal. Guide on PAN/VAT, company registration, and Department of Commerce requirements.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RegistrationPage() {
  return (
    <main className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight md:text-6xl">
          Registering Your <span className="text-primary">Online Business</span>{" "}
          in Nepal
        </h1>
        <div className="prose prose-slate prose-lg lg:prose-xl max-w-none">
          <p className="lead">
            Starting an online business in Nepal involves more than just
            building a website. You need to ensure legal compliance to avoid
            penalties.
          </p>
          <h3>1. PAN and VAT Registration</h3>
          <p>
            Every business must be registered with the Inland Revenue Department
            (IRD). Depending on your turnover, you might need a PAN or a VAT
            certificate.
          </p>
          <h3>2. Department of Commerce</h3>
          <p>
            E-commerce businesses are required to register with the Department
            of Commerce, Supplies and Consumer Protection.
          </p>
          <div className="bg-primary/5 border-primary/10 my-10 rounded-3xl border p-8 text-slate-800">
            <h4 className="mb-2 font-bold">Pro Tip:</h4>
            <p>
              Nepdora partners with legal experts to help our users navigate the
              registration process easily.
            </p>
          </div>
        </div>
      </div>
      <CTASection />
    </main>
  );
}
