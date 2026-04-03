import React from "react";

interface Step {
  title: string;
  desc: string;
}

interface HowItWorksProps {
  steps: Step[];
  category: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ steps, category }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="bg-slate-50 py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            How to Create a {category.replace("-", " ")} Website in 3 Easy Steps
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Nepdora is designed to get you online as quickly as possible. No
            coding or technical skills required.
          </p>
        </div>

        <div className="relative grid gap-12 md:grid-cols-3">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-blue-100 md:block" />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-xl ring-8 ring-white">
                {index + 1}
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-lg leading-relaxed text-slate-600">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
