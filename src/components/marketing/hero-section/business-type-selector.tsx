"use client";

import { useState } from "react";
import Link from "next/link";

const businessTypes = [
  { label: "Restaurant & Cafe", href: "/templates/restaurant-cafe" },
  { label: "Travel Agency", href: "/templates/travel-agency" },
  { label: "School/College", href: "/templates/school-college" },
  { label: "Ecommerce Store", href: "/templates/ecommerce-store" },
  { label: "Medical Clinic", href: "/templates/medical-clinic" },
];

export function BusinessTypeSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      {businessTypes.map(type => (
        <Link
          key={type.label}
          href={type.href}
          onClick={() => setSelected(type.label)}
          className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === type.label
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          {type.label}
        </Link>
      ))}
    </div>
  );
}
