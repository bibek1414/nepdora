import React from "react";
import Link from "next/link";

export interface ValueProp {
  title: string;
  description: string;
}

export interface FeatureLink {
  label: string;
  href: string;
}

interface AlternativeValuePropsProps {
  platformName: string;
  reasons: ValueProp[];
  featureLinks: FeatureLink[];
}

export const AlternativeValueProps: React.FC<AlternativeValuePropsProps> = ({
  platformName,
  reasons,
  featureLinks,
}) => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Where Nepdora stands out for Nepal businesses
          </h2>
          <p className="text-lg text-slate-600">
            For most small and medium businesses in Nepal, the decision comes
            down to four practical factors — not a feature checklist.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {reasons.map(item => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-8"
            >
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <span className="text-sm font-semibold text-slate-500 self-center mr-2">
            Explore features:
          </span>
          {featureLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:border-slate-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
