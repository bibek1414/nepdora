"use client";
import React from "react";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { TeamCard6 } from "../team-member-card/team-card-6";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Users } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import {
  TeamComponentData,
  defaultTeamData,
} from "@/types/owner-site/components/team";

const CARD6_TITLE_FALLBACK =
  'Meet the Beautiful team behind <span class="text-indigo-500 italic">Optimo</span>';
const CARD6_SUBTITLE_FALLBACK = "[Team Member]";

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
  const { title: rawTitle, subtitle: rawSubtitle } = data || {};
  const title = rawTitle ?? "Meet Our Team";
  const subtitle = rawSubtitle;

  const { data: members = [], isLoading, error } = useTeamMembers();

  const shouldUseCard6TitleFallback =
    rawTitle === undefined ||
    rawTitle === null ||
    rawTitle === defaultTeamData.title;
  const shouldUseCard6SubtitleFallback =
    rawSubtitle === undefined ||
    rawSubtitle === null ||
    rawSubtitle === defaultTeamData.subtitle;

  const resolvedTitle = shouldUseCard6TitleFallback
    ? CARD6_TITLE_FALLBACK
    : title;
  const resolvedSubtitle = shouldUseCard6SubtitleFallback
    ? CARD6_SUBTITLE_FALLBACK
    : subtitle;

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 flex flex-col items-center gap-6 text-center">
          <EditableText
            value={resolvedSubtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="inline-flex w-auto items-center rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-slate-500 uppercase"
            isEditable={isEditable}
            placeholder="[Team Member]"
          />
          <EditableText
            value={resolvedTitle || ""}
            onChange={handleTitleChange}
            as="h2"
            className="text-4xl leading-tight font-semibold text-slate-900 sm:text-5xl"
            isEditable={isEditable}
            placeholder="Meet the Beautiful team behind Optimo"
            multiline={true}
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map(member => (
              <div
                key={member.id}
                className="relative transform cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => !isEditable && onMemberClick?.(member.id)}
              >
                {isEditable && (
                  <div className="absolute inset-0 z-10 bg-transparent" />
                )}
                <TeamCard6 member={member} />
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
