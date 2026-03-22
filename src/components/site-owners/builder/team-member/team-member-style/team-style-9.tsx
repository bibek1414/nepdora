"use client";
import React from "react";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Users } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { motion } from "framer-motion";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { TeamCard9 } from "../team-member-card/team-card-9";

interface TeamStyleProps {
  data: TeamComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TeamComponentData["data"]>) => void;
  onMemberClick?: (memberId: number) => void;
}

export const TeamStyle9: React.FC<TeamStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
  onMemberClick,
}) => {
  const { data: localData, handleTextUpdate } = useBuilderLogic(data, onUpdate);

  const { title = "Meet Our Team", subtitle, tag = "[Our Team]" } = localData;

  const { data: members = [], isLoading, error } = useTeamMembers();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <EditableText
            value={tag}
            onChange={handleTextUpdate("tag")}
            as="span"
            className="mb-3 block text-xs font-semibold tracking-widest text-gray-400 uppercase"
            isEditable={isEditable}
            placeholder="Section tag..."
          />
          <EditableText
            value={title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          {subtitle && (
            <EditableText
              value={subtitle}
              onChange={handleTextUpdate("subtitle")}
              as="p"
              className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg"
              isEditable={isEditable}
              placeholder="Enter subtitle..."
              multiline={true}
            />
          )}
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-[340px] w-full rounded-2xl" />
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
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {members.map((member, idx) => (
              <TeamCard9
                key={member.id ?? idx}
                member={member}
                isEditable={isEditable}
                onClick={() => {
                  if (!isEditable && member.id) {
                    onMemberClick?.(member.id);
                  }
                }}
              />
            ))}
          </motion.div>
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
