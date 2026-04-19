import React from "react";
import { Check, Globe } from "lucide-react";
import { StoryVisual } from "./story-visual";

export default function AboutStory() {
  const points = [
    "Built from real struggles of Nepali founders",
    "No coding, no servers, no confusion",
    "Local payments that actually work",
    "Tools designed for Nepali businesses",
  ];

  return (
    <section className="relative border-slate-100 bg-gradient-to-b from-white to-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* visual */}
          <div className="order-2 pb-16 lg:order-1">
            <StoryVisual />
          </div>

          {/* text */}
          <div className="order-1 lg:order-2">
            {/* badge */}
            <div className="text-primary mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold">
              <Globe className="h-4 w-4" />
              Our story
            </div>

            {/* heading */}
            <h2 className="mb-6 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl">
              Getting online in Nepal{" "}
              <span className="text-primary">shouldn’t be this hard.</span>
            </h2>

            {/* paragraphs */}
            <p className="mb-4 text-base leading-relaxed text-slate-600">
              In 2023, we saw something frustrating. Talented Nepali founders
              with great products were stuck offline—not because of lack of
              vision, but because the system wasn’t built for them.
            </p>

            <p className="mb-4 text-base leading-relaxed text-slate-600">
              Agencies were charging Rs 50,000+ for simple websites. Global
              platforms billed in dollars. And setting up domains, hosting, and
              SSL felt overwhelming.
            </p>

            <p className="mb-8 text-base leading-relaxed font-semibold text-slate-900">
              So we built Nepdora—to remove every barrier between Nepali
              businesses and the internet.
            </p>

            {/* points */}
            <ul className="space-y-4">
              {points.map(p => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                    <Check
                      className="text-primary h-3.5 w-3.5"
                      strokeWidth={3}
                    />
                  </span>
                  <span className="text-sm leading-relaxed text-slate-700">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* subtle background glow */}
      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-indigo-100 opacity-30 blur-3xl" />
    </section>
  );
}
