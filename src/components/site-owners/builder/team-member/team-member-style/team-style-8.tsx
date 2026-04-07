"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, ChevronRight, X, Users, AlertCircle } from "lucide-react";
import { TeamData } from "@/types/owner-site/components/team";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { TeamCard8 } from "../team-member-card/team-card-8";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TeamStyle8Props {
  data: TeamData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<TeamData>) => void;
}

export function TeamStyle8({
  data: teamData,
  isEditable = false,
  onUpdate,
}: TeamStyle8Props) {
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

  const { data, handleTextUpdate } = useBuilderLogic(
    teamData,
    onUpdate
  );

  const { data: members = [], isLoading, error } = useTeamMembers();
  const [selectedMember, setSelectedMember] = useState<TEAM | null>(null);

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

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-3/4 rounded-3xl" />
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Team</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load team members."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && members.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <TeamCard8
                key={member.id}
                member={member}
                index={index}
                onClick={() => setSelectedMember(member)}
                theme={theme}
                isEditable={isEditable}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && members.length === 0 && (
          <div className="py-20 text-center">
            <Users className="text-gray-300 mx-auto mb-6 h-20 w-20" />
            <h3 className="text-gray-900 mb-4 text-2xl font-semibold">No Team Members</h3>
            <p className="text-gray-500">Add team members in the admin panel to see them here.</p>
          </div>
        )}

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
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    isEditable={false} // Dynamic data, not editable here
                    onImageChange={() => {}}
                    className="h-full w-full object-cover"
                    width={800}
                    height={1000}
                  />
                </div>

                <div className="w-full md:w-3/5 p-8 md:p-16 overflow-y-auto max-h-[70vh] md:max-h-[85vh]">
                  <h3
                    className="text-4xl md:text-6xl font-medium mb-4 tracking-tight text-gray-950"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    {selectedMember.name}
                  </h3>
                  <p className="text-xl text-gray-500 mb-8" style={{ fontFamily: theme.fonts.body }}>
                    {selectedMember.role}
                  </p>
                  
                  <div className="space-y-8">
                    <div>
                      <h4
                        className="text-2xl font-medium mb-4 text-gray-900"
                        style={{ fontFamily: theme.fonts.heading }}
                      >
                        About
                      </h4>
                      <p
                        className="text-gray-600 text-lg leading-relaxed"
                        style={{ fontFamily: theme.fonts.body }}
                      >
                        {selectedMember.about || "No biography available."}
                      </p>
                    </div>

                    {(selectedMember.email || selectedMember.linkedin) && (
                      <div>
                        <h4
                          className="text-2xl font-medium mb-4 text-gray-900"
                          style={{ fontFamily: theme.fonts.heading }}
                        >
                          Connect
                        </h4>
                        <div className="flex gap-4">
                           {selectedMember.email && (
                             <a href={`mailto:${selectedMember.email}`} className="text-gray-500 hover:text-gray-900 transition-colors">
                               Email
                             </a>
                           )}
                           {selectedMember.linkedin && (
                             <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                               LinkedIn
                             </a>
                           )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

