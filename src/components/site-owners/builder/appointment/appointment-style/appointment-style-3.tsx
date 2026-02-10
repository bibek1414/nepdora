"use client";
import React from "react";
import { AppointmentForm3 } from "../appointment-card/appointment-template-3";
import { EditableText } from "@/components/ui/editable-text";
import {
  AppointmentComponentData,
  AppointmentData,
} from "@/types/owner-site/components/appointment";

interface AppointmentStyleProps {
  data: AppointmentComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<AppointmentComponentData["data"]>) => void;
}

export const AppointmentStyle3: React.FC<AppointmentStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { title = "Book an Appointment", subtitle } = data || {};

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleDataChange = (newData: AppointmentData) => {
    onUpdate?.(newData);
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
          {subtitle !== undefined && (
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="text-muted-foreground mx-auto max-w-3xl text-xl"
              isEditable={isEditable}
              placeholder="Enter subtitle..."
              multiline={true}
            />
          )}
        </div>

        <AppointmentForm3
          data={data}
          siteUser={isEditable ? undefined : siteUser}
          isPreview={isEditable}
          isEditable={isEditable}
          onDataChange={isEditable ? handleDataChange : undefined}
        />
      </div>
    </section>
  );
};
