"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface CaseStudy {
  id: number;
  company: string;
  metric: string;
  desc: string;
  image: string;
  category: string;
}

const CaseStudies: React.FC = () => {
  const studies: CaseStudy[] = [
    {
      id: 1,
      company: "Lumière Beauty",
      category: "Ecommerce",
      metric: "Sales grew 140% in Month 1",
      desc: "Switched from Shopify to handle complex logistics automatically. The AI-generated 'Clean Girl' aesthetic converted 3x better.",
      image:
        "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      company: "Studio 99",
      category: "Portfolio",
      metric: "#1 Ranking for 'Modern Arch'",
      desc: "Nepdora's auto-SEO schema pushed their portfolio to the top of Google Images and Search without a single manual edit.",
      image:
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      company: "Oasis Spa & Retreat",
      category: "Service",
      metric: "Saved 20hrs/week admin time",
      desc: "The automated booking and inquiry system replaced their reception desk entirely. Clients book, pay, and get reminders automatically.",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section id="case-studies" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 flex flex-col items-end justify-between md:flex-row">
          <div>
            <h2 className="mb-6 text-3xl leading-tight font-bold text-slate-900 md:text-5xl">
              Don&apos;t just take our word for it.{" "}
              <span className="text-primary font-serif italic">
                See the growth.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {studies.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col"
            >
              <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-2xl bg-slate-200 md:aspect-[4/5]">
                <img
                  src={study.image}
                  alt={study.company}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0"></div>

                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wider text-slate-900 uppercase backdrop-blur-md">
                    {study.category}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  {study.company}
                </h3>
                <div className="text-primary mb-3 flex items-center gap-2 text-sm font-medium">
                  <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
                  {study.metric}
                </div>
                <p className="border-l border-slate-200 pl-4 text-sm leading-relaxed text-slate-500">
                  &quot;{study.desc}&quot;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
