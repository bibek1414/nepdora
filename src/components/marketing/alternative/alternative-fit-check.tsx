import React from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface AlternativeFitCheckProps {
  platformName: string;
  fitChecks: string[];
}

export const AlternativeFitCheck: React.FC<AlternativeFitCheckProps> = ({
  platformName,
  fitChecks,
}) => {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="mb-5 text-3xl font-bold md:text-4xl">
            Nepdora is likely the better fit if…
          </h2>
          <p className="mb-8 max-w-2xl text-lg text-slate-300">
            If you are choosing based on business execution — not just
            feature checklists — these are the clearest signals.
          </p>
          <div className="grid gap-4">
            {fitChecks.map(item => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <p className="text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="mb-3 text-sm font-semibold text-slate-400">
            Migration Path
          </p>
          <h3 className="mb-4 text-2xl font-bold">
            Switching does not need to be messy
          </h3>
          <p className="mb-6 text-slate-300">
            If your current setup is slowing growth, Nepdora can help you
            restructure pages, reconnect payment gateways, and launch a
            cleaner commercial website with less ongoing overhead.
          </p>
          <div className="space-y-3 text-sm text-slate-300">
            <p>1. Review current pages and business goals.</p>
            <p>2. Map important content and conversion flows.</p>
            <p>3. Rebuild into a faster, easier-to-manage setup.</p>
            <p>4. Launch with local business support and iteration.</p>
          </div>
          <Link
            href="/contact"
            className="text-primary mt-8 inline-flex items-center gap-2 font-semibold"
          >
            Request migration help
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
