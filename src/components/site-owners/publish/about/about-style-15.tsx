"use client";

import React, { useMemo } from "react";
import { Puzzle, TrendingUp, Lightbulb, ArrowUpRight } from "lucide-react";
import { AboutUs15Data } from "@/types/owner-site/components/about";
import Image from "next/image";
import Link from "next/link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate15Props {
  aboutUsData: AboutUs15Data;
  siteUser?: string;
}

const iconMap = {
  Puzzle,
  TrendingUp,
  Lightbulb,
};

export const AboutStyle15: React.FC<AboutUsTemplate15Props> = ({
  aboutUsData,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#3B82F6",
          primaryForeground: "#FFFFFF",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#FFFFFF",
        },
        fonts: {
          body: "Inter",
          heading: "Poppins",
        },
      },
    [themeResponse]
  );

  // Generate the actual href for navigation
  const generateLinkHref = (originalHref: string) => {
    if (originalHref.startsWith("http") || originalHref.startsWith("mailto:")) {
      return originalHref;
    }

    if (!siteUser) {
      return originalHref;
    }

    if (
      originalHref === "/" ||
      originalHref === "#" ||
      originalHref === "" ||
      originalHref === "home"
    ) {
      return `/${siteUser}`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/${siteUser}/${cleanHref}`;
  };

  const finalHref = generateLinkHref(aboutUsData.buttonLink || "#");

  return (
    <section
      className="bg-gray-50 py-16 md:py-24"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.fonts.body,
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Row - Spans Full Width */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-4xl">
            <h2
              className="text-3xl leading-[1.1] font-semibold md:text-5xl lg:text-6xl"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
              }}
            >
              {aboutUsData.title}
              <br />
              <span className="font-serif font-normal italic">
                {aboutUsData.italicWord}
              </span>
            </h2>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={finalHref}
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
                fontFamily: theme.fonts.body,
              }}
              className="group inline-flex items-center justify-between rounded-full py-2 pr-2 pl-6 text-[15px] font-medium shadow-lg shadow-blue-900/10 transition-colors hover:opacity-90 [&:hover_.icon-rotate]:rotate-45"
            >
              <span>{aboutUsData.buttonText || "Get Started"}</span>
              <span className="icon-rotate ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300">
                <ArrowUpRight
                  className="h-5 w-5"
                  style={{ color: theme.colors.primary }}
                />
              </span>
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Text & Cards */}
          <div className="lg:col-span-7">
            <div className="max-w-3xl">
              <p
                className="mb-6 text-xl leading-relaxed font-medium md:text-2xl"
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}
              >
                {aboutUsData.primaryDescription}
              </p>
              <p
                className="mb-10 text-sm leading-relaxed text-gray-500 md:text-base"
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}
              >
                {aboutUsData.secondaryDescription}
              </p>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {aboutUsData.cards.map(card => {
                  const IconComponent = iconMap[card.icon];
                  return (
                    <div
                      key={card.id}
                      className="flex h-full flex-col items-start rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
                      style={{
                        backgroundColor: theme.colors.background,
                      }}
                    >
                      <div
                        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${theme.colors.primary}15`,
                          color: theme.colors.primary,
                        }}
                      >
                        {IconComponent && <IconComponent size={18} />}
                      </div>
                      <h4
                        className="mb-2 text-sm font-bold"
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.fonts.heading,
                        }}
                      >
                        {card.title}
                      </h4>
                      <p
                        className="text-xs leading-relaxed text-gray-500"
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.fonts.body,
                        }}
                      >
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex flex-col items-end justify-end lg:col-span-5 lg:pl-4">
            {/* Image - Constrained width */}
            <div className="relative w-full max-w-[380px]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <Image
                  src={aboutUsData.imageUrl}
                  alt={aboutUsData.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
                {/* Subtle Gradient Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
