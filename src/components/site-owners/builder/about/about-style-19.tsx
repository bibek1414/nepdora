"use client";

import React, { useRef, useState, useEffect } from "react";
import { Search, Puzzle, Rocket } from "lucide-react";
import { AboutUs19Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";

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
  const [data, setData] = useState(aboutUsData);
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

  const handleTextUpdate = (field: keyof AboutUs19Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs19Data>);
  };

  const handleStepUpdate = (stepId: string, field: string, value: string) => {
    const updatedSteps = data.steps.map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    );
    const updatedData = { ...data, steps: updatedSteps };
    setData(updatedData);
    onUpdate?.({ steps: updatedSteps });
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
              className="mb-4 block text-sm font-medium text-blue-600"
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
              className="bg-primary absolute top-8 left-[15px] w-0.5 transition-all duration-100 ease-out md:left-[19px]"
              style={{ height: `calc(${progress * 100}% - 60px)` }}
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
                          ? "scale-125 border-blue-600 bg-white"
                          : "border-gray-100 bg-gray-100"
                      }`}
                    ></div>

                    <div
                      className={`group relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 ${
                        isActive
                          ? "border-blue-200 bg-white shadow-lg"
                          : "border-gray-50 bg-gray-50"
                      }`}
                    >
                      <div className="absolute top-4 right-4 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
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
                            ? "bg-primary text-white shadow-lg shadow-blue-600/20"
                            : "bg-gray-200 text-gray-500"
                        }`}
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
