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
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

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

  const { data, handleTextUpdate } = useBuilderLogic(teamData, onUpdate);

  const { data: members = [], isLoading, error , refetch } = useTeamMembers();
  const [selectedMember, setSelectedMember] = useState<TEAM | null>(null);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-20 flex flex-col items-end justify-between gap-8 lg:flex-row">
          <div className="max-w-xl">
            <EditableText
              as="h2"
              value={data.title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              className="mb-6 text-5xl font-medium tracking-tight text-gray-950 md:text-7xl"
              style={{ fontFamily: theme.fonts.heading }}
            />
          </div>
          <div className="max-w-md">
            <EditableText
              as="p"
              value={data.title_description || ""}
              onChange={handleTextUpdate("title_description")}
              isEditable={isEditable}
              className="text-lg leading-relaxed text-gray-600"
              style={{ fontFamily: theme.fonts.body }}
            />
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              {error instanceof Error
                ? error.message
                : "Failed to load team members."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && members.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Users}
            title="No Team Members"
            description="Introduce your team to your visitors. Add team members from the admin dashboard."
            actionLabel="Add New Team"
            actionLink="/admin/team-member"
            isEditable={isEditable}
          isEmpty={members.length === 0}
          onRefresh={refetch}
          />
        )}

        <AnimatePresence>
          {selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMember(null)}
                className="absolute inset-0 cursor-pointer bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative flex aspect-3/4 w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl md:aspect-auto md:flex-row"
              >
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-8 right-8 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                >
                  <X className="h-6 w-6 text-gray-900" />
                </button>

                <div className="relative aspect-3/4 w-full md:aspect-auto md:w-2/5">
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

                <div className="max-h-[70vh] w-full overflow-y-auto p-8 md:max-h-[85vh] md:w-3/5 md:p-16">
                  <h3
                    className="mb-4 text-4xl font-medium tracking-tight text-gray-950 md:text-6xl"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    {selectedMember.name}
                  </h3>
                  <p
                    className="mb-8 text-xl text-gray-500"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {selectedMember.role}
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h4
                        className="mb-4 text-2xl font-medium text-gray-900"
                        style={{ fontFamily: theme.fonts.heading }}
                      >
                        About
                      </h4>
                      <p
                        className="text-lg leading-relaxed text-gray-600"
                        style={{ fontFamily: theme.fonts.body }}
                      >
                        {selectedMember.about || "No biography available."}
                      </p>
                    </div>

                    {(selectedMember.email || selectedMember.linkedin) && (
                      <div>
                        <h4
                          className="mb-4 text-2xl font-medium text-gray-900"
                          style={{ fontFamily: theme.fonts.heading }}
                        >
                          Connect
                        </h4>
                        <div className="flex gap-4">
                          {selectedMember.email && (
                            <a
                              href={`mailto:${selectedMember.email}`}
                              className="text-gray-500 transition-colors hover:text-gray-900"
                            >
                              Email
                            </a>
                          )}
                          {selectedMember.linkedin && (
                            <a
                              href={selectedMember.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 transition-colors hover:text-gray-900"
                            >
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
