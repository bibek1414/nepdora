"use client";

import React, { useState, useEffect } from "react";
import { OthersTemplate4Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ChevronRight } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface OthersTemplate4Props {
  othersData: OthersTemplate4Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate4Data>) => void;
}

const SquiggleIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      width="52"
      height="10"
      viewBox="0 0 52 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#a)" fill="currentColor">
        <path d="M47.21 2.078c-.8.223-1.622.357-2.451.399l-6.684.724a23 23 0 0 0-4.45.963c-.79.266-1.55.613-2.266 1.036q-1.166.786-2.419 1.422a3.7 3.7 0 0 1-1.607.346 2.55 2.55 0 0 1-1.628-.718c-.844-.87-1.076-1.926-1.628-2.604a1.63 1.63 0 0 0-.963-.664 2.24 2.24 0 0 0-1.262.086 4.08 4.08 0 0 0-2.146 1.807c-.578.857-1.03 1.834-1.688 2.75a5.3 5.3 0 0 1-2.697 2.12 3.24 3.24 0 0 1-1.78 0 3.9 3.9 0 0 1-1.489-.83 6.9 6.9 0 0 1-1.747-2.539c-.385-.89-.664-1.754-1.05-2.51a4.65 4.65 0 0 0-5.514-2.658 4.18 4.18 0 0 0-2.697 2.146A5.16 5.16 0 0 0 .446 6.01a4.8 4.8 0 0 0 .372 1.72c.153.386.259.579.226.605-.034.027-.193-.14-.419-.505a4.3 4.3 0 0 1-.591-1.787 5.3 5.3 0 0 1 .478-2.956A4.8 4.8 0 0 1 3.535.483a5.63 5.63 0 0 1 4.797.784 5.74 5.74 0 0 1 1.754 2.146c.431.83.737 1.708 1.116 2.538a5.9 5.9 0 0 0 1.515 2.166 2.41 2.41 0 0 0 2.318.585 4.33 4.33 0 0 0 2.12-1.708c.578-.804 1.03-1.78 1.66-2.724a7 7 0 0 1 1.136-1.328c.457-.397.988-.7 1.562-.89a3.4 3.4 0 0 1 1.84-.1 2.7 2.7 0 0 1 1.541 1.036c.705.944.944 1.993 1.515 2.518.26.26.604.418.97.445.404.003.803-.083 1.17-.252q1.204-.597 2.331-1.329a12.2 12.2 0 0 1 2.46-1.07 22.4 22.4 0 0 1 4.65-.87c2.857-.24 5.149-.312 6.743-.392a11.2 11.2 0 0 1 2.479.04" />
        <path d="M45.476 6.203c-.053-.14.665-.531 1.748-1.182a37 37 0 0 0 1.88-1.196c.345-.233.664-.492 1.063-.758q.256-.175.471-.398a1.3 1.3 0 0 0 .28-.412c.033-.126 0-.12 0-.166a.66.66 0 0 0-.346-.166l-1.289-.346a32 32 0 0 1-2.18-.664C45.869.516 45.112.197 45.158.058c.047-.14.844-.086 2.126.126.665.106 1.395.253 2.233.425l1.328.293c.34.061.651.229.89.478.149.168.243.376.273.598a1.3 1.3 0 0 1-.066.604 2.2 2.2 0 0 1-.519.798 3.4 3.4 0 0 1-.624.505c-.386.279-.778.525-1.15.75q-.997.597-2.072 1.037c-1.236.518-2.047.664-2.1.531" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h52v9.866H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const BackgroundPath: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="pointer-events-none absolute top-0 right-0 h-full w-full overflow-visible opacity-20 lg:opacity-100">
      <svg
        viewBox="0 0 1616 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-0 bottom-0 h-full w-auto min-w-[100vw] translate-x-[10%] translate-y-[20%] lg:min-w-[1616px] lg:translate-x-0 lg:translate-y-[10%]"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M1613.77 916.215c-36.6-104.787-145.1-171.692-254.91-187.975s-221.3 9.84-327.62 41.723c-106.321 31.883-212.161 70.025-322.819 78.794s-229.883-16.191-308.566-94.505c-54.111-53.889-88.265-131.261-157.366-163.809-62.53-29.428-135.693-13.569-203.742-1.606-68.05 11.963-145.846 16.966-198.48-27.692-53.428-45.36-60.148-129.379-31.717-193.44s84.572-111.416 142.708-150.554S71.848 144.265 122.82 96.154c50.972-48.11 90.184-114.85 84.923-184.726-5.262-69.877-67.588-136.837-137.206-128.733"
          stroke={color}
          strokeWidth="3.009"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeDasharray="6.3 11.82"
        />
      </svg>
    </div>
  );
};

interface FloatingCardProps {
  label: string;
  isEditable?: boolean;
  onUpdate?: (newLabel: string) => void;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  label,
  isEditable,
  onUpdate,
}) => {
  return (
    <div className="flex min-w-[140px] transform cursor-default items-center gap-3 rounded-xl border border-gray-100 bg-white p-2.5 shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-transform hover:scale-105">
      <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
      <EditableText
        value={label}
        onChange={onUpdate || (() => {})}
        isEditable={isEditable}
        className="pr-2 text-sm font-medium whitespace-nowrap"
        style={{ color: "#034833" }}
      />
    </div>
  );
};

export const OthersTemplate4: React.FC<OthersTemplate4Props> = ({
  othersData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#034833",
      primary: "#84CC16",
      primaryForeground: "#FFFFFF",
      secondary: "#034833",
      secondaryForeground: "#FFFFFF",
      background: "#EDE8E3",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const { data, handleTextUpdate, handleButtonUpdate, getImageUrl } =
    useBuilderLogic(othersData, onUpdate);

  const handleCountryCardUpdate = (index: number, value: string) => {
    const newCards = [...data.countryCards];
    newCards[index] = { ...newCards[index], label: value };
    onUpdate?.({ countryCards: newCards });
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor:
          data.backgroundType === "color"
            ? data.backgroundColor
            : theme.colors.background,
        backgroundImage:
          data.backgroundType === "image"
            ? `url(${data.backgroundImageUrl})`
            : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
      }}
    >
      <BackgroundPath color={theme.colors.primary} />

      <div className="relative mx-auto flex min-h-[85vh] max-w-[1200px] items-center px-6 py-8 lg:px-8 lg:py-12">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Text Content */}
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-3">
              <EditableText
                value={data.subHeading}
                onChange={handleTextUpdate("subHeading")}
                isEditable={isEditable}
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}
              />
              <div className="w-12" style={{ color: theme.colors.text }}>
                <SquiggleIcon className="h-auto w-full" />
              </div>
            </div>

            <EditableText
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              isEditable={isEditable}
              as="h1"
              className="text-4xl leading-[1.1] font-bold tracking-tight whitespace-pre-line lg:text-6xl"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
              }}
            />

            <div className="pt-2">
              {data.buttons.length > 0 && (
                <button
                  className="group inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:opacity-90"
                  style={{
                    borderColor: theme.colors.text,
                    color: theme.colors.text,
                  }}
                >
                  <EditableLink
                    text={data.buttons[0].text}
                    href={data.buttons[0].href || "#"}
                    isEditable={isEditable}
                    siteUser={siteUser}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[0].id,
                        text,
                        href
                      )
                    }
                    className="inline-flex items-center gap-2"
                  />
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Phone Mockup & Floating Cards */}
          <div className="relative flex justify-center py-8 lg:justify-end lg:py-0 lg:pr-10">
            {/* Phone Container */}
            <div className="relative h-[540px] w-[280px] sm:h-[580px] sm:w-[300px]">
              {/* Phone Frame */}
              <div
                className="relative z-10 h-full w-full overflow-hidden rounded-[2.5rem] border-[6px] bg-gray-100 shadow-xl"
                style={{ borderColor: theme.colors.primary }}
              >
                {/* Screen Content Placeholder */}
                <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-200"></div>
              </div>

              {/* Floating Cards */}
              {/* Germany (Top Left) */}
              {data.countryCards[0] && (
                <div
                  className="animate-float absolute top-[12%] -left-[15%] z-20 sm:-left-[20%]"
                  style={{ animationDelay: "0s" }}
                >
                  <FloatingCard
                    label={data.countryCards[0].label}
                    isEditable={isEditable}
                    onUpdate={val => handleCountryCardUpdate(0, val)}
                  />
                </div>
              )}

              {/* South Korea (Top Right) */}
              {data.countryCards[1] && (
                <div
                  className="animate-float absolute top-[12%] -right-[15%] z-20 sm:-right-[20%]"
                  style={{ animationDelay: "1.2s" }}
                >
                  <FloatingCard
                    label={data.countryCards[1].label}
                    isEditable={isEditable}
                    onUpdate={val => handleCountryCardUpdate(1, val)}
                  />
                </div>
              )}

              {/* South Africa (Middle Left) */}
              {data.countryCards[2] && (
                <div
                  className="animate-float absolute top-[42%] -left-[20%] z-20 sm:-left-[30%]"
                  style={{ animationDelay: "2.5s" }}
                >
                  <FloatingCard
                    label={data.countryCards[2].label}
                    isEditable={isEditable}
                    onUpdate={val => handleCountryCardUpdate(2, val)}
                  />
                </div>
              )}

              {/* Turkey (Bottom Left) */}
              {data.countryCards[3] && (
                <div
                  className="animate-float absolute bottom-[18%] -left-[15%] z-20 sm:-left-[22%]"
                  style={{ animationDelay: "0.8s" }}
                >
                  <FloatingCard
                    label={data.countryCards[3].label}
                    isEditable={isEditable}
                    onUpdate={val => handleCountryCardUpdate(3, val)}
                  />
                </div>
              )}

              {/* Indonesia (Bottom Right) */}
              {data.countryCards[4] && (
                <div
                  className="animate-float absolute -right-[15%] bottom-[18%] z-20 sm:-right-[22%]"
                  style={{ animationDelay: "1.8s" }}
                >
                  <FloatingCard
                    label={data.countryCards[4].label}
                    isEditable={isEditable}
                    onUpdate={val => handleCountryCardUpdate(4, val)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
