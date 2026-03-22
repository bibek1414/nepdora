import React from "react";

const ComparisonTable: React.FC = () => {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-16 text-3xl font-bold text-slate-900 sm:text-4xl">
          Hiring a Developer vs. Nepdora
        </h2>
        <div className="overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">
                  Feature
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">
                  Hiring a Developer
                </th>
                <th className="px-6 py-4 text-sm font-semibold">Nepdora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="border-r border-slate-100 bg-slate-50/50 px-6 py-5 text-sm font-medium text-slate-900">
                  Cost
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  Rs. 30,000–2,00,000
                </td>
                <td className="bg-primary/5 px-6 py-5 text-sm font-semibold text-slate-900">
                  From Rs. 999/month
                </td>
              </tr>
              <tr>
                <td className="border-r border-slate-100 bg-slate-50/50 px-6 py-5 text-sm font-medium text-slate-900">
                  Time to launch
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">4–12 weeks</td>
                <td className="bg-primary/5 px-6 py-5 text-sm font-semibold text-slate-900">
                  30 minutes
                </td>
              </tr>
              <tr>
                <td className="border-r border-slate-100 bg-slate-50/50 px-6 py-5 text-sm font-medium text-slate-900">
                  Can you edit it yourself?
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">Rarely</td>
                <td className="bg-primary/5 px-6 py-5 text-sm font-semibold text-slate-900">
                  Yes, always
                </td>
              </tr>
              <tr>
                <td className="border-r border-slate-100 bg-slate-50/50 px-6 py-5 text-sm font-medium text-slate-900">
                  eSewa / Khalti payments
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">Extra cost</td>
                <td className="bg-primary/5 px-6 py-5 text-sm font-semibold text-slate-900">
                  Built-in
                </td>
              </tr>
              <tr>
                <td className="border-r border-slate-100 bg-slate-50/50 px-6 py-5 text-sm font-medium text-slate-900">
                  Ongoing maintenance fee
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  Rs. 5,000+/month
                </td>
                <td className="bg-primary/5 px-6 py-5 text-sm font-semibold text-slate-900">
                  Included
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
