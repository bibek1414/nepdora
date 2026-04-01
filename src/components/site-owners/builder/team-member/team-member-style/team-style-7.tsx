"use client";

import { Users, AlertCircle } from "lucide-react";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { hexToRgba } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { TeamCard11 } from "../team-member-card/team-card-11";

interface TeamStyleProps {
  data: TeamComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TeamComponentData["data"]>) => void;
  onMemberClick?: (memberId: number) => void;
}

export const TeamStyle7: React.FC<TeamStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
  onMemberClick,
}) => {
  const {
    title = "Dedicated volunteers driving our mission for change",
    subtitle = "Our Team",
  } = data || {};
  const { data: members = [], isLoading, error } = useTeamMembers();
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      text: "#0F172A",
      background: "#FFFFFF",
    },
    fonts: {
      heading: "Poppins",
      body: "Inter",
    },
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const displayMembers = members;

  return (
    <section className="w-full py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <EditableText
            as="h2"
            value={title}
            onChange={handleTitleChange}
            isEditable={isEditable}
            style={{ fontFamily: theme.fonts.heading }}
            className="mx-auto max-w-2xl text-4xl leading-tight font-bold text-gray-900 md:text-5xl"
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
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

        {!isLoading && !error && displayMembers.length > 0 && (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {displayMembers.slice(0, 4).map((member, index) => (
              <TeamCard11
                key={member.id}
                member={member}
                index={index}
                onClick={() =>
                  !isEditable && onMemberClick?.(Number(member.id))
                }
              />
            ))}
          </div>
        )}

        {!isLoading && !error && displayMembers.length === 0 && (
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
