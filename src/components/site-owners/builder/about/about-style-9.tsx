"use client";
import React from "react";
import { AboutUs9Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate9Props {
  aboutUsData: AboutUs9Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs9Data>) => void;
}

export const AboutUsTemplate9: React.FC<AboutUsTemplate9Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(aboutUsData, onUpdate);

  const handleStatUpdate =
    (id: string, field: "label" | "value") => (newValue: string) => {
      const updatedStats = data.stats.map(stat =>
        stat.id === id ? { ...stat, [field]: newValue } : stat
      );
      onUpdate?.({ stats: updatedStats });
    };

  return (
    <section className="section-padding bg-white py-32 text-black">
      <div className="mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2">
        <div>
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            as="p"
            className="mb-4 font-mono text-sm tracking-widest uppercase opacity-70"
            isEditable={isEditable}
          />
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="mb-6 text-3xl font-bold tracking-tight md:text-4xl"
            isEditable={isEditable}
          />
          <div className="space-y-4 leading-relaxed opacity-80">
            <EditableText
              value={data.description1}
              onChange={handleTextUpdate("description1")}
              as="p"
              isEditable={isEditable}
              multiline
            />
            <EditableText
              value={data.description2}
              onChange={handleTextUpdate("description2")}
              as="p"
              isEditable={isEditable}
              multiline
            />
            <EditableText
              value={data.description3}
              onChange={handleTextUpdate("description3")}
              as="p"
              isEditable={isEditable}
              multiline
            />
          </div>
        </div>

        <div className="space-y-6 border border-black p-8">
          {data.stats.map(stat => (
            <div
              key={stat.id}
              className="flex items-center justify-between border-b border-black/10 pb-4 last:border-0 last:pb-0"
            >
              <EditableText
                value={stat.label}
                onChange={handleStatUpdate(stat.id, "label")}
                as="span"
                className="text-sm opacity-70"
                isEditable={isEditable}
              />
              <EditableText
                value={stat.value}
                onChange={handleStatUpdate(stat.id, "value")}
                as="span"
                className="font-mono text-2xl font-bold"
                isEditable={isEditable}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
