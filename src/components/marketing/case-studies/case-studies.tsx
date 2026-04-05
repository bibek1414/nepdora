import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CaseStudy {
  id: number;
  storyHeadline: string;
  company: string;
  location: string;
  metric: string;
  desc: string;
  image: string;
  link: string;
}

const studies: CaseStudy[] = [
  {
    id: 1,
    storyHeadline: "Education Consultancy",
    company: "Brainstorm GlobalEducation",
    location: "Baneshwor, Kathmandu",
    metric: "3× Reservation Growth",
    desc: "Brainstorm Global Education, a leading education consultancy, has seen a 3x increase in reservations since launching their Nepdora website. The website allows students to book appointments online, view course information, and get personalized counseling recommendations. The website has helped the consultancy reach more students and increase its revenue.",
    image: "/our-clients/brainstrom-image.png",
    link: "https://www.brainstorm.edu.np/",
  },
  {
    id: 2,
    storyHeadline: "Accounting Consultants",
    company: "xInfin Consultants",
    location: "Baluwatar-04, Kathmandu",
    metric: "3× Website Traffic",
    desc: "xInfin Consultants, a leading accounting consultancy, has seen a 3x increase in reservations since launching their Nepdora website. The website allows students to book appointments online, view course information, and get personalized counseling recommendations. The website has helped the consultancy reach more students and increase its revenue.",
    image: "/our-clients/infin-consultants.png",
    link: "https://infinconsultants.com/",
  },
  {
    id: 3,
    storyHeadline: "Automobile Rental Agency",
    company: "Bato Ma Tours",
    location: "Baluwatar, Kathmandu",
    metric: "2× Booking Growth",
    desc: "Bato Ma Tours, a leading travel agency, has seen a 2x increase in bookings since launching their Nepdora website. The website allows users to book tours online, view tour information, and get personalized recommendations. The website has helped the agency reach more customers and increase its revenue.",
    image: "/our-clients/batoma-tours.png",
    link: "https://batomatours.com/",
  },
];

const CaseStudies: React.FC = () => {
  return (
    <section id="case-studies" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <h2 className="mb-3 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Real Nepali Businesses Growing with Nepdora
          </h2>
          <p className="text-center text-sm leading-relaxed text-slate-600 sm:text-base">
            From Kathmandu restaurants to Pokhara hotels - see how local
            businesses are winning online with Nepdora.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map(study => (
            <article
              key={study.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <Link
                href={study.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-video overflow-hidden bg-slate-100"
              >
                <img
                  src={study.image}
                  alt={`${study.company} - ${study.metric}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
                  <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-900 opacity-0 shadow transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    Visit Website <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span>{study.location}</span>
                  <span>·</span>
                  <span className="text-blue-600">{study.metric}</span>
                </div>

                <h3 className="mb-2 text-sm leading-snug font-semibold text-slate-900 sm:text-base">
                  {study.storyHeadline}
                </h3>

                <p className="mt-auto border-l-2 border-slate-200 pl-3 text-xs leading-relaxed text-slate-600">
                  &ldquo;{study.desc}&rdquo;
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
