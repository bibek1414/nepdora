import React from "react";
import { Heart, Globe, Zap, Users, ShieldCheck, Smile } from "lucide-react";

export default function AboutValues() {
  const values = [
    {
      icon: Heart,
      title: "Local First",
      description: "Everything we build is designed specifically for the unique needs of the Nepali market and its entrepreneurs.",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      icon: Zap,
      title: "Radical Simplicity",
      description: "We believe technology should be invisible. No code, no complexity—just results that help you grow.",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: Globe,
      title: "Independent & Open",
      description: "We are 100% independent. Our focus is strictly on building the best tools for our community.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Our Core Values
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">
            The principles that guide every line of code we write and every 
            feature we build at Nepdora.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-100 bg-white p-8 transition-shadow hover:shadow-lg">
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${v.bg}`}>
                <v.icon className={`h-6 w-6 ${v.color}`} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{v.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
