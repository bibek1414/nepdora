import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

const STORIES = [
  {
    slug: "brainstorm-education-consultancy",
    company: "Brainstorm Global Education",
    industry: "Education Consultancy",
    location: "Baneshwor, Kathmandu",
    metric: "3× Reservation Growth",
    description:
      "Brainstorm Global Education, a leading education consultancy, has seen a 3x increase in reservations since launching their Nepdora website.",
    fullStory: [
      "Brainstorm Global Education was struggling to manage their appointment bookings manually. They needed a solution that allowed students to see available slots and book counseling sessions online.",
      "With Nepdora, they launched a professional website with an integrated booking system in just a few days. The results were immediate.",
      "The platform's ease of use and local payment support (if applicable) made it the perfect fit for their growth strategy.",
    ],
    features: [
      "Online Booking System",
      "Course Directory",
      "Student Portal",
      "Automated Email Alerts",
    ],
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop",
    website: "https://www.brainstorm.edu.np/",
  },
  {
    slug: "xinfin-consultants",
    company: "xInfin Consultants",
    industry: "Accounting Consultants",
    location: "Baluwatar-04, Kathmandu",
    metric: "3× Website Traffic",
    description:
      "xInfin Consultants leveraged Nepdora to build a professional online presence that showcases their expertise.",
    fullStory: [
      "Prior to using Nepdora, xInfin Consultants had a limited online presence. They wanted a way to showcase their complex accounting services in a clear, professional manner.",
      "Nepdora's templates allowed them to structure their service offerings logically, helping potential clients find exactly what they needed.",
      "Since the launch, they have experienced a significant surge in organic traffic and lead quality.",
    ],
    features: [
      "Service Catalog",
      "Client Inquiry Forms",
      "Knowledge Hub",
      "Professional Branding",
    ],
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop",
    website: "https://infinconsultants.com/",
  },
  {
    slug: "bato-ma-tours",
    company: "Bato Ma Tours",
    industry: "Automobile Rental Agency",
    location: "Baluwatar, Kathmandu",
    metric: "2× Booking Growth",
    description:
      "Bato Ma Tours upgraded their booking experience with a Nepdora-powered website, doubling their revenue.",
    fullStory: [
      "Bato Ma Tours needed a robust platform to manage their vehicle rentals and tour bookings. Their previous system was outdated and not mobile-friendly.",
      "By switching to Nepdora, they got a mobile-first website that allows travelers to book directly from their smartphones.",
      "The integration with local maps and payment options significantly reduced the bounce rate on their checkout page.",
    ],
    features: [
      "Vehicle Fleet Management",
      "Mobile-first Experience",
      "Real-time Availability",
      "Route Maps",
    ],
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
    website: "https://batomatours.com/",
  },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = STORIES.find(s => s.slug === slug);
  if (!story) return {};

  return buildMarketingMetadata({
    title: `${story.company} Success Story | Built with Nepdora`,
    description: story.description,
    path: `/user-stories/${slug}`,
  });
}

export default async function UserStoryPage({ params }: Props) {
  const { slug } = await params;
  const story = STORIES.find(s => s.slug === slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-5xl px-6 pt-12">
        <Breadcrumbs
          items={[
            { label: "Showcase", href: "/showcase" },
            { label: story.company, href: `/user-stories/${slug}` },
          ]}
        />

        <section className="py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <div className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                {story.industry}
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                {story.company}
              </h1>
              <div className="mb-8 flex items-center gap-2 text-base font-medium text-slate-400">
                <MapPin className="h-5 w-5" />
                {story.location}
              </div>
              <p className="mb-10 text-xl leading-relaxed text-slate-600">
                {story.description}
              </p>

              <div className="bg-primary shadow-primary/20 inline-block rounded-2xl p-6 text-white shadow-xl">
                <div className="text-3xl font-black">{story.metric}</div>
                <div className="text-sm font-medium tracking-widest uppercase opacity-80">
                  Performance Boost
                </div>
              </div>
            </div>

            <div className="relative aspect-square overflow-hidden rounded-[3rem] bg-slate-100 shadow-2xl">
              <img
                src={story.image}
                alt={story.company}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-2xl font-bold text-slate-900">
              The Challenge & Solution
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-slate-600">
              {story.fullStory.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <h2 className="mt-16 mb-8 text-2xl font-bold text-slate-900">
              Key Features Used
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {story.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                >
                  <div className="bg-primary h-2 w-2 rounded-full" />
                  <span className="font-semibold text-slate-700">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-20 rounded-3xl bg-white p-8 text-center text-slate-900 border">
              <h3 className="mb-4 text-xl font-bold">
                Experience {story.company} live
              </h3>
              <p className="mb-8 text-slate-400">
                See the real website built on the Nepdora platform.
              </p>
              <Link
                href={story.website}
                target="_blank"
                className="bg-primary text-white inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold transition-transform hover:scale-105"
              >
                Visit Website <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <CTASection />
    </div>
  );
}
