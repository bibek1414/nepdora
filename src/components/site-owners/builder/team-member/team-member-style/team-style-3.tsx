"use client";
import React from "react";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { TeamCard3 } from "../team-member-card/team-card-3";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Users } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TeamComponentData } from "@/types/owner-site/components/team";

interface TeamStyleProps {
  data: TeamComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TeamComponentData["data"]>) => void;
  onMemberClick?: (memberId: number) => void;
}

export const TeamStyle3: React.FC<TeamStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onMemberClick,
}) => {
  const { title = "Meet Our Team", subtitle } = data || {};
  const { data: members = [], isLoading, error } = useTeamMembers();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-4xl font-bold tracking-tight"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto max-w-3xl text-xl"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {members.map(member => (
              <div
                key={member.id}
                className="relative transform cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => !isEditable && onMemberClick?.(member.id)}
              >
                {isEditable && (
                  <div className="absolute inset-0 z-10 bg-transparent" />
                )}
                <TeamCard3 member={member} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && members.length === 0 && (
          <div className="py-16 text-center">
            <Users className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Team Members
            </h3>
            <p className="text-muted-foreground">
              Our team page is currently being updated. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
