import { Check } from "lucide-react";

interface LeadCaptureCRMProps {
  data: { title: string; features: string[]; image: string };
}

export const LeadCaptureCRM: React.FC<LeadCaptureCRMProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <img
              src={data.image}
              alt="Nepdora CRM dashboard"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {data.title}
            </h2>
            <p className="mb-7 text-base leading-relaxed text-slate-500">
              Every enquiry, lead, and booking captured automatically — visible
              in your dashboard from day one.
            </p>
            <ul className="space-y-3">
              {data.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                    strokeWidth={2}
                  />
                  <span className="text-sm leading-relaxed text-slate-700">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
