"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Server,
  ShieldCheck,
  Globe,
  CreditCard,
  TrendingUp,
  Layout,
  Zap,
  MapPin,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { GlossaryTerm } from "@/constants/glossary";

interface GlossaryListProps {
  groupedTerms: Record<string, GlossaryTerm[]>;
}

export function GlossaryList({ groupedTerms }: GlossaryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      "Hosting & Infrastructure": <Server className="h-5 w-5" />,
      "Security & Privacy": <ShieldCheck className="h-5 w-5" />,
      "Domains & URLs": <Globe className="h-5 w-5" />,
      "Payments & E-commerce": <CreditCard className="h-5 w-5" />,
      "SEO & Marketing": <TrendingUp className="h-5 w-5" />,
      "Design & Development": <Layout className="h-5 w-5" />,
      "Performance & Speed": <Zap className="h-5 w-5" />,
      "Local Nepal Terms": <MapPin className="h-5 w-5" />,
      "General Terms": <HelpCircle className="h-5 w-5" />,
    };
    return icons[category] || <BookOpen className="h-5 w-5" />;
  };

  const filteredCategories = Object.entries(groupedTerms)
    .map(([category, terms]) => {
      const filteredTerms = terms.filter(
        term =>
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { category, filteredTerms };
    })
    .filter(cat => cat.filteredTerms.length > 0);

  return (
    <>
      {/* Search Section */}
      <section className="py-8">
        <div className="container mx-auto max-w-2xl px-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for a term... (e.g., SSL, Domain, SEO)"
              className="focus:border-primary focus:ring-primary h-12 w-full rounded-full border border-slate-200 bg-white pr-4 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Glossary Categories */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(({ category, filteredTerms }) => (
              <div key={category} className="mb-16 last:mb-0">
                <div className="mb-6 flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                    {getCategoryIcon(category)}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {category}
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTerms.map(term => (
                    <Link
                      key={term.slug}
                      href={`/glossary/${term.slug}`}
                      className="group -sm hover:-md rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="group-hover:text-primary text-lg font-semibold text-slate-900 transition-colors">
                          {term.term}
                        </h3>
                        <ChevronRight className="group-hover:text-primary h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="line-clamp-2 text-sm leading-relaxed font-medium text-slate-500">
                        {term.definition}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                No terms found
              </h3>
              <p className="text-slate-500">
                Try searching for something else like "SSL" or "Domain"
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
