"use client";

import React from "react";
import { Users, AlertCircle } from "lucide-react";
import { TeamData } from "@/types/owner-site/components/team";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface TeamStyle9Props {
  data: TeamData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<TeamData>) => void;
  onMemberClick?: (memberId: number) => void;
}

/**
 * @beautifulMention: Team Style 9
 * A premium editorial layout with a split header and 4-column grid.
 * Features a decorative eyebrow line and high-contrast typography.
 */
export function TeamStyle9({
  data: teamData,
  isEditable = false,
  onUpdate,
  onMemberClick,
}: TeamStyle9Props) {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate } = useBuilderLogic(teamData, onUpdate);
  const { data: members = [], isLoading, error, refetch } = useTeamMembers();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-8 py-24 md:py-32">
        {/* Header Grid */}
        <div className="mb-16 grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-4">
              <EditableText
                value={data.subtitle || "Team"}
                onChange={handleTextUpdate("subtitle")}
                isEditable={isEditable}
                as="span"
                className="text-sm font-semibold tracking-wide text-gray-500"
                style={{
                  fontFamily: theme?.fonts?.body,
                }}
              />
            </div>
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              as="title"
              style={{
                fontFamily: theme?.fonts?.heading,
              }}
              multiline
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <EditableText
              value={data.title_description || ""}
              onChange={handleTextUpdate("title_description")}
              isEditable={isEditable}
              as="p"
              className="text-lg leading-relaxed text-pretty text-gray-600"
              style={{
                fontFamily: theme?.fonts?.body,
              }}
              multiline
            />
          </div>
        </div>

        {/* Team Grid */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-8">
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
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {members.map(member => (
              <div
                key={member.id}
                className={`group ${!isEditable ? "cursor-pointer" : ""}`}
                onClick={() => !isEditable && onMemberClick?.(member.id)}
              >
                <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
                  <EditableImage
                    src={member.photo}
                    alt={member.name}
                    isEditable={false} // Dynamic data
                    onImageChange={() => {}}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3
                  className="font-display text-lg text-gray-950"
                  style={{ fontFamily: theme?.fonts?.heading }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: theme?.fonts?.body }}
                >
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Users}
            title="No Team Members Found"
            description="Add your team members from the dashboard to display them here."
            actionLabel="Add New Team"
            actionLink="/admin/ourteam/"
            isEditable={isEditable}
            isEmpty={members.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
}
