import dynamic from "next/dynamic";
import HeroSection from "@/components/marketing/hero-section/hero-section";
import ContactSection from "@/components/marketing/contact-us/contact-us";
import CaseStudies from "@/components/marketing/case-studies/case-studies";
import Comparison from "@/components/marketing/comparison/comparison";
import { NepaliBusinessFeatures } from "@/components/marketing/features/nepali-features-section";
import { HomePricingSection } from "@/components/marketing/pricing-section/home-pricing-section";
import { HomeFAQSection } from "@/components/marketing/faq-section/home-faq-section";
import CTA from "@/components/marketing/cta-section/cta-section";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import Blogs from "@/components/marketing/blog/blogs";
import { marketingBlogApi } from "@/services/api/marketing/blog";

import { Suspense } from "react";

// Lazy load non-critical components to reduce initial load
const TestimonialsSection = dynamic(
  () => import("@/components/marketing/testimonials/testimonials"),
  { loading: () => <div className="py-20" /> }
);

const TemplatesPage = dynamic(
  () => import("@/components/marketing/templates/templates-page"),
  { loading: () => <div className="py-20" /> }
);

async function BlogSection() {
  const blogData = await marketingBlogApi.getBlogs({ page_size: 12 });

  const blogListSchema =
    blogData?.results?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Nepdora Blog - Website Building Tips for Nepal",
          url: absoluteUrl("/blog"),
          numberOfItems: blogData.results.length,
          itemListElement: blogData.results.map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "BlogPosting",
              headline: post.title,
              url: absoluteUrl(`/blog/${post.slug}`),
              datePublished: post.created_at,
              dateModified: post.updated_at,
              author: post.author
                ? {
                    "@type": "Person",
                    name:
                      `${post.author.first_name} ${post.author.last_name}`.trim() ||
                      post.author.username,
                  }
                : { "@type": "Organization", name: SITE_NAME },
              ...(post.thumbnail_image && { image: post.thumbnail_image }),
              ...(post.meta_description && {
                description: post.meta_description,
              }),
            },
          })),
        }
      : null;

  return (
    <>
      {blogListSchema && <JsonLd id="schema-blog-list" data={blogListSchema} />}
      <Blogs initialData={blogData} />
    </>
  );
}

export const metadata = buildMarketingMetadata({
  title:
    "Website Builder Nepal | Free AI Website Builder for Nepali Businesses",
  description:
    "Build a website in Nepal in minutes with Nepdora. Launch ecommerce, service, and portfolio sites with eSewa, Khalti, hosting, and local support.",
  path: "/",
});

export default function Marketing() {
  const websiteSchema = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(),
    description:
      "Nepdora - Nepal's simplest way to go online. Build a professional website from NPR 999/month with eSewa & Khalti payments, Nepali language support, and same-day launch.",
    image: absoluteUrl("/nepdora-image.jpg"),
    sameAs: [
      "https://www.facebook.com/NepdoraWebBuilder",
      "https://www.instagram.com/nep_dora",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977 986-6316114",
      contactType: "customer support",
      contactOption: "TollFree",
      areaServed: "NP",
      availableLanguage: ["Nepali", "English"],
    },
    openingHours: "Mo-Su 09:00-18:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kathmandu, Nepal",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
      addressCountry: "NP",
    },
  };

  const corporationSchema = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: "Nepdora Pvt. Ltd.",
    alternateName: SITE_NAME,
    url: absoluteUrl(),
    logo: absoluteUrl("/nepdora-logooo.svg"),
    founder: {
      "@type": "Person",
      name: "Vishal Dhakal",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977 986-6316114",
      contactType: "customer support",
    },
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nepdora Website Builder",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    url: absoluteUrl(),
    offers: {
      "@type": "Offer",
      price: "10000",
      priceCurrency: "NPR",
      priceValidUntil: "2026-12-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "15000",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I build a website without coding knowledge in Nepal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes - Nepdora is designed for non-technical business owners. You use a simple drag-and-drop editor to add your text, images, and products. No HTML, CSS, or coding skills are needed at any step.",
        },
      },
      {
        "@type": "Question",
        name: "Which payment gateways work in Nepal for online stores?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nepdora supports eSewa and Khalti - Nepal's most widely used digital payment platforms. You can connect your merchant account in minutes and start accepting payments from customers across Nepal.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to build a website?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most Nepdora users publish their first website within 2 hours. You choose a template, fill in your business details, and go live - all on the same day. No waiting for a developer or agency.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need technical knowledge to manage my website?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No technical knowledge is required. Nepdora's dashboard lets you update text, add products, manage orders, and view analytics through a simple interface - the same way you use a smartphone app.",
        },
      },
      {
        "@type": "Question",
        name: "Is my website mobile-friendly automatically?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every Nepdora website is mobile-first by default. With over 90% of Nepal browsing on smartphones, all templates are fully responsive and load quickly on mobile data connections.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to build a website in Nepal with Nepdora?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nepdora offers a free plan and a Business plan at NPR 10,000/year (approximately NPR 833/month). The Business plan includes one professional website, custom domain support, eSewa & Khalti payments, mobile-responsive design, SEO tools, and priority support - everything a Nepali business needs to get online professionally.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use my own domain name?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can connect an existing domain or register a new .com, .com.np, or .np domain directly through Nepdora. Free SSL is included for all custom domains.",
        },
      },
      {
        "@type": "Question",
        name: "Is Nepdora only for businesses in Kathmandu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nepdora is available for businesses across all of Nepal - Kathmandu, Pokhara, Biratnagar, Butwal, Chitwan, and everywhere else. Your website reaches customers nationwide and globally.",
        },
      },
      {
        "@type": "Question",
        name: "What types of businesses use Nepdora in Nepal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Restaurants, hotels, homestays, salons, retail shops, clothing brands, service businesses, freelancers, consultants, NGOs, clinics, and gyms - Nepdora works for any Nepali business that wants a professional online presence.",
        },
      },
      {
        "@type": "Question",
        name: "Can I switch plans as my business grows?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can upgrade or downgrade your Nepdora plan at any time. Start with the Starter plan and move to Business or Ecommerce as your needs grow - your website and data carry over seamlessly.",
        },
      },
    ],
  };

  return (
    <>
      {/* SEO JSON-LD Structured Data */}
      <JsonLd id="schema-website" data={websiteSchema} />
      <JsonLd id="schema-corporation" data={corporationSchema} />
      <JsonLd id="schema-software" data={softwareAppSchema} />
      <JsonLd id="schema-faq" data={faqSchema} />

      <HeroSection />
      <NepaliBusinessFeatures />
      <TemplatesPage />
      <HomePricingSection />

      <CaseStudies />
      <TestimonialsSection />

      <HomeFAQSection />
      <Comparison />
      <div className="mx-auto max-w-6xl py-10 md:py-20">
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse rounded-xl bg-slate-50" />
          }
        >
          <BlogSection />
        </Suspense>
      </div>

      {/* 10. Contact + CTA */}
      <ContactSection />
      <CTA />
    </>
  );
}
