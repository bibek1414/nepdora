"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AboutUs3Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";

interface AboutUsTemplate3Props {
  aboutUsData: AboutUs3Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs3Data>) => void;
}

export const AboutUsTemplate3: React.FC<AboutUsTemplate3Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(aboutUsData);

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs3Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs3Data>);
  };

  // Handle stats updates
  const handleStatsUpdate =
    (field: "startYear" | "completeYear" | "unitsAvailable") =>
    (value: string) => {
      const updatedStats = { ...data.stats, [field]: value };
      const updatedData = { ...data, stats: updatedStats };
      setData(updatedData);
      onUpdate?.({ stats: updatedStats });
    };

  // Handle features updates
  const handleFeatureUpdate = (featureId: string) => (value: string) => {
    const updatedFeatures = data.features.map(feature =>
      feature.id === featureId ? { ...feature, text: value } : feature
    );
    const updatedData = { ...data, features: updatedFeatures };
    setData(updatedData);
    onUpdate?.({ features: updatedFeatures });
  };

  return (
    <section id="about" className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid items-center gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="h-px w-20 bg-gradient-to-r from-green-400 to-emerald-600 sm:w-32"></div>
              <h2 className="text-3xl leading-tight font-light text-black sm:text-4xl lg:text-5xl xl:text-6xl">
                <EditableText
                  value={data.title}
                  onChange={handleTextUpdate("title")}
                  as="span"
                  className="block"
                  isEditable={isEditable}
                  placeholder="Enter title..."
                />
                <br />
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="span"
                  className="block bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text font-normal text-transparent"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <EditableText
                  value={data.stats.startYear}
                  onChange={handleStatsUpdate("startYear")}
                  as="div"
                  className="text-2xl font-bold text-black sm:text-3xl"
                  isEditable={isEditable}
                  placeholder="Year"
                />
                <div className="text-xs tracking-wider text-gray-500 sm:text-sm">
                  START
                </div>
              </div>
              <div className="space-y-2">
                <EditableText
                  value={data.stats.completeYear}
                  onChange={handleStatsUpdate("completeYear")}
                  as="div"
                  className="text-2xl font-bold text-black sm:text-3xl"
                  isEditable={isEditable}
                  placeholder="Year"
                />
                <div className="text-xs tracking-wider text-gray-500 sm:text-sm">
                  COMPLETE
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-4 sm:space-y-6">
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="text-base leading-relaxed text-gray-600 sm:text-lg"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />

              <div className="space-y-3 sm:space-y-4">
                {data.features.map(feature => (
                  <div
                    key={feature.id}
                    className="flex items-center space-x-3 sm:space-x-4"
                  >
                    <div className="h-2 w-2 bg-black"></div>
                    <EditableText
                      value={feature.text}
                      onChange={handleFeatureUpdate(feature.id)}
                      as="span"
                      className="text-sm text-gray-700 sm:text-base"
                      isEditable={isEditable}
                      placeholder="Enter feature..."
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 sm:pt-8">
              <div className="inline-flex items-center space-x-2 text-xs tracking-wider text-gray-500 sm:text-sm">
                <EditableText
                  value={data.stats.unitsAvailable}
                  onChange={handleStatsUpdate("unitsAvailable")}
                  as="span"
                  isEditable={isEditable}
                  placeholder="Number"
                />
                <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                <span>AVAILABLE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
