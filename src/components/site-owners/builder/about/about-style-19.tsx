"use client";

import React, { useRef, useState, useEffect } from "react";
import { Search, Puzzle, Rocket } from "lucide-react";
import { AboutUs19Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate19Props {
  aboutUsData: AboutUs19Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs19Data>) => void;
  siteUser?: string;
}

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Search,
  Puzzle,
  Rocket,
};

export function AboutUsTemplate19({
  aboutUsData,
  isEditable = false,
  onUpdate,
}: AboutUsTemplate19Props) {
  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#2563EB",
    },
  };

  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startPoint = windowHeight * 0.8;
      const totalHeight = rect.height;
      const scrolled = startPoint - rect.top;
      const percentage = Math.min(
        1,
        Math.max(0, scrolled / (totalHeight * 0.8))
      );

      setProgress(percentage);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStepUpdate = (stepId: string, field: string, value: string) => {
    handleArrayItemUpdate("steps", stepId)({ [field]: value });
  };

  // Helper to render italic word in title
  const renderTitle = () => {
    const { title, italicWord } = data;
    if (!italicWord || !title.includes(italicWord)) {
      return title;
    }
    const parts = title.split(italicWord);
    return (
      <>
        {parts[0]}
        <em className="italic">{italicWord}</em>
        {parts[1]}
      </>
    );
  };

  return (
    <section ref={sectionRef} className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left Column - Sticky Header */}
          <div className="mb-12 h-fit lg:sticky lg:top-32 lg:mb-0">
            <EditableText
              value={data.sectionTag}
              onChange={handleTextUpdate("sectionTag")}
              isEditable={isEditable}
              className="mb-4 block text-sm font-medium"
              style={{ color: theme.colors.primary }}
            />
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {isEditable ? (
                <EditableText
                  value={data.title}
                  onChange={handleTextUpdate("title")}
                  isEditable={isEditable}
                />
              ) : (
                renderTitle()
              )}
            </h2>
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              isEditable={isEditable}
              className="mb-8 max-w-md text-gray-500"
            />
          </div>

          {/* Right Column - Steps with Timeline */}
          <div className="relative pl-8 md:pl-12">
            {/* Background Line */}
            <div className="absolute top-8 bottom-20 left-[15px] w-0.5 bg-gray-100 md:left-[19px]"></div>

            {/* Active Blue Line */}
            <div
              className="absolute top-8 left-[15px] w-0.5 transition-all duration-100 ease-out md:left-[19px]"
              style={{
                height: `calc(${progress * 100}% - 60px)`,
                backgroundColor: theme.colors.primary,
              }}
            ></div>

            <div className="space-y-12">
              {data.steps.map((step, idx) => {
                const threshold = idx / (data.steps.length - 0.5);
                const isActive = progress > threshold;
                const IconComponent = iconMap[step.icon] || Search;

                return (
                  <div
                    key={step.id}
                    className={`relative transition-all duration-500 ${
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-50"
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`absolute top-6 -left-[41px] h-4 w-4 rounded-full border-4 transition-colors duration-500 md:-left-[45px] ${
                        isActive
                          ? "scale-125 bg-white"
                          : "border-gray-100 bg-gray-100"
                      }`}
                      style={{
                        borderColor: isActive
                          ? theme.colors.primary
                          : undefined,
                      }}
                    ></div>

                    <div
                      className={`group relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 ${
                        isActive
                          ? "bg-white shadow-lg"
                          : "border-gray-50 bg-gray-50"
                      }`}
                      style={{
                        borderColor: isActive
                          ? theme.colors.primary + "4D"
                          : undefined,
                      }}
                    >
                      <div
                        className="absolute top-4 right-4 rounded-md px-2 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: theme.colors.primary + "1A",
                          color: theme.colors.primary,
                        }}
                      >
                        <EditableText
                          value={step.stepNumber}
                          onChange={value =>
                            handleStepUpdate(step.id, "stepNumber", value)
                          }
                          isEditable={isEditable}
                        />
                      </div>

                      <div
                        className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-500 ${
                          isActive
                            ? "text-white shadow-lg"
                            : "bg-gray-200 text-gray-500"
                        }`}
                        style={
                          isActive
                            ? {
                                backgroundColor: theme.colors.primary,
                                boxShadow: `0 10px 15px -3px ${theme.colors.primary}33`,
                              }
                            : undefined
                        }
                      >
                        <IconComponent size={20} />
                      </div>

                      <h3 className="mb-3 text-xl font-bold text-gray-900">
                        <EditableText
                          value={step.title}
                          onChange={value =>
                            handleStepUpdate(step.id, "title", value)
                          }
                          isEditable={isEditable}
                        />
                      </h3>

                      <p className="text-sm leading-relaxed text-gray-500">
                        <EditableText
                          value={step.description}
                          onChange={value =>
                            handleStepUpdate(step.id, "description", value)
                          }
                          isEditable={isEditable}
                        />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
