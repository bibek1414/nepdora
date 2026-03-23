import CapabilitiesSection from "@/components/marketing/features/capabilities-section";
import UseCases from "@/components/marketing/use-cases/use-cases";
import CTA from "@/components/marketing/cta-section/cta-section";
import { capitalizeWords } from "@/lib/string-utils";
import { INDUSTRY_CONTENT } from "@/constants/marketing-content";

interface CitiesLandingPageProps {
  category: string;
  city: string;
}

// MOCK LOCAL CONTEXT (In a real app, this would be from a local-business-db)
const LOCAL_CONTEXT: Record<string, string> = {
  kathmandu:
    "The bustling capital is competitive. Stand out in Kathmandu's digital marketplace.",
  pokhara:
    "Capture Pokhara's tourism and retail boom with a stunning online presence.",
  lalitpur:
    "Modernize your Lalitpur business for the tech-savvy local community.",
  biratnagar:
    "Dominate the industrial and trade hub of Biratnagar with a professional site.",
  butwal:
    "Connect with Butwal's growing consumer base through localized digital marketing.",
  bharatpur:
    "Enhance your reach in the heart of Chitwan's healthcare and education center.",
};

const INDUSTRY_SPECIFIC_HIGHLIGHTS: Record<
  string,
  { title: string; desc: string; icon: string }[]
> = {
  restaurant: [
    {
      title: "QR Digital Menu",
      desc: "No more paper menus. Let customers browse and order in seconds.",
      icon: "🍽️",
    },
    {
      title: "Online Reservations",
      desc: "Manage your table bookings and reduce empty seats.",
      icon: "📅",
    },
    {
      title: "Food Delivery Ready",
      desc: "Native Pathao and Foodmandu integration for your sales hub.",
      icon: "🛵",
    },
  ],
  ecommerce: [
    {
      title: "eSewa Integration",
      desc: "Accept payments from millions of wallet users in Nepal instantly.",
      icon: "💳",
    },
    {
      title: "Inventory Sync",
      desc: "Never oversell again with real-time stock tracking.",
      icon: "📦",
    },
    {
      title: "Automated Shipping",
      desc: "Print delivery labels and track packages inside your dashboard.",
      icon: "🚚",
    },
  ],
  clinic: [
    {
      title: "Patient Appointment Portal",
      desc: "Let patients book their checkups 24/7 without calling.",
      icon: "🩺",
    },
    {
      title: "Doctor Profiles",
      desc: "Showcase your medical expertise and build patient trust.",
      icon: "👨‍⚕️",
    },
    {
      title: "E-Health Records",
      desc: "Manage patient history and prescriptions securely online.",
      icon: "📋",
    },
  ],
  default: [
    {
      title: "AI Site Wizard",
      desc: "Get a professional site launched in under 10 minutes.",
      icon: "⚡",
    },
    {
      title: "Local SEO Ready",
      desc: "We handle the meta tags so you rank for local searches.",
      icon: "🔍",
    },
    {
      title: "Mobile First Design",
      desc: "Your site will look amazing on every smartphone in Nepal.",
      icon: "📱",
    },
  ],
};

const LOCALIZED_TESTIMONIALS: Record<
  string,
  { name: string; role: string; quote: string }[]
> = {
  kathmandu: [
    {
      name: "Suman Shrestha",
      role: "Business Owner in Koteshwor",
      quote:
        "Nepdora helped our KTM showroom reach customers across the valley.",
    },
  ],
  pokhara: [
    {
      name: "Maya Gurung",
      role: "Cafe Owner in Lakeside",
      quote:
        "The best tool for businesses in Pokhara to attract tourists and locals alike.",
    },
  ],
  default: [
    {
      name: "Happy Client",
      role: "Entreprenur",
      quote:
        "Launch faster and grow bigger with Nepal's first AI website builder.",
    },
  ],
};

export const CitiesLandingPage: React.FC<CitiesLandingPageProps> = ({
  category,
  city,
}) => {
  const cityName = capitalizeWords(city);
  const cityLower = city.toLowerCase();
  const localContext =
    LOCAL_CONTEXT[cityLower] ||
    `Grow your ${category.replace("-", " ")} business in ${cityName} with localized digital solutions.`;
  const dynamicHighlights =
    INDUSTRY_SPECIFIC_HIGHLIGHTS[category] ||
    INDUSTRY_SPECIFIC_HIGHLIGHTS.default;
  const testimonials =
    LOCALIZED_TESTIMONIALS[cityLower] || LOCALIZED_TESTIMONIALS.default;

  const content = INDUSTRY_CONTENT[category] || {
    title: `Best ${capitalizeWords(category.replace("-", " "))} in ${cityName}`,
    description: `Launch your professional ${category.toLowerCase()} in ${cityName} with Nepdora. The fastest, AI-powered way to grow your business online in Nepal.`,
    benefits: [
      `Localized SEO for ${cityName} searches`,
      "Mobile-first design for high performance",
      "Integrated Nepalese payment systems",
      "24/7 Local support and onboarding",
    ],
    features: [
      "AI-Powered Templates",
      "Drag-and-Drop Editor",
      "Local Hosting in Nepal",
      "Integrated CRM System",
    ],
    whyUs: `At Nepdora, we understand the unique business landscape of ${cityName}. Our platform provides the specific tools you need to succeed in the local ${cityName} market.`,
    heroImageAlt: `Empowering ${cityName} Businesses`,
  };

  return (
    <div className="flex flex-col">
      {/* Custom SEO Hero */}
      <section className="mx-auto max-w-7xl py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold">
            #1 Website Builder for {cityName}
          </span>
          <h1 className="mb-6 text-4xl font-bold text-slate-900 md:text-6xl lg:text-5xl">
            {content.title}{" "}
            <span className="text-primary truncate">in {cityName}</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 md:text-xl lg:text-2xl">
            {content.description} {localContext}
          </p>
        </div>
      </section>

      {/* Dynamic Industry Highlights (Anti-Thin Content) */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            Tailored for Your {capitalizeWords(category.replace("-", " "))} in{" "}
            {cityName}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {dynamicHighlights.map((h, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all hover:scale-105"
              >
                <div className="mb-6 text-4xl">{h.icon}</div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {h.title}
                </h3>
                <p className="text-slate-600">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">
                Why choose Nepdora for your{" "}
                {capitalizeWords(category.replace("-", " "))} in {cityName}?
              </h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>{content.whyUs}</p>
                <p>
                  We ensure your {category.replace("-", " ")} is fully optimized
                  for the {cityName} audience, with local payment gateways like
                  eSewa and Khalti built-in for {cityName}-based businesses.
                </p>
                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                  {content.benefits.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Visual Social Proof / Localized Testimonial */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-12 text-white shadow-2xl">
              <div className="relative z-10">
                <div className="bg-primary mb-8 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl">
                  "
                </div>
                <p className="mb-8 text-2xl leading-relaxed font-medium italic">
                  {testimonials[0].quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-primary flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-xl font-bold">
                    {testimonials[0].name[0]}
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {testimonials[0].name}
                    </div>
                    <div className="text-slate-400">{testimonials[0].role}</div>
                  </div>
                </div>
              </div>
              <div className="bg-primary/20 pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold text-slate-900 md:text-4xl">
            Key Features Included for {cityName} Businesses
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.features.map((feature, i) => (
              <div
                key={i}
                className="hover:border-primary/20 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-primary/5 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CapabilitiesSection />

      <UseCases />
      <CTA />
    </div>
  );
};
