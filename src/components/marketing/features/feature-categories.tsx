import {
  Layout,
  ShoppingBag,
  CreditCard,
  Search,
  BarChart3,
  Users,
  Check,
} from "lucide-react";

const categories = [
  {
    id: "website-builder",
    title: "Website Builder & Design",
    description:
      "Create a professional website in minutes - no coding required. Choose from 100+ industry-specific templates and customise every detail.",
    Icon: Layout,
    features: [
      "100+ professional templates",
      "Drag & drop visual editor",
      "Mobile-first responsive design",
      "Custom domain with free SSL",
      "AI website builder",
      "Built-in image & media library",
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce & Online Store",
    description:
      "Sell products, manage inventory, and process orders from one dashboard. From digital downloads to physical goods.",
    Icon: ShoppingBag,
    features: [
      "Unlimited product listings",
      "Discount codes & promotions",
      "Order management & tracking",
      "Digital products & downloads",
      "POS system for physical stores",
      "Inventory & stock alerts",
    ],
  },
  {
    id: "payments",
    title: "Payments - Nepal & International",
    description:
      "Accept payments the way your customers prefer. eSewa, Khalti, and Fonepay for Nepal - Stripe and PayPal for global sales.",
    Icon: CreditCard,
    features: [
      "eSewa integration",
      "Khalti integration",
      "Fonepay & ConnectIPS",
      "Stripe & PayPal (international)",
      "Secure encrypted transactions",
      "Payment history & reports",
    ],
  },
  {
    id: "seo-marketing",
    title: "SEO & Digital Marketing",
    description:
      "Rank higher on Google without hiring an agency. Nepdora auto-generates meta tags, schema markup, and XML sitemaps.",
    Icon: Search,
    features: [
      "Auto meta tags & Open Graph",
      "XML sitemap generation",
      "Schema / JSON-LD markup",
      "Core Web Vitals optimisation",
      "Blog & content management",
      "Social media link integration",
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Reporting",
    description:
      "Understand your visitors, track revenue, and make data-driven decisions with real-time dashboards in your admin panel.",
    Icon: BarChart3,
    features: [
      "Real-time traffic analytics",
      "Revenue & sales reports",
      "Visitor demographics",
      "Best-selling products report",
      "Traffic source breakdown",
      "Conversion rate tracking",
    ],
  },
  {
    id: "business-ops",
    title: "Business Operations",
    description:
      "Manage customers, send SMS updates, track logistics, and run your entire business from a single easy-to-use dashboard.",
    Icon: Users,
    features: [
      "Mini CRM & customer database",
      "SMS notifications & alerts",
      "Logistics & delivery integration",
      "Appointment & booking system",
      "Invoice & receipt generation",
      "Inquiry & lead management",
    ],
  },
];

export default function FeatureCategories() {
  return (
    <section className="border-t border-slate-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            One platform. Every tool your business needs.
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            From your first website to scaling sales across Nepal and beyond -
            everything ships in one subscription.
          </p>
        </div>

        <div className="grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => (
            <article key={category.id} className="flex flex-col bg-white p-8">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
                <category.Icon className="h-4 w-4 text-slate-700" />
              </div>

              <h3 className="mb-2 text-base font-semibold text-slate-900">
                {category.title}
              </h3>

              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                {category.description}
              </p>

              <ul className="mt-auto space-y-2.5">
                {category.features.map(label => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 text-sm text-slate-700"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    {label}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
