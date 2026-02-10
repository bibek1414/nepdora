"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { TeamCard7 } from "../team-member-card/team-card-7";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Map,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TeamComponentData } from "@/types/owner-site/components/team";

interface TeamStyleProps {
  data: TeamComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TeamComponentData["data"]>) => void;
}

export const TeamStyle7: React.FC<TeamStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { title = "Meet Our Team", subtitle = "OUR TEAM" } = data || {};
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);

  const { data: members = [], isLoading, error } = useTeamMembers();
  const activeMember = members.find(m => m.id === activeMemberId) || members[0];

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-12">
      {/* Background decoration lines */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden opacity-[0.03]">
        <svg width="100%" height="100%">
          <circle
            cx="0%"
            cy="50%"
            r="40%"
            stroke={theme.colors.primary}
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="0%"
            cy="50%"
            r="50%"
            stroke={theme.colors.primary}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="container mx-auto grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <div
            className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
            style={{ color: theme.colors.primary }}
          >
            <Map size={14} />
            <EditableText
              value={subtitle}
              onChange={handleSubtitleChange}
              as="span"
              isEditable={isEditable}
              placeholder="OUR TEAM"
              style={{ fontFamily: theme.fonts.body }}
            />
          </div>
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="mb-12 text-4xl leading-tight font-bold md:text-5xl"
            isEditable={isEditable}
            placeholder="Meet Our Team"
          />

          <div className="space-y-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to load members.</AlertDescription>
              </Alert>
            ) : (
              members
                .slice(0, 3)
                .map(member => (
                  <TeamCard7
                    key={member.id}
                    member={member}
                    isActive={activeMember?.id === member.id}
                    onClick={() => setActiveMemberId(member.id)}
                  />
                ))
            )}
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[500px] w-full overflow-hidden rounded-[40px] bg-gray-200">
            {activeMember ? (
              <Image
                src={activeMember.photo}
                alt={activeMember.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No active member
              </div>
            )}

            {/* Social Links overlay */}
            {activeMember && (
              <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-white/90 px-6 py-2 backdrop-blur-sm">
                {activeMember.facebook && (
                  <a
                    href={activeMember.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 transition-colors hover:text-blue-600"
                  >
                    <Facebook size={18} />
                  </a>
                )}
                {activeMember.instagram && (
                  <a
                    href={activeMember.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 transition-colors hover:text-pink-600"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {activeMember.linkedin && (
                  <a
                    href={activeMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 transition-colors hover:text-blue-700"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {activeMember.twitter && (
                  <a
                    href={activeMember.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 transition-colors hover:text-black"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {activeMember.email && (
                  <a
                    href={`mailto:${activeMember.email}`}
                    className="text-gray-700 transition-colors hover:text-red-500"
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
