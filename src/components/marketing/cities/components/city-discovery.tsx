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
    city =>
      city.toLowerCase() !== currentCity.toLowerCase() &&
      city.toLowerCase() !== "nepal" &&
      city.toLowerCase() !== "nepdora"
  ).slice(0, 15); // Show top 10 other cities

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Popular Locations
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            Nepdora supports businesses across all major cities in Nepal. Find a
            local solution near you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {otherCities.map(city => (
            <Link
              key={city}
              href={`/${category}/${city}`}
              className="group :border-blue-300 :bg-white :-md flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="group--600 text-sm font-semibold text-slate-900">
                  {capitalizeWords(city)}
                </span>
              </div>
              <ChevronRight className="group-:translate-x-1 group--500 h-4 w-4 text-slate-300 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
