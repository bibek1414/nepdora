"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureBlockProps } from "./types";

export const FeatureBlock: React.FC<FeatureBlockProps> = ({
  title,
  description,
  Visual,
  reversed = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center gap-8 py-8 sm:gap-10 sm:py-10 md:flex-row md:gap-12 md:py-12 ${reversed ? "md:flex-row-reverse" : ""}`}
    >
      <div className="flex-1 text-left">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
          {description}
        </p>
        <Button
          size="default"
          variant="outline"
          className="group mt-2 w-fit cursor-pointer items-center gap-2 text-sm font-normal"
        >
          <span>Explore More</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="w-full flex-1">
        <div className="relative aspect-4/3 overflow-hidden rounded-lg sm:rounded-xl">
          <Visual />
        </div>
      </div>
    </div>
  );
};
