interface Step {
  title: string;
  desc: string;
}

interface HowItWorksProps {
  steps: Step[];
  category: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ steps, category }) => {
  if (!steps || steps.length === 0) return null;

  const industryLabel = category.replace(/-/g, " ");

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Launch your {industryLabel} website in 3 steps
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            No coding, no designer, no waiting. Get online in minutes.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-8 hidden h-px w-[calc(100%+2rem)] bg-slate-200 sm:block" />
              )}
              <div className="relative flex flex-col">
                <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-600">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
