"use client";

import React, { useEffect, useState } from "react";
import { OthersTemplate3Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { BarChart3, Scale, ShieldCheck } from "lucide-react";

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

const iconPalette = ["#83CD20", "#83CD20", "#83CD20"];

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
      background: "#F1F5F1",
    },
    fonts: {
      body: "Plus Jakarta Sans",
      heading: "Plus Jakarta Sans",
    },
  };

  const handleUpdate = (newData: Partial<OthersTemplate3Data>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    onUpdate?.(updatedData);
  };

  const handleProcessUpdate = (
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
      className="relative w-full px-4 py-16 sm:px-6 lg:px-10"
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
      }}
    >
      <div className="pointer-events-none absolute top-8 -left-32 hidden h-[520px] w-[380px] rounded-[50px] bg-[#D8DCD3] sm:block lg:-left-10" />

      <div className="relative mx-auto max-w-[1200px] rounded-[50px] bg-white px-6 py-14 shadow-sm sm:px-10 lg:px-20">
        {/* Process Header */}
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-[#034833]">
            <Squiggle className="h-2.5 w-12 text-[#034833]" flip />
            <EditableText
              value={data.processLabel}
              onChange={val => handleUpdate({ processLabel: val })}
              isEditable={isEditable}
              className="text-xs font-semibold tracking-[0.2em]"
              style={{
                letterSpacing: "0.2em",
                color: "#034833",
                fontFamily: theme.fonts.body,
              }}
            />
            <Squiggle className="h-2.5 w-12 text-[#034833]" />
          </div>

          <EditableText
            value={data.heading}
            onChange={val => handleUpdate({ heading: val })}
            isEditable={isEditable}
            as="h2"
            className="mx-auto max-w-3xl text-3xl leading-tight font-bold text-[#034833] sm:text-4xl lg:text-[50px] lg:leading-[60px]"
            style={{ fontFamily: theme.fonts.heading }}
          />
        </div>

        {/* Process Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {data.processItems.map((item, index) => {
            const Icon =
              iconComponents[index % iconComponents.length] || ShieldCheck;
            return (
              <div
                key={item.id}
                className="rounded-[20px] border border-[#E3DBD8] p-6 shadow-[0px_24px_70px_rgba(3,72,51,0.05)]"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#83CD20]">
                    <Icon
                      className="h-10 w-10 text-[#83CD20]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="text-lg font-semibold text-[#727272]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <EditableText
                  value={item.title}
                  onChange={val => handleProcessUpdate(index, "title", val)}
                  isEditable={isEditable}
                  as="h3"
                  className="mb-3 text-2xl font-semibold text-[#034833]"
                />

                <EditableText
                  value={item.description}
                  onChange={val =>
                    handleProcessUpdate(index, "description", val)
                  }
                  isEditable={isEditable}
                  className="text-base leading-7 text-[#727272]"
                />
              </div>
            );
          })}
        </div>

        {/* Success Story */}
        <div className="mt-16 rounded-[30px] bg-[#83CD20] p-8 text-white md:p-12">
          <div className="relative overflow-hidden rounded-[30px]">
            <div className="absolute inset-0 -z-10 opacity-30">
              <div
                className="h-full w-full rounded-[30px]"
                style={{
                  backgroundImage:
                    "repeating-radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), rgba(255,255,255,0.5) 2px, transparent 2px, transparent 30px)",
                }}
              />
            </div>

            <div className="relative grid gap-10 rounded-[30px] bg-[#83CD20]/95 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
              <div>
                <div className="mb-4 flex items-center gap-3 text-white">
                  <Squiggle className="h-2.5 w-12 text-white" flip />
                  <EditableText
                    value={data.successLabel}
                    onChange={val => handleUpdate({ successLabel: val })}
                    isEditable={isEditable}
                    className="text-xs font-semibold tracking-[0.2em] text-white"
                    style={{ letterSpacing: "0.2em" }}
                  />
                  <Squiggle className="h-2.5 w-12 text-white" />
                </div>

                <EditableText
                  value={data.successHeading}
                  onChange={val => handleUpdate({ successHeading: val })}
                  isEditable={isEditable}
                  as="h3"
                  className="mb-6 text-3xl leading-tight font-bold text-white md:text-[50px] md:leading-[60px]"
                  style={{ fontFamily: theme.fonts.heading }}
                />

                <EditableText
                  value={data.successDescription}
                  onChange={val => handleUpdate({ successDescription: val })}
                  isEditable={isEditable}
                  className="text-base leading-7 text-white/85"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {data.statistics.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="rounded-[20px] border border-white/50 p-6 backdrop-blur-[2px]"
                  >
                    <EditableText
                      value={stat.value}
                      onChange={val => handleStatUpdate(index, "value", val)}
                      isEditable={isEditable}
                      as="h4"
                      className="text-3xl font-bold text-white md:text-[42px]"
                    />
                    <EditableText
                      value={stat.label}
                      onChange={val => handleStatUpdate(index, "label", val)}
                      isEditable={isEditable}
                      className="mt-2 text-sm font-medium tracking-wide text-white/80 uppercase"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
