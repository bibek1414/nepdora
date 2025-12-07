"use client";
import React from "react";
import { motion } from "framer-motion";
import { X, Check, Calculator } from "lucide-react";

const Comparison: React.FC = () => {
  const rows = [
    { feature: "Time to Launch", trad: "3-6 Months", nep: "3 Minutes" },
    { feature: "Initial Cost", trad: "NPR 1,50,000+", nep: "NPR 0 Setup" },
    { feature: "Maintenance", trad: "NPR 5,000+/mo", nep: "NPR 1,500/mo" },
    { feature: "SEO Strategy", trad: "Hire Agency", nep: "Automated AI" },
    { feature: "Updates", trad: "Billable Hours", nep: "Instant Prompt" },
  ];

  return (
    <section
      id="comparison"
      className="overflow-hidden border-t border-slate-100 bg-white py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-16 md:flex-row">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-3xl leading-tight font-bold tracking-tight text-slate-900 md:text-5xl">
                Stop paying for <br />{" "}
                <span className="font-serif text-slate-400 italic">
                  inefficiency.
                </span>
              </h2>
              <p className="mb-8 max-w-md text-lg leading-relaxed font-light text-slate-500">
                Traditional development is slow, expensive, and fragile. Nepdora
                replaces agencies with intelligent automation.
              </p>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-2 text-slate-900 shadow-sm">
                    <Calculator size={18} />
                  </div>
                  <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Savings Calculator
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-slate-900">
                    NPR
                  </span>
                  <motion.span
                    className="text-primary text-5xl font-bold tracking-tight"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                  >
                    <CountUp end={245000} duration={2} />
                  </motion.span>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-400">
                  Average first-year savings per project.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex-1"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4">
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Metric
                </div>
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Agency
                </div>
                <div className="text-primary text-xs font-bold tracking-widest uppercase">
                  Nepdora
                </div>
              </div>

              <div className="px-6 py-2">
                {rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 items-center gap-4 border-b border-slate-50 py-5 last:border-0"
                  >
                    <div className="text-sm font-medium text-slate-700">
                      {row.feature}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="line-through decoration-slate-200">
                        {row.trad}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Check size={14} className="text-primary" /> {row.nep}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CountUp = ({ end, duration }: { end: number; duration: number }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count.toLocaleString()}</>;
};

export default Comparison;
