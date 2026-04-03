import React from "react";
import Link from "next/link";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  href: string;
}

interface AlternativeTestimonialsProps {
  testimonials: Testimonial[];
}

export const AlternativeTestimonials: React.FC<AlternativeTestimonialsProps> = ({
  testimonials,
}) => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-10 text-3xl font-bold text-slate-900 md:text-4xl">
          What Nepal businesses say about Nepdora
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map(t => (
            <div
              key={t.name}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-8"
            >
              <p className="text-slate-700 text-lg leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div>
                <Link
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-900 hover:underline"
                >
                  {t.name}
                </Link>
                <p className="text-sm text-slate-500 mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-slate-500 text-sm">
          Trusted by 15,000+ Nepali businesses.{" "}
          <Link
            href="/about"
            className="text-primary font-medium hover:underline transition-all hover:text-primary/80"
          >
            Read our story →
          </Link>
        </p>
      </div>
    </section>
  );
};
