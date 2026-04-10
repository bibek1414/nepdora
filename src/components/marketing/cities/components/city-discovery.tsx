import React from "react";
import Link from "next/link";
import { MAJOR_CITIES } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import { MapPin, ChevronRight } from "lucide-react";

interface CityDiscoveryProps {
  currentCity: string;
  category: string;
}

export const CityDiscovery: React.FC<CityDiscoveryProps> = ({
  currentCity,
  category,
}) => {
  const otherCities = MAJOR_CITIES.filter(
    city => city.toLowerCase() !== currentCity.toLowerCase() && city.toLowerCase() !== "nepal" && city.toLowerCase() !== "nepdora"
  ).slice(0, 10); // Show top 10 other cities

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Popular Locations
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            Nepdora supports businesses across all major cities in Nepal. Find a local solution near you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {otherCities.map(city => (
            <Link
              key={city}
              href={`/${category}/${city}`}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-blue-300 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                  {capitalizeWords(city)}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
