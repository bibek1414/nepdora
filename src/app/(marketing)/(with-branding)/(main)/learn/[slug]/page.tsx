import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";
import { CheckCircle2, ChevronRight, Clock, BookOpen } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/seo";
import CityCTA from "@/components/marketing/cta-section/cta-section";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const LEARN_GUIDES = [
  "how-to-start-online-business-in-nepal",
  "register-company-in-nepal-online",
  "pan-vs-vat-for-online-shops-nepal",
  "best-payment-gateways-nepal",
  "seo-guide-for-nepali-businesses",
];

export async function generateStaticParams() {
  return LEARN_GUIDES.map(slug => ({ slug }));
}

// Guide content mapping
const GUIDE_CONTENT: Record<
  string,
  {
    intro: string;
    sections: Array<{ title: string; content: string }>;
    whatYouLearn: string[];
    proTip?: string;
  }
> = {
  "how-to-start-online-business-in-nepal": {
    intro:
      "Starting an online business in Nepal is one of the best opportunities today for entrepreneurs, students, and small business owners. With the rapid growth of internet users and digital payment systems, more people are shopping, learning, and interacting online than ever before. This shift has made it possible to start a business with low investment and reach customers across the entire country, not just in your local area.",
    sections: [
      {
        title: "Choose the right business idea",
        content:
          "The first step to starting an online business in Nepal is choosing the right idea. This could be anything from selling physical products like clothes or electronics, to offering services such as design, marketing, or freelancing. It's important to understand your target audience and identify a real problem you can solve. Businesses that focus on clear value and customer needs tend to grow faster and build long-term trust.",
      },
      {
        title: "Handle the legal side",
        content:
          "Once you have your idea, the next step is handling the legal side of your business. In Nepal, most online businesses start with a PAN registration, while larger operations may require VAT registration. If you plan to scale, registering a company can also be beneficial. Following proper legal steps not only keeps your business compliant but also builds credibility with customers and payment partners.",
      },
      {
        title: "Create a strong online presence",
        content:
          "After that, you need a strong online presence. This usually means creating a website or an online store where customers can explore your products or services. While social media platforms like Facebook and Instagram are useful for marketing, having your own website gives you full control over your brand, customer experience, and sales process. A professional website also increases trust and makes your business look more reliable.",
      },
      {
        title: "Set up payment integration",
        content:
          "One of the most important parts of any online business in Nepal is accepting payments. Customers prefer simple and trusted payment options, so integrating digital wallets like eSewa and Khalti is essential. These platforms allow users to pay instantly using their mobile phones, making the checkout process smooth and convenient. Offering multiple payment options can significantly increase your conversion rate.",
      },
      {
        title: "Focus on marketing",
        content:
          "Marketing plays a huge role in growing your online business. You can start with organic methods like content creation, SEO, and social media posts, and later expand into paid ads. Understanding how to communicate your value clearly and consistently will help you attract and retain customers. Building a strong brand presence is what separates successful businesses from the rest.",
      },
      {
        title: "Stay consistent and think long-term",
        content:
          "Finally, focus on consistency and long-term growth. Many businesses fail because they expect quick results. Instead, you should continuously improve your products, listen to customer feedback, and optimize your operations. Over time, small improvements can lead to significant growth and a sustainable online business.",
      },
    ],
    whatYouLearn: [
      "Steps to launch your online business",
      "Legal requirements in Nepal",
      "Payment integration basics",
      "Growth strategies",
    ],
    proTip:
      "Start small but think big. Test your idea with a minimal setup first, then scale based on real customer feedback.",
  },
  "register-company-in-nepal-online": {
    intro:
      "Starting a company in Nepal is an important step for anyone looking to build a serious and scalable business. While many entrepreneurs begin informally, registering your company gives you legal recognition, builds trust, and allows you to access banking, payment gateways, and partnerships more easily. Today, the process has become more streamlined, making it possible to handle much of it online.",
    sections: [
      {
        title: "Choose the right business structure",
        content:
          "The first step is choosing the right business structure. In Nepal, the most common option is a Private Limited Company, especially for startups and online businesses. This structure provides limited liability, meaning your personal assets are protected, and it also makes it easier to grow and attract investment in the future.",
      },
      {
        title: "Register your company name",
        content:
          "Once you decide on the structure, you need to register your company name through the Office of the Company Registrar (OCR). The name must be unique and not similar to existing businesses. After approval, you proceed with submitting documents like citizenship copies of shareholders, company objectives, and share structure details.",
      },
      {
        title: "Obtain PAN or VAT registration",
        content:
          "After company registration, the next step is obtaining a PAN (Permanent Account Number) or VAT registration from the Inland Revenue Department. This is required for taxation and financial transactions. If your business deals with higher revenue or taxable goods/services, VAT registration becomes necessary.",
      },
      {
        title: "Open a company bank account",
        content:
          "You will also need to open a company bank account and deposit the initial capital. This step officially activates your company operations. From there, you can start building your online presence, integrating payment gateways, and launching your services.",
      },
    ],
    whatYouLearn: [
      "Company registration process",
      "Required documents",
      "PAN/VAT setup",
      "Business activation steps",
    ],
    proTip:
      "Consult with a local legal expert or accountant to ensure all documents are correctly prepared before submission.",
  },
  "pan-vs-vat-for-online-shops-nepal": {
    intro:
      "If you are starting an online business in Nepal, one of the most common questions is whether you need a PAN or VAT registration. Understanding the difference between the two is important because it directly affects how you manage taxes, pricing, and compliance.",
    sections: [
      {
        title: "What is PAN?",
        content:
          "A PAN (Permanent Account Number) is the basic requirement for any business or individual earning income in Nepal. It is simple to obtain and is suitable for small businesses, freelancers, and early-stage online stores. If your business is just starting and your revenue is relatively low, a PAN is usually enough to operate legally.",
      },
      {
        title: "What is VAT?",
        content:
          "On the other hand, VAT (Value Added Tax) is required for businesses that cross a certain revenue threshold or deal with taxable goods and services. VAT-registered businesses must charge 13% tax on their products or services and file regular tax returns. While this adds complexity, it also allows you to work with larger companies and claim tax credits.",
      },
      {
        title: "Which one should you choose?",
        content:
          "For most online shops, the decision depends on scale. If you are testing your idea or running a small operation, starting with PAN is the simplest option. As your business grows and revenue increases, transitioning to VAT becomes necessary and beneficial.",
      },
    ],
    whatYouLearn: [
      "PAN vs VAT differences",
      "When to choose each",
      "Legal implications",
      "Business scaling impact",
    ],
    proTip:
      "Keep accurate financial records from day one. This will make tax filing much easier whether you're on PAN or VAT.",
  },
  "best-payment-gateways-nepal": {
    intro:
      "Choosing the right payment gateway is one of the most critical decisions for any online business in Nepal. A smooth and secure payment experience directly impacts customer trust, conversion rates, and overall business growth. Fortunately, Nepal has several reliable digital payment solutions that make online transactions easy.",
    sections: [
      {
        title: "Digital wallets: eSewa and Khalti",
        content:
          "Among the most popular options are eSewa and Khalti, both of which have millions of users across the country. These wallets allow customers to pay instantly using their mobile devices, making them ideal for eCommerce, service platforms, and subscription-based businesses. Their wide adoption means customers are already familiar with the payment process.",
      },
      {
        title: "E-banking and card payments",
        content:
          "In addition to wallets, many gateways also support e-banking and card payments, including SCT and Visa. This ensures that businesses can cater to a broader audience, including users who prefer bank transfers or debit/credit cards. Offering multiple payment options significantly improves checkout success rates.",
      },
      {
        title: "How to choose the right gateway",
        content:
          "When choosing a payment gateway, you should consider factors like ease of integration, transaction fees, settlement time, and user experience. Some platforms require complex setup processes, while others provide simple, ready-to-use integrations that can be activated quickly.",
      },
    ],
    whatYouLearn: [
      "Popular gateways in Nepal",
      "Wallet vs bank payments",
      "Integration factors",
      "Choosing the right solution",
    ],
    proTip:
      "Start with one or two payment gateways initially, then add more as your customer base grows and requests different options.",
  },
  "seo-guide-for-nepali-businesses": {
    intro:
      "Search Engine Optimization (SEO) is one of the most powerful ways to grow an online business in Nepal without relying heavily on paid ads. It helps your website appear on search engines like Google when potential customers are looking for your products or services.",
    sections: [
      {
        title: "Start with keyword research",
        content:
          "The foundation of SEO starts with understanding what your customers are searching for. This involves keyword research, where you identify terms related to your business. For example, if you sell clothing, people might search for 'buy clothes online in Nepal' or 'best fashion store Kathmandu.' Targeting these keywords helps you attract relevant traffic.",
      },
      {
        title: "Optimize your on-page content",
        content:
          "On-page SEO is the next step, which includes optimizing your website content, titles, headings, and images. Your content should be clear, helpful, and focused on solving user problems. A well-structured website not only ranks better but also provides a better experience for visitors.",
      },
      {
        title: "Don't ignore technical SEO",
        content:
          "Technical SEO is also important. This includes website speed, mobile responsiveness, and proper indexing. Since most users in Nepal access websites through mobile devices, having a fast and mobile-friendly site is essential for both rankings and user satisfaction.",
      },
      {
        title: "Be consistent and patient",
        content:
          "Finally, consistency is key. SEO is not a one-time task but an ongoing process. By regularly publishing valuable content, improving your website, and building trust, you can achieve long-term visibility and steady growth without depending entirely on advertisements.",
      },
    ],
    whatYouLearn: [
      "Keyword research basics",
      "On-page SEO",
      "Technical SEO essentials",
      "Long-term growth strategy",
    ],
    proTip:
      "Focus on local SEO by including location-based keywords like 'in Kathmandu' or 'in Nepal' to attract nearby customers.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!LEARN_GUIDES.includes(slug)) {
    notFound();
  }
  const title = `${capitalizeWords(slug.replace(/-/g, " "))} | Guide for Nepal`;
  const description = `Read our comprehensive guide on ${slug.replace(/-/g, " ")}. Essential knowledge for business owners and entrepreneurs in Nepal.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/learn/${slug}`,
  });
}

export default async function LearnPage({ params }: Props) {
  const { slug } = await params;
  if (!LEARN_GUIDES.includes(slug)) {
    notFound();
  }

  const title = capitalizeWords(slug.replace(/-/g, " "));
  const url = absoluteUrl(`/learn/${slug}`);
  const content = GUIDE_CONTENT[slug];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: absoluteUrl("/learn"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      },
    ],
  };

  return (
    <main className="bg-white">
      <JsonLd id="learn-article-schema" data={schema} />
      <JsonLd id="learn-breadcrumb-schema" data={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="bg-secondary pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="container mx-auto max-w-5xl px-6">
          <nav className="mb-8 text-sm text-slate-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/learn"
              className="hover:text-primary transition-colors"
            >
              Learn
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-900">{title}</span>
          </nav>
          <h1 className="mb-2 mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-5xl">
            {title}
          </h1>

          <p className="text-sm leading-relaxed">{content.intro}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-6">
          {/* What You'll Learn */}
          <div className="mb-12 rounded-2xl border p-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              What You'll Learn
            </h2>
            <ul className="grid gap-3">
              {content.whatYouLearn.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {content.sections.map((section, i) => (
              <div key={i}>
                <h2 className="mb-4 text-2xl font-bold text-slate-900">
                  {i + 1}. {section.title}
                </h2>
                <p className="leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Pro Tip Box */}
          {content.proTip && (
            <div className="bg-secondary mt-12 rounded-2xl p-8">
              <h3 className="mb-2 text-lg font-bold text-black">Pro Tip</h3>
              <p className="leading-relaxed text-black">{content.proTip}</p>
            </div>
          )}

          {/* Conclusion */}
          {slug === "how-to-start-online-business-in-nepal" && (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <p className="leading-relaxed text-slate-600">
                Starting an online business in Nepal may seem challenging at
                first, but with the right approach, tools, and mindset, it is
                completely achievable. By combining a strong idea, proper setup,
                secure payment integration, and effective marketing, you can
                build a successful digital business and reach customers all over
                the country.
              </p>
            </div>
          )}

          {slug === "register-company-in-nepal-online" && (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <p className="leading-relaxed text-slate-600">
                Registering a company in Nepal might seem complex at first, but
                once completed, it opens the door to long-term growth,
                partnerships, and credibility in the market. It is a
                foundational step for anyone serious about building a
                sustainable business.
              </p>
            </div>
          )}

          {slug === "pan-vs-vat-for-online-shops-nepal" && (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <p className="leading-relaxed text-slate-600">
                Choosing the right registration helps you avoid legal issues and
                ensures your business can scale smoothly. It is always a good
                idea to consult with an accountant or tax expert to make the
                best decision based on your business model.
              </p>
            </div>
          )}

          {slug === "best-payment-gateways-nepal" && (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <p className="leading-relaxed text-slate-600">
                Ultimately, the best payment gateway is one that aligns with
                your business needs and provides a seamless experience for your
                customers. By integrating trusted local payment systems, you can
                build confidence, reduce friction, and increase sales.
              </p>
            </div>
          )}

          {slug === "seo-guide-for-nepali-businesses" && (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <p className="leading-relaxed text-slate-600">
                SEO is a long-term investment that pays off consistently over
                time. By following these principles and staying committed, your
                Nepali business can achieve sustainable growth and visibility
                online.
              </p>
            </div>
          )}

          {/* CTA */}
          <CityCTA />
        </div>
      </section>
    </main>
  );
}
