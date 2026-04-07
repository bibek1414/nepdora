"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, ChevronRight, X } from "lucide-react";
import { TeamStyle8Data } from "@/types/owner-site/components/team";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface TeamTemplate8Props {
  data: TeamStyle8Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<TeamStyle8Data>) => void;
}

export function TeamTemplate8({
  data: teamData,
  isEditable = false,
  onUpdate,
}: TeamTemplate8Props) {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#2563EB",
      primaryForeground: "#FFFFFF",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  };

  const { data, handleArrayItemUpdate, handleTextUpdate } = useBuilderLogic(
    teamData,
    onUpdate
  );

  const [selectedMember, setSelectedMember] = useState<(typeof data.members)[0] | null>(null);

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <EditableText
              as="h2"
              value={data.title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              className="text-5xl md:text-7xl font-medium tracking-tight mb-6 text-gray-950"
              style={{ fontFamily: theme.fonts.heading }}
            />
          </div>
          <div className="max-w-md">
            <EditableText
              as="p"
              value={data.title_description || ""}
              onChange={handleTextUpdate("title_description")}
              isEditable={isEditable}
              className="text-lg text-gray-600 leading-relaxed"
              style={{ fontFamily: theme.fonts.body }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.members?.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              isEditable={isEditable}
              onUpdate={handleArrayItemUpdate("members", member.id)}
              onClick={() => setSelectedMember(member)}
              theme={theme}
            />
          ))}
        </div>

        <AnimatePresence>
          {selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMember(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row aspect-3/4 md:aspect-auto"
              >
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-8 right-8 z-10 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>

                <div className="w-full md:w-2/5 relative aspect-3/4 md:aspect-auto">
                  <EditableImage
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    isEditable={isEditable}
                    onImageChange={url => {
                      const updatedMember = { ...selectedMember, image: url };
                      handleArrayItemUpdate("members", selectedMember.id)({ image: url });
                      setSelectedMember(updatedMember);
                    }}
                    className="h-full w-full object-cover"
                    width={800}
                    height={1000}
                  />
                </div>

                <div className="w-full md:w-3/5 p-8 md:p-16 overflow-y-auto max-h-[70vh] md:max-h-[85vh]">
                  <h3
                    className="text-4xl md:text-6xl font-medium mb-8 tracking-tight text-gray-950"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    About me
                  </h3>
                  <EditableText
                    as="p"
                    value={selectedMember.about}
                    onChange={val => {
                      const updatedMember = { ...selectedMember, about: val };
                      handleArrayItemUpdate("members", selectedMember.id)({ about: val });
                      setSelectedMember(updatedMember);
                    }}
                    isEditable={isEditable}
                    className="text-gray-600 text-lg leading-relaxed mb-12"
                    style={{ fontFamily: theme.fonts.body }}
                  />

                  <h3
                    className="text-4xl md:text-6xl font-medium mb-8 tracking-tight text-gray-950"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    My experience
                  </h3>
                  <EditableText
                    as="p"
                    value={selectedMember.experience}
                    onChange={val => {
                      const updatedMember = { ...selectedMember, experience: val };
                      handleArrayItemUpdate("members", selectedMember.id)({ experience: val });
                      setSelectedMember(updatedMember);
                    }}
                    isEditable={isEditable}
                    className="text-gray-600 text-lg leading-relaxed mb-8"
                    style={{ fontFamily: theme.fonts.body }}
                  />

                  <ul className="space-y-4">
                    {selectedMember.highlights.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 text-gray-600 text-lg leading-relaxed"
                        style={{ fontFamily: theme.fonts.body }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-3 shrink-0" />
                        <EditableText
                          value={item}
                          onChange={val => {
                            const newHighlights = [...selectedMember.highlights];
                            newHighlights[i] = val;
                            const updatedMember = { ...selectedMember, highlights: newHighlights };
                            handleArrayItemUpdate("members", selectedMember.id)({ highlights: newHighlights });
                            setSelectedMember(updatedMember);
                          }}
                          isEditable={isEditable}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function MemberCard({
  member,
  index,
  isEditable,
  onUpdate,
  onClick,
  theme,
}: {
  member: any;
  index: number;
  isEditable: boolean;
  onUpdate: (updated: any) => void;
  onClick: () => void;
  theme: any;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative aspect-3/4 rounded-3xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <EditableImage
        src={member.image}
        alt={member.name}
        isEditable={isEditable}
        onImageChange={url => onUpdate({ image: url })}
        className={`h-full w-full object-cover transition-transform duration-700 ${
          isHovered ? "scale-110" : "scale-100"
        }`}
        width={600}
        height={800}
      />
      
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 p-8 transition-all duration-500 ${
          isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 md:opacity-100 md:translate-y-0"
        }`}
      >
        <EditableText
          value={member.name}
          onChange={val => onUpdate({ name: val })}
          isEditable={isEditable}
          className="text-2xl font-medium text-white mb-1"
          style={{ fontFamily: theme.fonts.heading }}
        />
        <EditableText
          value={member.role}
          onChange={val => onUpdate({ role: val })}
          isEditable={isEditable}
          className="text-white/70 text-sm"
          style={{ fontFamily: theme.fonts.body }}
        />
      </div>

      <div
        className={`absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
          isHovered ? "scale-100" : "scale-0 md:scale-100 md:opacity-0"
        }`}
      >
        {isHovered ? (
          <ChevronRight className="w-6 h-6 text-gray-900" />
        ) : (
          <Plus className="w-6 h-6 text-gray-900" />
        )}
      </div>
    </motion.div>
  );
}
