"use client";
import React from "react";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { TeamCard5 } from "../team-member-card/team-card-5";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Users } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface TeamStyleProps {
  data: TeamComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TeamComponentData["data"]>) => void;
  onMemberClick?: (memberId: number) => void;
}

export const TeamStyle1: React.FC<TeamStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onMemberClick,
}) => {
  const { title = "Meet Our Team", subtitle = "Team Members" } = data || {};
  const { data: members = [], isLoading, error , refetch } = useTeamMembers();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <EditableText
            value={subtitle}
            onChange={handleSubtitleChange}
            as="p"
            className="mb-2 text-lg font-semibold"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
          />
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h1"
            className="text-5xl font-bold"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-[280px] w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {members.map(member => (
              <div
                key={member.id}
                className="relative transform cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => !isEditable && onMemberClick?.(member.id)}
              >
                {isEditable && (
                  <div className="absolute inset-0 z-10 bg-transparent" />
                )}
                <TeamCard5 member={member} />
              </div>
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
      </div>
    </section>
  );
};
