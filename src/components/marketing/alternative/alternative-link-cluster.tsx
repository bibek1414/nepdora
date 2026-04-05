import React from "react";
import Link from "next/link";

export interface AlternativeLink {
  label: string;
  href: string;
}

interface AlternativeLinkClusterProps {
  links: AlternativeLink[];
}

export const AlternativeLinkCluster: React.FC<AlternativeLinkClusterProps> = ({
  links,
}) => {
  return (
    <section className="border-t border-slate-100 bg-white py-14">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Also comparing other platforms?
        </h2>
        <div className="flex flex-wrap gap-3">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
