import React from "react";

interface Feature {
  title: string;
  desc: string;
  icon: string;
}

interface IndustryFeaturesGridProps {
  features: Feature[];
  category: string;
  customH2?: string;
}

export const IndustryFeaturesGrid: React.FC<IndustryFeaturesGridProps> = ({
  features,
  category,
  customH2,
}) => {
  if (!features || features.length === 0) return null;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl">
            {customH2 || `Features Built for ${category.replace("-", " ")}`}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Powerful tools designed to help you grow, manage, and scale your{" "}
            {category.replace("-", " ")} effortlessly.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center"
            >
              <h3 className="mb-4 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
