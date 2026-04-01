import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface CityCTAProps {
  cityName: string;
}

export const CityCTA: React.FC<CityCTAProps> = ({ cityName }) => {
  return (
    <section className="bg-white py-20 text-gray-900 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h3 className="mb-6 text-3xl leading-tight font-normal md:text-5xl lg:text-4xl">
          Start your journey with{" "}
          <span className="text-primary font-semibold">Nepdora</span> <br />
          Intelligence Today in {cityName}
        </h3>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-gray-900 md:text-xl">
          Unlock industry-leading website intelligence and gain access to the
          platform millions of people depend on to increase traffic and build my
          digital presence.
        </p>

        <Link href="/admin/signup">
          <Button
            variant="outline"
            className="h-14 rounded-lg bg-white px-12 text-lg font-semibold"
          >
            Try for free
          </Button>
        </Link>
      </div>
    </section>
  );
};
