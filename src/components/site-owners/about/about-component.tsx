"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { AboutUsSettingsDialog } from "./about-editor-dialog";
import { AboutUsTemplate1 } from "./about-style-1";
import { AboutUsTemplate2 } from "./about-style-2";
import { AboutUsTemplate3 } from "./about-style-3";
import { useDeleteAboutUsMutation } from "@/hooks/owner-site/components/use-about";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteAboutUsMutation = useDeleteAboutUsMutation(pageSlug);

  const handleDelete = () => {
    deleteAboutUsMutation.mutate(
      component.component_id || component.id.toString()
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
        return <AboutUsTemplate1 aboutUsData={component.data} />;
      case "about-2":
        return <AboutUsTemplate2 aboutUsData={component.data} />;
      case "about-3":
        return <AboutUsTemplate3 aboutUsData={component.data} />;
      default:
        // This helps catch any unhandled template types
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
      {isEditable && (
        <>
          <div className="bg-background/80 absolute top-4 right-4 z-20 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <AboutUsSettingsDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            aboutUsData={component.data}
            componentId={(component.component_id || component.id).toString()}
            pageSlug={pageSlug}
          />

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
