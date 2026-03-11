"use client";
import React from "react";
import { AboutUs20Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate20Props {
  aboutUsData: AboutUs20Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs20Data>) => void;
}

export const AboutUsTemplate20: React.FC<AboutUsTemplate20Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(aboutUsData, onUpdate);

  const handleStatUpdate = (id: string, field: "label" | "value") => (newValue: string) => {
    const updatedStats = data.stats.map(stat => 
      stat.id === id ? { ...stat, [field]: newValue } : stat
    );
    onUpdate?.({ stats: updatedStats });
  };

  return (
    <section className="section-padding bg-white text-black h-150 py-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            as="p"
            className="font-mono text-sm tracking-widest uppercase mb-4 opacity-70"
            isEditable={isEditable}
          />
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-6"
            isEditable={isEditable}
          />
          <div className="space-y-4 opacity-80 leading-relaxed">
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

        <div className="border border-black p-8 space-y-6">
          {data.stats.map((stat) => (
            <div key={stat.id} className="flex items-center justify-between border-b border-black/10 pb-4 last:border-0 last:pb-0">
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
                className="text-2xl font-bold font-mono"
                isEditable={isEditable}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
