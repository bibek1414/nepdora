"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AboutUs2Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";

interface AboutUsTemplate2Props {
  aboutUsData: AboutUs2Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs2Data>) => void;
}

export function AboutUsTemplate2({
  aboutUsData,
  isEditable = false,
  onUpdate,
}: AboutUsTemplate2Props) {
  const [data, setData] = useState(aboutUsData);

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs2Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs2Data>);
  };

  // Handle team member updates
  const handleTeamMemberUpdate =
    (memberId: string, field: string) => (value: string) => {
      const updatedTeamMembers = data.teamMembers.map(member =>
        member.id === memberId ? { ...member, [field]: value } : member
      );
      const updatedData = { ...data, teamMembers: updatedTeamMembers };
      setData(updatedData);
      onUpdate?.({ teamMembers: updatedTeamMembers });
    };

  // Handle team member image updates
  const handleTeamMemberImageUpdate =
    (memberId: string) => (imageUrl: string, altText?: string) => {
      const updatedTeamMembers = data.teamMembers.map(member =>
        member.id === memberId
          ? { ...member, imageUrl, imageAlt: altText || member.name }
          : member
      );
      const updatedData = { ...data, teamMembers: updatedTeamMembers };
      setData(updatedData);
      onUpdate?.({ teamMembers: updatedTeamMembers });
    };

  return (
    <section className="bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-foreground mb-3 text-3xl font-bold md:text-4xl"
            isEditable={isEditable}
            placeholder="Enter main title..."
          />

          <EditableText
            value={data.subtitle}
            onChange={handleTextUpdate("subtitle")}
            as="p"
            className="text-primary mb-4 text-lg font-semibold"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
          />

          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            className="text-muted-foreground leading-relaxed"
            isEditable={isEditable}
            placeholder="Enter description..."
            multiline={true}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.teamMembers.map(member => (
            <Card
              key={member.id}
              className="transform overflow-hidden text-center transition-transform hover:scale-105 hover:shadow-xl"
            >
              <CardHeader className="p-0">
                <EditableImage
                  src={member.imageUrl}
                  alt={member.name || member.name}
                  onImageChange={handleTeamMemberImageUpdate(member.id)}
                  onAltChange={alt =>
                    handleTeamMemberUpdate(member.id, "imageAlt")(alt)
                  }
                  isEditable={isEditable}
                  className="h-64 w-full object-cover object-center"
                  width={400}
                  height={400}
                  cloudinaryOptions={{
                    folder: "team-member-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 400,
                    height: 400,
                    text: "Upload team member photo",
                  }}
                />
              </CardHeader>
              <CardContent className="p-6">
                <EditableText
                  value={member.name}
                  onChange={handleTeamMemberUpdate(member.id, "name")}
                  as="h3"
                  className="text-foreground text-xl font-semibold"
                  isEditable={isEditable}
                  placeholder="Enter name..."
                />

                <EditableText
                  value={member.role}
                  onChange={handleTeamMemberUpdate(member.id, "role")}
                  as="p"
                  className="text-primary font-medium"
                  isEditable={isEditable}
                  placeholder="Enter role..."
                />

                {(member.bio || isEditable) && (
                  <EditableText
                    value={member.bio || ""}
                    onChange={handleTeamMemberUpdate(member.id, "bio")}
                    as="p"
                    className="text-muted-foreground mt-2 text-sm"
                    isEditable={isEditable}
                    placeholder="Enter bio..."
                    multiline={true}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
