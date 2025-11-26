"use client";
import React, { useState } from "react";
import { AboutUs12Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { ArrowRight, Map } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate12Props {
  aboutUsData: AboutUs12Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs12Data>) => void;
}

export function AboutUsTemplate12({
  aboutUsData,
  isEditable = false,
  onUpdate,
}: AboutUsTemplate12Props) {
  const [data, setData] = useState(aboutUsData);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(
    data.teamMembers[0]?.id || null
  );
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#84cc16",
      primaryForeground: "#FFFFFF",
      secondary: "#013D2F",
      secondaryForeground: "#FFFFFF",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs12Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs12Data>);
  };

  // Handle image updates
  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      imageUrl,
      imageAlt: updatedData.imageAlt,
    });
  };

  // Handle alt text updates
  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
  };

  // Handle team member updates
  const handleMemberUpdate =
    (memberId: string, field: "name" | "role") => (value: string) => {
      const updatedMembers = data.teamMembers.map(member =>
        member.id === memberId ? { ...member, [field]: value } : member
      );
      const updatedData = { ...data, teamMembers: updatedMembers };
      setData(updatedData);
      onUpdate?.({ teamMembers: updatedMembers });
    };

  return (
    <div
      className="relative px-4 py-16 sm:px-6 lg:px-12"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Background decoration lines */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden opacity-[0.03]">
        <svg width="100%" height="100%">
          <circle
            cx="0"
            cy="50%"
            r="40%"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="0"
            cy="50%"
            r="50%"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="container mx-auto grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <div
            className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
            style={{ color: theme.colors.text, opacity: 0.6 }}
          >
            <Map size={14} />
            <EditableText
              value={data.sectionTag}
              onChange={handleTextUpdate("sectionTag")}
              as="span"
              isEditable={isEditable}
              placeholder="OUR COACHING"
            />
          </div>
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="mb-12 text-4xl leading-tight font-bold md:text-5xl"
            style={{
              color: theme.colors.secondary,
              fontFamily: theme.fonts.heading,
            }}
            isEditable={isEditable}
            placeholder="Exploring the Unknown Voyages of Wonder"
          />

          <div className="space-y-6">
            {data.teamMembers.map((member, idx) => {
              const isActive = activeMemberId === member.id;
              return (
                <div
                  key={member.id}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border bg-white p-6 shadow-sm transition-colors"
                  style={{
                    borderColor: isActive
                      ? theme.colors.primary
                      : "rgba(0,0,0,0.1)",
                  }}
                  onClick={() => setActiveMemberId(member.id)}
                  onMouseEnter={e => {
                    if (!isActive)
                      e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onMouseLeave={e => {
                    if (!isActive)
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                  }}
                >
                  <div>
                    <EditableText
                      value={member.name}
                      onChange={handleMemberUpdate(member.id, "name")}
                      as="h4"
                      className="font-bold"
                      style={{ color: theme.colors.secondary }}
                      isEditable={isEditable}
                      placeholder="Name"
                    />
                    <div
                      className="mt-1 text-xs"
                      style={{ color: theme.colors.text, opacity: 0.6 }}
                    >
                      <EditableText
                        value={member.role}
                        onChange={handleMemberUpdate(member.id, "role")}
                        as="span"
                        isEditable={isEditable}
                        placeholder="Role"
                      />
                    </div>
                  </div>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                    style={{
                      backgroundColor: isActive
                        ? theme.colors.primary
                        : "transparent",
                      color: isActive
                        ? theme.colors.primaryForeground
                        : "rgba(0,0,0,0.3)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: isActive
                        ? theme.colors.primary
                        : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[500px] w-full overflow-hidden rounded-[40px] bg-gray-200">
            <EditableImage
              src={data.imageUrl}
              alt={data.imageAlt}
              onImageChange={handleImageUpdate}
              onAltChange={handleAltUpdate}
              isEditable={isEditable}
              className="h-full w-full object-cover"
              width={800}
              height={600}
              cloudinaryOptions={{
                folder: "about-us-images",
                resourceType: "image",
              }}
              showAltEditor={isEditable}
            />

            {/* Social Links overlay */}
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-white/90 px-6 py-2 backdrop-blur-sm">
              {["X", "f", "O", "in"].map((social, i) => (
                <span
                  key={i}
                  className="cursor-pointer text-xs font-bold transition-colors"
                  style={{ color: theme.colors.secondary }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = theme.colors.primary)
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = theme.colors.secondary)
                  }
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
