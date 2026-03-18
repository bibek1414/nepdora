"use client";
import React from "react";
import {
  useTeamMembers,
  useUpdateTeamMember,
} from "@/hooks/owner-site/admin/use-team-member";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Users } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { motion } from "framer-motion";
import Image from "next/image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

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
  const { data: localData, handleTextUpdate } = useBuilderLogic(
    data,
    onUpdate
  );

  const { title = "Meet Our Team", subtitle, tag = "[Our Team]" } = localData;

  const { data: members = [], isLoading, error } = useTeamMembers();
  const updateTeamMember = useUpdateTeamMember();

  const handleMemberUpdate = (memberId: number, memberData: Partial<TEAM>) => {
    const formData = new FormData();
    if (memberData.name) formData.append("name", memberData.name);
    if (memberData.role) formData.append("role", memberData.role);
    updateTeamMember.mutate({ id: memberId, memberData: formData });
  };


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
              <motion.div
                key={member.id ?? idx}
                className="group relative aspect-4/5 cursor-pointer overflow-hidden rounded-2xl"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => {
                  if (!isEditable && member.id) {
                    onMemberClick?.(member.id);
                  }
                }}
              >
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={400}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <Users className="h-16 w-16 text-gray-400" />
                  </div>
                )}

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Name/Role card on hover */}
                <div className="absolute right-6 bottom-6 left-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-center justify-between rounded-xl bg-gray-900/90 p-4 text-white backdrop-blur-sm">
                    <div>
                      <EditableText
                        value={member.name}
                        onChange={newName =>
                          handleMemberUpdate(member.id, { name: newName })
                        }
                        as="h4"
                        className="text-lg leading-tight font-bold text-white"
                        isEditable={isEditable}
                        placeholder="Member name..."
                      />
                      <EditableText
                        value={member.role}
                        onChange={newRole =>
                          handleMemberUpdate(member.id, { role: newRole })
                        }
                        as="p"
                        className="mt-0.5 text-xs text-gray-300"
                        isEditable={isEditable}
                        placeholder="Member role..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
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
