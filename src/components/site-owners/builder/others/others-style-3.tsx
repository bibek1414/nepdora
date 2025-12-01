"use client";

import React, { useEffect, useState } from "react";
import { OthersTemplate3Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import {
  ShieldCheck,
  BarChart3,
  Scale,
  Users,
  Award,
  FileText,
  UserCheck,
} from "lucide-react";

interface OthersTemplate3Props {
  othersData: OthersTemplate3Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate3Data>) => void;
}

const Squiggle = ({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) => (
  <svg
    width="52"
    height="10"
    viewBox="0 0 52 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
  >
    <g clipPath="url(#clip0_squiggle)">
      <path
        d="M47.21 2.078c-.8.223-1.623.357-2.452.399l-6.684.724a23 23 0 0 0-4.45.963A12 12 0 0 0 31.357 5.2q-1.166.786-2.419 1.422a3.7 3.7 0 0 1-1.607.346 2.54 2.54 0 0 1-1.628-.718c-.844-.87-1.076-1.926-1.628-2.604a1.63 1.63 0 0 0-.963-.664 2.24 2.24 0 0 0-1.262.086 4.08 4.08 0 0 0-2.146 1.807c-.578.857-1.03 1.834-1.688 2.75a5.3 5.3 0 0 1-2.697 2.12 3.24 3.24 0 0 1-1.78 0 3.9 3.9 0 0 1-1.489-.83 6.9 6.9 0 0 1-1.747-2.539c-.385-.89-.664-1.754-1.05-2.51A4.65 4.65 0 0 0 3.74 1.207a4.18 4.18 0 0 0-2.697 2.146A5.16 5.16 0 0 0 .445 6.01a4.8 4.8 0 0 0 .372 1.72c.153.386.259.579.226.605-.034.027-.193-.14-.419-.505a4.3 4.3 0 0 1-.591-1.787A5.3 5.3 0 0 1 .51 3.088 4.8 4.8 0 0 1 3.534.483a5.63 5.63 0 0 1 4.797.784 5.74 5.74 0 0 1 1.754 2.146c.431.83.737 1.708 1.116 2.538a5.9 5.9 0 0 0 1.515 2.166 2.41 2.41 0 0 0 2.318.585 4.33 4.33 0 0 0 2.12-1.708c.578-.804 1.03-1.78 1.66-2.724a7 7 0 0 1 1.137-1.328c.456-.397.987-.7 1.56-.89a3.4 3.4 0 0 1 1.841-.1 2.7 2.7 0 0 1 1.541 1.036c.705.944.944 1.993 1.515 2.518.26.26.604.418.97.445.404.003.803-.083 1.17-.252q1.204-.597 2.331-1.329a12.2 12.2 0 0 1 2.458-1.07 22.4 22.4 0 0 1 4.651-.87c2.857-.24 5.149-.312 6.743-.392a11.2 11.2 0 0 1 2.478.04"
        fill="currentColor"
      />
      <path
        d="M45.476 6.203c-.053-.14.665-.531 1.748-1.182a37 37 0 0 0 1.88-1.196c.345-.233.664-.492 1.063-.758q.256-.175.471-.398a1.3 1.3 0 0 0 .28-.412c.033-.126 0-.12 0-.166a.66.66 0 0 0-.346-.166l-1.289-.346a32 32 0 0 1-2.18-.664C45.869.516 45.112.197 45.158.058c.047-.14.844-.086 2.126.126.665.106 1.395.253 2.233.425l1.328.293c.34.061.651.229.89.478.149.168.243.376.273.598a1.3 1.3 0 0 1-.066.604 2.2 2.2 0 0 1-.519.798 3.4 3.4 0 0 1-.624.505c-.386.279-.778.525-1.15.75q-.997.597-2.072 1.037c-1.236.518-2.047.664-2.1.531"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_squiggle">
        <rect width="52" height="9.866" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const iconComponents = [ShieldCheck, BarChart3, Scale];

export const OthersTemplate3: React.FC<OthersTemplate3Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(othersData);
  const { data: themeResponse } = useThemeQuery();

  useEffect(() => {
    setData(othersData);
  }, [othersData]);

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#034833",
      primaryForeground: "#FFFFFF",
      secondary: "#83CD20",
      secondaryForeground: "#1F2937",
      background: "#F3F5F4",
    },
    fonts: {
      body: "Plus Jakarta Sans",
      heading: "Plus Jakarta Sans",
    },
  };

  const handleUpdate = (newData: Partial<OthersTemplate3Data>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  const handleProcessItemUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newItems = [...data.processItems];
    newItems[index] = { ...newItems[index], [field]: value };
    handleUpdate({ processItems: newItems });
  };

  const handleStatUpdate = (
    index: number,
    field: "value" | "label",
    value: string
  ) => {
    const newStats = [...data.statistics];
    newStats[index] = { ...newStats[index], [field]: value };
    handleUpdate({ statistics: newStats });
  };

  return (
    <section
      className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8"
      style={{
        backgroundColor:
          data.backgroundType === "color"
            ? data.backgroundColor || theme.colors.background
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
      <div className="container mx-auto max-w-6xl">
        {/* Wrapper so bottom card overlaps main card like in design */}
        <div className="relative pb-32 md:pb-40 lg:pb-44">
          {/* Top Process Section */}
          <div className="relative rounded-[40px] bg-white px-6 py-12 shadow-sm sm:px-10 md:px-16 md:py-16">
            {/* Left gray block */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[32%] rounded-[32px] bg-[#E6E7EA]" />

            <div className="relative z-10">
              {/* Section header */}
              <div className="mb-12 flex flex-col items-center text-center">
                <div className="mb-4 flex items-center gap-3">
                  <Squiggle
                    className="text-[color:var(--process-accent,#034833)]"
                    flip
                  />
                  <EditableText
                    value={data.processLabel}
                    onChange={val => handleUpdate({ processLabel: val })}
                    isEditable={isEditable}
                    className="text-xs font-semibold tracking-[0.1em] uppercase"
                    style={{ color: theme.colors.primary }}
                  />
                  <Squiggle className="text-[color:var(--process-accent,#034833)]" />
                </div>

                <EditableText
                  value={data.heading}
                  onChange={val => handleUpdate({ heading: val })}
                  isEditable={isEditable}
                  as="h2"
                  className="max-w-[700px] text-center text-3xl leading-tight font-bold md:text-[40px] lg:text-[48px]"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors.primary,
                  }}
                />
              </div>

              {/* Process cards */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {data.processItems.map((item, index) => {
                  const Icon = iconComponents[index % iconComponents.length];
                  const number = (index + 1).toString().padStart(2, "0");

                  return (
                    <div
                      key={item.id}
                      className="relative flex h-full flex-col items-start rounded-[20px] border border-[#E3DBD8] bg-white p-7 transition-shadow hover:shadow-lg"
                    >
                      <div className="mb-4 flex w-full items-start gap-4">
                        <div
                          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border bg-white"
                          style={{ borderColor: theme.colors.secondary }}
                        >
                          <Icon
                            className="h-7 w-7"
                            strokeWidth={1.5}
                            style={{ color: theme.colors.secondary }}
                          />
                        </div>
                        <div className="pt-1">
                          <span className="mb-1 block text-sm font-semibold text-[#727272]">
                            {number}
                          </span>
                          <EditableText
                            value={item.title}
                            onChange={val =>
                              handleProcessItemUpdate(index, "title", val)
                            }
                            isEditable={isEditable}
                            as="h3"
                            className="text-lg leading-snug font-semibold"
                            style={{ color: theme.colors.primary }}
                          />
                        </div>
                      </div>
                      <EditableText
                        value={item.description}
                        onChange={val =>
                          handleProcessItemUpdate(index, "description", val)
                        }
                        isEditable={isEditable}
                        className="text-sm leading-7 text-[#727272]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Success & Stats Section - overlapping & centered */}
          <div
            className="absolute bottom-0 left-1/2 w-full max-w-[900px] -translate-x-1/2 translate-y-1/2 overflow-hidden rounded-[30px] px-8 py-10 shadow-lg md:rounded-[40px] md:px-14 md:py-14 lg:px-20 lg:py-16"
            style={{ backgroundColor: theme.colors.secondary }}
          >
            {/* Background waves */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <svg
                className="h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 1290 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M-50 100 C 300 150, 600 -50, 1340 100"
                  stroke="white"
                  strokeWidth="0.8"
                />
                <path
                  d="M-50 150 C 350 200, 650 0, 1340 150"
                  stroke="white"
                  strokeWidth="0.8"
                />
                <path
                  d="M-50 200 C 400 250, 700 50, 1340 200"
                  stroke="white"
                  strokeWidth="0.8"
                />
                <path
                  d="M-50 250 C 450 300, 750 100, 1340 250"
                  stroke="white"
                  strokeWidth="0.8"
                />
                <path
                  d="M-50 300 C 500 350, 800 150, 1340 300"
                  stroke="white"
                  strokeWidth="0.8"
                />
                <path
                  d="M-50 350 C 550 400, 850 200, 1340 350"
                  stroke="white"
                  strokeWidth="0.8"
                />
                <path
                  d="M-50 400 C 600 450, 900 250, 1340 400"
                  stroke="white"
                  strokeWidth="0.8"
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
              {/* Left copy */}
              <div className="w-full lg:w-[45%]">
                <div className="mb-3 flex items-center gap-3">
                  <EditableText
                    value={data.successLabel}
                    onChange={val => handleUpdate({ successLabel: val })}
                    isEditable={isEditable}
                    className="text-xs font-semibold tracking-[0.1em] uppercase"
                    style={{ color: "#FFFFFF" }}
                  />
                  <Squiggle className="text-white" />
                </div>

                <EditableText
                  value={data.successHeading}
                  onChange={val => handleUpdate({ successHeading: val })}
                  isEditable={isEditable}
                  as="h3"
                  className="mb-4 text-3xl leading-tight font-bold md:text-[40px] lg:text-[44px]"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: "#FFFFFF",
                  }}
                />

                <EditableText
                  value={data.successDescription}
                  onChange={val => handleUpdate({ successDescription: val })}
                  isEditable={isEditable}
                  className="max-w-md text-sm leading-7 text-white/90"
                />
              </div>

              {/* Right stats grid */}
              <div className="w-full lg:w-[55%]">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {data.statistics.map((stat, index) => {
                    const StatIcon =
                      index === 0
                        ? Users
                        : index === 1
                          ? Award
                          : index === 2
                            ? FileText
                            : UserCheck;

                    return (
                      <div
                        key={stat.id}
                        className="flex items-center gap-4 rounded-[20px] border border-white/80 bg-white/5 px-6 py-5 backdrop-blur-sm transition-colors hover:bg-white/10"
                      >
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white">
                          <StatIcon
                            className="h-7 w-7"
                            strokeWidth={2.4}
                            style={{ color: theme.colors.primary }}
                          />
                        </div>
                        <div>
                          <EditableText
                            value={stat.value}
                            onChange={val =>
                              handleStatUpdate(index, "value", val)
                            }
                            isEditable={isEditable}
                            as="h4"
                            className="text-3xl leading-none font-bold md:text-[40px]"
                            style={{ color: "#FFFFFF" }}
                          />
                          <EditableText
                            value={stat.label}
                            onChange={val =>
                              handleStatUpdate(index, "label", val)
                            }
                            isEditable={isEditable}
                            className="mt-1 text-sm text-white/90"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
