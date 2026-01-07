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
  link: string;
}

const CaseStudies: React.FC = () => {
  const studies: CaseStudy[] = [
    {
      id: 1,
      company: "Brainstorm Abroad Study",
      metric: "5000+ Students Placed",
      desc: "Expert guidance for studying in USA, UK, Australia, Canada & New Zealand. From course selection to visa processing — we've got you covered.",
      image: "/our-clients/brainstrom-image.png",
      link: "https://www.brainstorm.edu.np/",
    },
    {
      id: 2,
      company: "Infin Consultants",
      metric: "250+ Clients Worldwide",
      desc: "Professional Accounting, Compliance & Business Setup — All in One Place. We help businesses stay compliant, manage finances, and grow.",
      image: "/our-clients/infin-consultants.png",
      link: "https://infinconsultants.com/",
    },
    {
      id: 3,
      company: "Bato Ma",
      metric: "Best Experience",
      desc: "Bato Ma is a trustable and affordable rental service provider for two and four wheelers Ev's in Kathmandu, Nepal.",
      image: "/our-clients/batoma-tours.png",
      link: "https://batomatours.com/",
    },
  ];

  return (
    <section id="case-studies" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-2 flex flex-col items-start justify-center sm:mb-10 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl leading-tight font-bold tracking-normal text-slate-900 sm:text-3xl md:text-4xl">
              Read How Nepdora Helped{" "}
              <span className="font-light">Businesses Grow</span>
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {studies.map((study, idx) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col"
            >
              {/* Image Container */}
              <a
                href={study.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mb-5 block aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100"
              >
                <img
                  src={study.image}
                  alt={`${study.company} case study`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex translate-y-4 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-slate-900 shadow-lg transition-transform duration-300 group-hover:translate-y-0">
                    <span className="text-sm font-semibold">Visit Website</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </a>

              {/* Content */}
              <div className="flex flex-1 flex-col">
                <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors duration-200">
                  <a
                    href={study.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:ring-primary rounded focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  >
                    {study.company}
                  </a>
                </h3>

                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-600"></div>
                  <span>{study.metric}</span>
                </div>

                <p className="border-l-2 border-slate-200 pl-3 text-xs leading-relaxed text-slate-600 sm:pl-4">
                  &quot;{study.desc}&quot;
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
