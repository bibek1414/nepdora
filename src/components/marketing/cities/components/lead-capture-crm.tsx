import React from "react";
import { CheckCircle } from "lucide-react";

interface LeadCaptureCRMProps {
  data: { title: string; features: string[]; image: string };
}

export const LeadCaptureCRM: React.FC<LeadCaptureCRMProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="bg-slate-50 py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:justify-between lg:items-center">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl transition-transform hover:scale-105 lg:w-1/2">
            <img
              src={data.image}
              alt="Nepdora Agency CRM Dashboard"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              {data.title}
            </h2>
            <p className="mb-10 text-xl leading-relaxed text-slate-600">
              Agencies care about getting clients. Highlight that their Nepdora
              site comes with built-in forms and an integrated CRM dashboard to
              track client inquiries and project leads locally.
            </p>
            <ul className="grid gap-6">
              {data.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-xl font-medium text-slate-700">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
