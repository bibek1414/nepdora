"use client";

import { useState } from "react";
import Link from "next/link";

const businessTypes = [
  { label: "Restaurant", href: "/templates/restaurant" },
  { label: "Hotel", href: "/templates/hotel" },
  { label: "Salon", href: "/templates/salon" },
  { label: "Shop", href: "/templates/ecommerce" },
  { label: "Service", href: "/templates/service" },
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
