import { Check, X } from "lucide-react";

interface ComparisonProps {
  data: { nepdora: string[]; traditional: string[] };
}

export const ComparisonSection: React.FC<ComparisonProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Why businesses choose Nepdora
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            See how we compare to hiring a traditional web development agency.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Nepdora */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <p className="mb-5 text-xs font-medium uppercase tracking-wider text-slate-500">
              Nepdora
            </p>
            <ul className="space-y-3.5">
              {data.nepdora.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" strokeWidth={2} />
                  <span className="text-sm leading-relaxed text-slate-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Traditional */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <p className="mb-5 text-xs font-medium uppercase tracking-wider text-slate-400">
              Traditional Agency
            </p>
            <ul className="space-y-3.5">
              {data.traditional.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
                  <span className="text-sm leading-relaxed text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Nepdora is 10× faster and significantly more affordable than a traditional agency.
        </p>
      </div>
    </section>
  );
};
