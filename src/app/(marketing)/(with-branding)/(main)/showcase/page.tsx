"use client";

import {
  ExternalLink,
  Smartphone,
  Laptop,
  Trophy,
  ChevronRight,
  MapPin,
  Zap,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buildMarketingMetadata, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { ShowcaseVisualMock } from "@/components/marketing/showcase/showcase-visual-mock";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { useTestimonials } from "@/hooks/super-admin/use-testimonials";

const CASE_STUDIES = [
  {
    id: 1,
    slug: "brainstorm-education-consultancy",
    storyHeadline: "Education Consultancy",
    company: "Brainstorm Global Education",
    location: "Baneshwor, Kathmandu",
    metric: "3× Reservation Growth",
    desc: "Brainstorm Global Education partnered with Nepdora to create a modern, user-friendly website that allows students to book appointments and explore courses.",
    link: "https://www.brainstorm.edu.np/",
    category: "Education",
  },
  {
    id: 2,
    slug: "xinfin-consultants",
    storyHeadline: "Accounting Consultants",
    company: "xInfin Consultants",
    location: "Baluwatar-04, Kathmandu",
    metric: "3× Website Traffic",
    desc: "xInfin Consultants leveraged Nepdora to build a professional online presence that showcases their services and expertise.",
    link: "https://infinconsultants.com/",
    category: "Consulting",
  },
  {
    id: 3,
    slug: "bato-ma-tours",
    storyHeadline: "Automobile Rental Agency",
    company: "Bato Ma Tours",
    location: "Baluwatar, Kathmandu",
    metric: "2× Booking Growth",
    desc: "Bato Ma Tours upgraded their booking experience with a Nepdora-powered website, allowing customers to explore tours and book online effortlessly.",
    link: "https://batomatours.com/",
    category: "Travel & Tours",
  },
];

export default function ShowcasePage() {
  const { data: testimonials } = useTestimonials();
  const videoTestimonials = testimonials?.filter(t => t.video_url) || [];

  const showcaseSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Nepdora Customer Showcase",
    description: "Discover real success stories from businesses across Nepal built with Nepdora.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  };

  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd id="showcase-schema-itemlist" data={showcaseSchema} />

      <div className="container mx-auto max-w-6xl px-6 pt-4">
        <Breadcrumbs items={[{ label: "Showcase", href: "/showcase" }]} />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Real Nepali Businesses Growing with{" "}
              <span className="text-primary">Nepdora.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed font-medium text-slate-500 sm:text-lg">
              Discover success stories from Kathmandu to Pokhara. See how local
              brands are transforming their digital presence and reaching more customers.
            </p>
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      {videoTestimonials.length > 0 && (
        <section className="bg-slate-50 py-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Video <span className="text-primary">Testimonials.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videoTestimonials.map(v => (
                <div key={v.id} className="group overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/50">
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img src={v.image || "/images/placeholder.jpg"} alt={v.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Link href={v.video_url || "#"} target="_blank" className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-2xl transition-transform hover:scale-110">
                        <Play className="h-6 w-6 fill-current" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900">{v.name}</h3>
                    <p className="text-sm text-slate-500">{v.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Case Studies */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Success <span className="text-primary">Stories.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              In-depth looks at how we've helped businesses across various industries.
            </p>
          </div>

          <div className="space-y-24">
            {CASE_STUDIES.map((study, i) => (
              <div
                key={study.id}
                className={`grid items-center gap-12 lg:grid-cols-2 ${
                  i % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div>
                  <div className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                    {study.storyHeadline}
                  </div>
                  <h3 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    {study.company}
                  </h3>
                  <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-400">
                    <MapPin className="h-4 w-4" />
                    {study.location}
                  </div>
                  <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                    {study.desc}
                  </p>

                  <div className="mb-8 grid grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="text-primary mb-1 text-2xl font-bold">
                        {study.metric.split(" ")[0]}
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {study.metric.split(" ").slice(1).join(" ")}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-1 text-2xl font-bold text-slate-900">
                        100%
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        Nepali Built
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <Link
                      href={`/user-stories/${study.slug}`}
                      className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all"
                    >
                      Read Story
                    </Link>
                    <Link
                      href={study.link}
                      target="_blank"
                      className="text-slate-400 hover:text-primary flex items-center gap-1 text-sm font-semibold transition-colors"
                    >
                      Visit Site <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                <div>
                  <ShowcaseVisualMock
                    title={study.company}
                    category={study.category}
                    metric={study.metric}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Uptime guarantee", value: "99.9%" },
              { label: "Active stores", value: "2k+" },
              { label: "Nepali support", value: "100%" },
              { label: "Ready to launch", value: "5min" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 bg-white p-8 text-center"
              >
                <div className="text-primary mb-2 text-3xl font-bold md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
