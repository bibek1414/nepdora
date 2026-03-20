import React from "react";
import { CaseStudyCard } from "./case-study-card";

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
            <CaseStudyCard key={study.id} study={study} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
