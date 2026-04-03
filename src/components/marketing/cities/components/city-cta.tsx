import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface CityCTAProps {
  cityName: string;
  category: string;
}

export const CityCTA: React.FC<CityCTAProps> = ({ cityName, category }) => {
  const industryName = category.replace("-", " ");
  return (
    <section className="bg-white py-20 text-gray-900 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h3 className="mb-6 text-3xl leading-tight font-bold md:text-5xl lg:text-5xl tracking-tight">
          Ready to launch your <br />
          <span className="text-primary">{industryName}</span> business in {cityName}?
        </h3>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-gray-600 md:text-xl">
          Join hundreds of successful businesses in {cityName} who trust Nepdora 
           to build and grow their digital presence. Start for free today.
        </p>

        <Link href="/admin/signup">
          <Button
            className="h-14 rounded-full px-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg"
          >
            Get Started for Free
          </Button>
        </Link>
      </div>
    </section>
  );
};
