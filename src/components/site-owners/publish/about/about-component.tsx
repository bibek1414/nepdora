"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AboutUsComponentData,
  AboutUsData,
  AboutUs1Data,
  AboutUs2Data,
  AboutUs3Data,
  AboutUs4Data,
  AboutUs5Data,
  AboutUs6Data,
  AboutUs7Data,
  AboutUs8Data,
  AboutUs9Data,
  AboutUs10Data,
  UpdateAboutUsRequest,
} from "@/types/owner-site/components/about";
import { AboutUsTemplate1 } from "./about-style-1";
import { AboutUsTemplate2 } from "./about-style-2";
import { AboutUsTemplate3 } from "./about-style-3";
import { AboutUsTemplate4 } from "./about-style-4";
import { AboutUsTemplate5 } from "./about-style-5";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { toast } from "sonner";
import { AboutUsTemplate6 } from "./about-style-6";
import { AboutUsTemplate7 } from "./about-style-7";

import { AboutUsTemplate8 } from "./about-style-8";
import { AboutUsTemplate9 } from "./about-style-9";
import { AboutUsTemplate10 } from "./about-style-10";

interface AboutUsComponentProps {
  component: AboutUsComponentData;
  isEditable?: boolean;
  pageSlug: string;
}

export const AboutUsComponent: React.FC<AboutUsComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteAboutUsMutation = useDeleteComponentMutation(pageSlug, "about");
  const updateAboutUsMutation = useUpdateComponentMutation(pageSlug, "about");

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();
    deleteAboutUsMutation.mutate(componentId);
  };

  const handleUpdate = (updatedData: Partial<AboutUsData>) => {
    const componentId = component.component_id || component.id.toString();
    const mergedData = { ...component.data, ...updatedData };

    updateAboutUsMutation.mutate(
      { componentId, data: mergedData as UpdateAboutUsRequest["data"] },
      {
        onSuccess: () => {
          toast.success("About Us component updated.");
        },
        onError: error => {
          if (error instanceof Error) {
            toast.error(`Failed to update: ${error.message}`);
          } else {
            toast.error("Failed to update: Unknown error");
          }
        },
      }
    );
  };

  const renderTemplate = () => {
    if (!component.data) {
      return (
        <div className="p-8 text-center text-red-500">
          Error: Component data missing.
        </div>
      );
    }

    switch (component.data.template) {
      case "about-1":
        return (
          <AboutUsTemplate1
            aboutUsData={component.data as AboutUs1Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );

      case "about-2":
        return (
          <AboutUsTemplate2
            aboutUsData={component.data as AboutUs2Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );

      case "about-3":
        return (
          <AboutUsTemplate3
            aboutUsData={component.data as AboutUs3Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );
      case "about-4":
        return (
          <AboutUsTemplate4
            aboutUsData={component.data as AboutUs4Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );
      case "about-5":
        return (
          <AboutUsTemplate5
            aboutUsData={component.data as AboutUs5Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );
      case "about-6":
        return (
          <AboutUsTemplate6
            aboutUsData={component.data as AboutUs6Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );
      case "about-7":
        return (
          <AboutUsTemplate7
            aboutUsData={component.data as AboutUs7Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );
      case "about-8":
        return (
          <AboutUsTemplate8
            aboutUsData={component.data as AboutUs8Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );
      case "about-9":
        return (
          <AboutUsTemplate9
            aboutUsData={component.data as AboutUs9Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );
      case "about-10":
        return (
          <AboutUsTemplate10
            aboutUsData={component.data as AboutUs10Data}
            isEditable={isEditable}
            onUpdate={handleUpdate}
          />
        );
      default:
        const exhaustiveCheck: never = component.data;
        return (
          <div className="p-8 text-center">
            Unknown template: {exhaustiveCheck}
          </div>
        );
    }
  };

  return (
    <div className="group relative">
      {/* Simplified delete button for all templates */}
      {isEditable && (
        <>
          <div className="bg-background/80 absolute top-4 -right-45 z-30 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Section?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {renderTemplate()}
    </div>
  );
};
