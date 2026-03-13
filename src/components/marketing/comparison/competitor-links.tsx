"use client";
import React from "react";
import Link from "next/link";
import { COMPETITOR_CATEGORIES } from "@/constants/competitors";
import { motion } from "framer-motion";

const CompetitorLinks = () => {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
      {COMPETITOR_CATEGORIES.map((category, idx: number) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-900 border-l-4 border-primary pl-3">
            {category.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.competitors.map((competitor) => (
              <Link
                key={competitor.slug}
                href={`/compare/${competitor.slug}-and-nepdora`}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 transition-all hover:border-primary hover:bg-slate-50 hover:text-primary"
              >
                {competitor.name} vs Nepdora
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CompetitorLinks;
