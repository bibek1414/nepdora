import React from "react";
import { Check, Globe } from "lucide-react";
import { StoryVisual } from "./story-visual";

export default function AboutStory() {
  const points = [
    "Born from the struggle of local founders",
    "Zero technical barriers or server setup",
    "Seamless local payment integrations",
    "Built-in tools for real Nepali commerce",
  ];

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* visual */}
          <div className="order-2 lg:order-1">
            <StoryVisual />
          </div>

          {/* text */}
          <div className="order-1 lg:order-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              <Globe className="h-4 w-4" />
              the story
            </div>
            
            <h2 className="mb-5 text-3xl leading-snug font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why is it so hard to get online in Nepal?
            </h2>
            <p className="mb-4 text-base leading-relaxed text-slate-500">
              That was the question that started it all. In 2023, we watched 
              brilliant local entrepreneurs struggle. They had amazing 
              products—but their digital presence was broken.
            </p>
            <p className="mb-4 text-base leading-relaxed text-slate-500">
              They were held hostage by agencies charging Rs 50,000 for a 
              static page. They were stuck with platforms like Wix that billed 
              in Dollars. They were confused by servers, SSLs, and DNS records.
            </p>
            <p className="mb-7 text-base font-medium text-slate-900 leading-relaxed">
              We took it personally. We built Nepdora to be the bridge.
            </p>
            <ul className="space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                    <Check className="h-3 w-3 text-indigo-600" strokeWidth={2.5} />
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
    </section>
  );
}
