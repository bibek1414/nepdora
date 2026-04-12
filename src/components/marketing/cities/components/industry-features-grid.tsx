import { Check } from "lucide-react";

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

  const industryLabel = category.replace(/-/g, " ");

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {customH2 || `Features built for ${industryLabel} businesses`}
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            Every tool you need to run, manage, and grow — all in one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              {feature.icon && (
                <div className="mb-4 text-2xl">{feature.icon}</div>
              )}
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
