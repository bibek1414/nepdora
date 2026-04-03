import React from "react";

export interface ComparisonRow {
  feature: string;
  nepdora: string | React.ReactNode;
  opponent: string | React.ReactNode;
}

interface AlternativeTableProps {
  platformName: string;
  rows: ComparisonRow[];
}

export const AlternativeTable: React.FC<AlternativeTableProps> = ({
  platformName,
  rows,
}) => {
  return (
    <section className="bg-slate-50 py-20" id="comparison-table">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
          {platformName} vs Nepdora: Full feature comparison
        </h2>
        <p className="mb-10 text-lg text-slate-600 max-w-2xl">
          A side-by-side look at the features that matter most for Nepal-based
          businesses — payments, pricing, launch speed, and support.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-4 text-left font-semibold">Feature</th>
                <th className="px-6 py-4 text-left font-semibold text-primary">
                  Nepdora
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-300">
                  {platformName}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={
                    i % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{row.nepdora}</td>
                  <td className="px-6 py-4 text-slate-500">{row.opponent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Last updated: April 2026. Based on publicly available information.
        </p>
      </div>
    </section>
  );
};
