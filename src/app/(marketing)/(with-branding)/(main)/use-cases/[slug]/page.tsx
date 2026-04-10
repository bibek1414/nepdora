import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMarketingMetadata, absoluteUrl, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";
import {
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Zap,
  Globe,
  CreditCard,
  Smartphone,
  Users,
  TrendingUp,
  Clock,
  ShieldCheck,
  Heart,
  Star,
  Calendar,
  Clock as ClockIcon,
  Phone,
  MessageCircle,
  Video,
  FileText,
  BarChart3,
  Rocket,
  Award,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

const USE_CASES = [
  "social-media-to-storefront",
  "online-appointments",
  "high-volume-sales",
  "global-export",
  "creative-portfolios",
  "launch-campaigns",
  "website-for-small-business",
  "website-for-freelancers",
  "sell-products-online-nepal",
  "start-online-business-nepal",
];

export async function generateStaticParams() {
  return USE_CASES.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!USE_CASES.includes(slug)) {
    notFound();
  }
  const title = capitalizeWords(slug.replace(/-/g, " "));
  const description = `Discover how Nepdora helps with ${slug.replace(/-/g, " ")}. The best website builder for Nepali entrepreneurs and businesses.`;

  return buildMarketingMetadata({
    title: `${title} | Professional Solutions for Nepal`,
    description,
    path: `/use-cases/${slug}`,
  });
}

// Get dynamic content based on slug
const getUseCaseContent = (slug: string) => {
  const content: Record<string, any> = {
    "online-appointments": {
      title: "Online Appointment Booking System",
      subtitle:
        "Let clients book their own slots 24/7, perfect for clinics, salons, and consultancies",
      description:
        "Stop wasting hours on phone calls and manual scheduling. Nepdora's appointment booking system automates your entire booking workflow, allowing clients to book, reschedule, or cancel appointments anytime, anywhere.",
      problem:
        "Businesses lose up to 30% of potential clients due to missed calls and after-hours inquiries. Manual scheduling is time-consuming and error-prone.",
      solution:
        "Nepdora provides a fully automated booking system that works 24/7, integrates with your calendar, and sends automatic reminders to reduce no-shows.",
      benefits: [
        "Reduce no-shows with automated reminders",
        "Save 20+ hours per week on scheduling",
        "Accept deposits and payments at booking",
        "Manage multiple staff and locations",
        "Sync with Google Calendar automatically",
        "Get real-time booking notifications",
      ],
      features: [
        "Staff & resource management",
        "Time slot configuration",
        "Automated SMS/Email reminders",
        "Payment integration (eSewa/Khalti)",
        "Booking calendar view",
        "Recurring appointments",
        "Group booking support",
        "Waitlist management",
      ],
      stats: {
        growth: "200%",
        time: "1 week",
        satisfaction: "98%",
        reduction: "70%",
        dailyBookings: "100+",
      },
      industries: [
        "Clinics",
        "Salons",
        "Consultancies",
        "Fitness Centers",
        "Tutors",
        "Spa & Wellness",
      ],
      integrations: [
        "Google Calendar",
        "eSewa",
        "Khalti",
        "SMS Gateway",
        "Email",
      ],
      testimonial: {
        quote:
          "Since switching to Nepdora, our clinic has seen a 40% increase in bookings and zero no-shows. The automated reminders are a game-changer!",
        author: "Dr. Sarah Sharma",
        position: "Founder, Kathmandu Wellness Center",
      },
    },
    "social-media-to-storefront": {
      title: "Switch from Social Media to a Professional Storefront",
      subtitle:
        "Move beyond 'DM for price' and build a real e-commerce presence",
      description:
        "Running your business through Instagram DMs and Facebook comments is chaotic and unprofessional. Nepdora helps you build a proper online store that automates orders, inventory, and payments.",
      problem:
        "Managing orders manually leads to missed messages, lost sales, and unhappy customers. You deserve a proper storefront.",
      solution:
        "Get a complete e-commerce website with automated inventory, secure payments, and order tracking - all without coding.",
      benefits: [
        "Automated inventory management",
        "Professional product display",
        "Secure payment gateway integration",
        "Order tracking for customers",
        "Reduced manual work by 80%",
        "Build customer trust",
      ],
      features: [
        "Product catalog with variants",
        "Inventory auto-sync",
        "Order management dashboard",
        "Customer database",
        "Sales analytics",
        "Bulk product import",
      ],
      stats: {
        growth: "300%",
        time: "2 weeks",
        satisfaction: "95%",
        reduction: "85%",
        dailyBookings: "50+",
      },
      industries: [
        "Fashion",
        "Handicrafts",
        "Electronics",
        "Home Decor",
        "Gifts",
      ],
      integrations: [
        "eSewa",
        "Khalti",
        "Pathao",
        "Dash Logistics",
        "Facebook Shop",
      ],
      testimonial: {
        quote:
          "Moving from Instagram to Nepdora changed everything. Now I process 50+ orders daily without stress!",
        author: "Rita Thapa",
        position: "Owner, Urban Style",
      },
    },
    "sell-products-online-nepal": {
      title: "Sell Products Online in Nepal",
      subtitle:
        "Launch your e-commerce store with local payments and automated shipping",
      description:
        "Reach customers across Nepal with a professional online store that accepts local payments and automates delivery logistics.",
      problem:
        "Many Nepali businesses struggle to sell online due to lack of technical knowledge and payment integration challenges.",
      solution:
        "Nepdora makes selling online easy with built-in eSewa/Khalti payments, product management, and delivery partner integration.",
      benefits: [
        "Reach customers across Nepal",
        "Accept eSewa & Khalti payments",
        "Automated delivery tracking",
        "Inventory management",
        "Secure payment processing",
        "Customer accounts & order history",
      ],
      features: [
        "Product catalog with images",
        "Shopping cart & checkout",
        "Local payment gateways",
        "Order tracking dashboard",
        "Customer accounts",
        "Discount & coupon system",
      ],
      stats: {
        growth: "350%",
        time: "1 week",
        satisfaction: "97%",
        reduction: "75%",
        dailyBookings: "200+",
      },
      industries: [
        "Fashion",
        "Electronics",
        "Groceries",
        "Books",
        "Handicrafts",
      ],
      integrations: [
        "eSewa",
        "Khalti",
        "Pathao",
        "Dash Logistics",
        "ConnectIPS",
      ],
      testimonial: {
        quote:
          "My online sales tripled within the first month. Nepdora made it so easy to start selling!",
        author: "Suresh KC",
        position: "Owner, Tech Store Nepal",
      },
    },
    "website-for-small-business": {
      title: "Professional Website for Small Businesses",
      subtitle:
        "Establish your brand online with a website that builds trust and attracts customers",
      description:
        "Every small business needs a professional online presence. Nepdora helps you create a stunning website that showcases your products, services, and story.",
      problem:
        "Without a website, customers can't find you, trust you, or contact you easily. Social media alone isn't enough.",
      solution:
        "Get a complete business website with service pages, contact forms, Google Maps integration, and customer reviews.",
      benefits: [
        "Build customer trust instantly",
        "Showcase products & services",
        "24/7 online presence",
        "Local SEO ready",
        "Mobile responsive design",
        "Easy to update yourself",
      ],
      features: [
        "Business information pages",
        "Service listings with prices",
        "Contact forms with Google Maps",
        "Social media integration",
        "Customer review section",
        "Business hours display",
      ],
      stats: {
        growth: "180%",
        time: "2 days",
        satisfaction: "96%",
        reduction: "60%",
        dailyBookings: "30+",
      },
      industries: [
        "Retail",
        "Services",
        "Professional",
        "Hospitality",
        "Construction",
      ],
      integrations: [
        "Google Maps",
        "Facebook",
        "Instagram",
        "WhatsApp",
        "Email",
      ],
      testimonial: {
        quote:
          "My new website has brought in so many new customers. Best investment I've made for my business!",
        author: "Rajesh Shrestha",
        position: "Owner, Shrestha Electronics",
      },
    },
    "website-for-freelancers": {
      title: "Freelancer Portfolio Website",
      subtitle:
        "Showcase your skills, attract high-paying clients, and build your personal brand",
      description:
        "Stand out from the crowd with a professional portfolio that showcases your best work and attracts premium clients.",
      problem:
        "Freelancers struggle to find quality clients without a professional online presence to showcase their work.",
      solution:
        "Create a stunning portfolio with project galleries, client testimonials, and a contact form that converts visitors into clients.",
      benefits: [
        "Stand out from competitors",
        "Showcase past work beautifully",
        "Collect client testimonials",
        "Receive inquiries directly",
        "Build personal brand authority",
        "Charge higher rates",
      ],
      features: [
        "Portfolio galleries",
        "Skill & service pages",
        "Resume/CV download",
        "Contact form",
        "Blog for thought leadership",
        "Client login area",
      ],
      stats: {
        growth: "200%",
        time: "2 days",
        satisfaction: "98%",
        reduction: "70%",
        dailyBookings: "20+",
      },
      industries: [
        "Designers",
        "Developers",
        "Writers",
        "Photographers",
        "Consultants",
      ],
      integrations: ["Behance", "Dribbble", "GitHub", "LinkedIn", "Calendly"],
      testimonial: {
        quote:
          "My portfolio website helped me land 3 high-paying international clients. Worth every rupee!",
        author: "Anjali Gurung",
        position: "UI/UX Designer",
      },
    },
    "start-online-business-nepal": {
      title: "Start Your Online Business in Nepal",
      subtitle:
        "Everything you need to launch and grow your online business in one platform",
      description:
        "From idea to launch in days. Nepdora provides all the tools you need to start, run, and scale your online business successfully.",
      problem:
        "Starting an online business seems overwhelming with too many tools and technical requirements.",
      solution:
        "All-in-one platform with website builder, e-commerce tools, payment integration, and marketing features - no technical skills required.",
      benefits: [
        "Complete business toolkit",
        "No technical skills required",
        "Affordable pricing in NPR",
        "Local support team",
        "Scale as you grow",
        "Launch in days, not months",
      ],
      features: [
        "Website builder",
        "E-commerce tools",
        "Payment integration",
        "Marketing tools",
        "Analytics dashboard",
        "Email marketing",
      ],
      stats: {
        growth: "280%",
        time: "3 days",
        satisfaction: "95%",
        reduction: "80%",
        dailyBookings: "100+",
      },
      industries: [
        "E-commerce",
        "Services",
        "Digital Products",
        "Memberships",
        "Courses",
      ],
      integrations: [
        "eSewa",
        "Khalti",
        "Mailchimp",
        "Google Analytics",
        "Facebook Pixel",
      ],
      testimonial: {
        quote:
          "I launched my online store in just 3 days with Nepdora. Couldn't be happier!",
        author: "Bikash Thapa",
        position: "Founder, Himalayan Products",
      },
    },
  };

  return (
    content[slug] || {
      title: capitalizeWords(slug.replace(/-/g, " ")),
      subtitle: "Professional website solution for your business needs",
      description:
        "Create a professional website that helps you grow your business, attract customers, and achieve your goals online.",
      problem:
        "Many businesses struggle to establish a professional online presence that attracts and converts customers.",
      solution:
        "Nepdora provides an all-in-one platform to build, manage, and grow your website without any technical skills.",
      benefits: [
        "Mobile-responsive design",
        "Local payment integration",
        "SEO optimized for Nepal",
        "24/7 support",
        "Easy to manage",
        "Affordable pricing",
      ],
      features: [
        "Drag-and-drop builder",
        "Professional templates",
        "eSewa & Khalti ready",
        "Analytics dashboard",
        "Blog & content tools",
        "Contact forms",
      ],
      stats: {
        growth: "200%",
        time: "3 days",
        satisfaction: "96%",
        reduction: "65%",
        dailyBookings: "50+",
      },
      industries: [
        "Business",
        "Services",
        "Retail",
        "Professional",
        "Creative",
      ],
      integrations: ["eSewa", "Khalti", "Google Maps", "Facebook", "Instagram"],
      testimonial: {
        quote:
          "Nepdora made it so easy to get my business online. Highly recommended!",
        author: "Happy Customer",
        position: "Business Owner",
      },
    }
  );
};

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  if (!USE_CASES.includes(slug)) {
    notFound();
  }

  const content = getUseCaseContent(slug);
  const title = capitalizeWords(slug.replace(/-/g, " "));
  const url = absoluteUrl(`/use-cases/${slug}`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.title,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
    areaServed: {
      "@type": "Country",
      name: "Nepal",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="use-case-schema" data={schema} />

      {/* Navigation Breadcrumb */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-slate-400 hover:text-slate-600">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <Link
                href="/use-cases"
                className="text-slate-400 hover:text-slate-600"
              >
                Use Cases
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span className="font-medium text-slate-800">{title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                <Star className="h-3 w-3" />
                Use Case
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-5xl">
                {content.title}
              </h1>
              <p className="text-primary mb-4 text-lg font-medium">
                {content.subtitle}
              </p>
              <p className="mb-6 text-base leading-relaxed text-slate-500">
                {content.description}
              </p>

              {/* Quick Stats Row */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <div className="text-primary text-xl font-bold">
                    {content.stats.growth}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Revenue Growth
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <div className="text-primary text-xl font-bold">
                    {content.stats.time}
                  </div>
                  <div className="text-[10px] text-slate-500">Launch Time</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <div className="text-primary text-xl font-bold">
                    {content.stats.satisfaction}
                  </div>
                  <div className="text-[10px] text-slate-500">Satisfaction</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/create-website"
                  className="bg-primary /admin/signup-md inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
                >
                  Get Started Now
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Browse Templates
                </Link>
              </div>
            </div>

            {/* Right Content - Visual Cards */}
            <div className="space-y-4">
              {/* Problem Card */}
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-rose-700">
                      The Problem
                    </p>
                    <p className="text-xs text-rose-600">{content.problem}</p>
                  </div>
                </div>
              </div>

              {/* Solution Card */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-emerald-700">
                      The Solution
                    </p>
                    <p className="text-xs text-emerald-600">
                      {content.solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Benefits Preview */}
              <div className="grid grid-cols-2 gap-2">
                {content.benefits
                  .slice(0, 4)
                  .map((benefit: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-600"
                    >
                      <CheckCircle2 className="text-primary h-3 w-3" />
                      <span>{benefit.substring(0, 40)}...</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-8">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {content.stats.dailyBookings}
                </div>
                <div className="text-[10px] text-slate-500">Daily Bookings</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {content.stats.reduction}
                </div>
                <div className="text-[10px] text-slate-500">Time Saved</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-bold text-slate-900">24/7</div>
                <div className="text-[10px] text-slate-500">Availability</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-bold text-slate-900">100%</div>
                <div className="text-[10px] text-slate-500">Data Security</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the page remains the same... */}
      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Benefits */}
            <div className="/admin/signup-sm rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <Heart className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Key Benefits
                </h2>
              </div>
              <ul className="space-y-3">
                {content.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-sm text-slate-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="/admin/signup-sm rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Zap className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Features Included
                </h2>
              </div>
              <ul className="space-y-3">
                {content.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Perfect For</h2>
            <p className="mt-2 text-slate-500">
              Trusted by businesses across Nepal
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {content.industries.map((industry: string, idx: number) => (
              <span
                key={idx}
                className="/admin/signup-sm rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Native Integrations
            </h2>
            <p className="mt-2 text-slate-500">
              Seamlessly connect with your favorite tools
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {content.integrations.map((integration: string, idx: number) => (
              <span
                key={idx}
                className="bg-primary/5 text-primary border-primary/10 rounded-full border px-4 py-2 text-sm font-medium"
              >
                {integration}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="/admin/signup-sm rounded-2xl bg-white p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
            <p className="mb-4 text-lg text-slate-600 italic">
              "{content.testimonial.quote}"
            </p>
            <p className="font-semibold text-slate-900">
              {content.testimonial.author}
            </p>
            <p className="text-sm text-slate-500">
              {content.testimonial.position}
            </p>
          </div>
        </div>
      </section>

      {/* Why Nepdora Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
              Why Nepdora is the{" "}
              <span className="text-primary">Best Choice</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Built specifically for Nepali businesses and entrepreneurs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CreditCard,
                title: "Local Payments",
                desc: "eSewa & Khalti built-in",
              },
              {
                icon: Smartphone,
                title: "Mobile Ready",
                desc: "Optimized for Nepal's networks",
              },
              {
                icon: Users,
                title: "24/7 Support",
                desc: "Help in Nepali language",
              },
              { icon: Globe, title: "Local SEO", desc: "Rank higher in Nepal" },
            ].map((item, i) => (
              <div
                key={i}
                className="/admin/signup-sm rounded-2xl border border-slate-200 bg-white p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="/admin/signup-sm rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center">
            <div className="flex flex-col items-center">
              <div className="/admin/signup-sm mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <Rocket className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900">
                Ready to get started?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Join thousands of Nepali businesses already using Nepdora
              </p>
              <Link
                href="/create-website"
                className="bg-primary /admin/signup-md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
              >
                Start Building for Free
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Closing */}
      <section className="border-t border-slate-100 bg-white py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm leading-relaxed font-medium text-slate-500">
            Whether you're starting a small business, freelancing, or launching
            an e-commerce store, Nepdora provides the tools you need to succeed
            online in Nepal. Get started today with our free plan.
          </p>
        </div>
      </section>
    </div>
  );
}

// Helper components for icons not in lucide-react
function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function Lightbulb(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
