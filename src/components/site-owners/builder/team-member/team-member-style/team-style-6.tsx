"use client";
import React from "react";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditableText } from "@/components/ui/editable-text";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { TeamCard10 } from "../team-member-card/team-card-10";
import { AlertCircle, Users } from "lucide-react";

interface TeamStyleProps {
  data: TeamComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TeamComponentData["data"]>) => void;
  onMemberClick?: (memberId: number) => void;
}

export const TeamStyle6: React.FC<TeamStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onMemberClick,
}) => {
  const {
    title = "Meet Our Travel Experts",
    subtitle = "",
    tag = "Our Team",
  } = data || {};
  const { data: members = [], isLoading, error, refetch } = useTeamMembers();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleTagChange = (newTag: string) => {
    onUpdate?.({ tag: newTag });
  };

  return (
    <section className="overflow-hidden px-6 py-32 md:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header - "Our Team" left, heading+description right */}
        <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-2">
            <EditableText
              value={tag}
              onChange={handleTagChange}
              as="span"
              className="mt-2 block font-serif text-base text-[#1A1A1A]/55 italic"
              isEditable={isEditable}
              placeholder="Tag..."
            />
          </div>
          <div className="md:col-span-6 md:col-start-7 md:text-right">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="mb-6 font-serif text-4xl leading-tight font-normal text-[#1A1A1A] md:text-5xl"
              isEditable={isEditable}
              placeholder="Heading..."
            />
            <EditableText
              value={subtitle}
              onChange={handleSubtitleChange}
              as="p"
              className="ml-auto max-w-lg text-base leading-relaxed text-[#1A1A1A]/60"
              isEditable={isEditable}
              placeholder="Description..."
            />
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-full ${i % 2 === 0 ? "lg:translate-y-4" : "lg:-translate-y-2"}`}
              >
                <Skeleton className="aspect-[3/4.2] w-full rounded-[50%_50%_50%_50%/40%_40%_40%_40%]" />
              </div>
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
          <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {members.slice(0, 4).map((member: TEAM, index: number) => (
              <div
                key={member.id}
                className={`w-full ${
                  index % 2 === 0 ? "lg:translate-y-4" : "lg:-translate-y-2"
                }`}
              >
                <TeamCard10
                  member={member}
                  isEditable={isEditable}
                  onMemberClick={onMemberClick}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Users}
            title="No Team Members Found"
            description="Introduce your team to your visitors. Add team members from the admin dashboard."
            actionLabel="Add New Team"
            actionLink="/admin/team-member"
            isEditable={isEditable}
            isEmpty={members.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
