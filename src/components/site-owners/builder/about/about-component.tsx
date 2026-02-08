"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
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
  UpdateAboutUsRequest,
  isAboutUsTemplate1,
  isAboutUsTemplate2,
  isAboutUsTemplate3,
  isAboutUsTemplate4,
  isAboutUsTemplate5,
  isAboutUsTemplate6,
  isAboutUsTemplate7,
  isAboutUsTemplate8,
  isAboutUsTemplate9,
  isAboutUsTemplate10,
  isAboutUsTemplate11,
  isAboutUsTemplate12,
  isAboutUsTemplate13,
  isAboutUsTemplate14,
  isAboutUsTemplate15,
  isAboutUsTemplate16,
  isAboutUsTemplate17,
  isAboutUsTemplate18,
  isAboutUsTemplate19,
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
import { AboutUsTemplate11 } from "./about-style-11";
import { AboutUsTemplate12 } from "./about-style-12";
import { AboutUsTemplate13 } from "./about-style-13";
import { AboutUsTemplate14 } from "./about-style-14";
import { AboutUsTemplate15 } from "./about-style-15";
import { AboutUsTemplate16 } from "./about-style-16";
import { AboutUsTemplate17 } from "./about-style-17";
import { AboutUsTemplate18 } from "./about-style-18";
import { AboutUsTemplate19 } from "./about-style-19";

interface AboutUsComponentProps {
  component: AboutUsComponentData;
  isEditable?: boolean;
  pageSlug: string;
  onReplace?: (componentId: string) => void;
}

export const AboutUsComponent: React.FC<AboutUsComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  onReplace,
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

    const commonProps = {
      isEditable,
      onUpdate: handleUpdate,
    };

    if (isAboutUsTemplate1(component.data)) {
      return <AboutUsTemplate1 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate2(component.data)) {
      return <AboutUsTemplate2 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate3(component.data)) {
      return <AboutUsTemplate3 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate4(component.data)) {
      return <AboutUsTemplate4 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate5(component.data)) {
      return <AboutUsTemplate5 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate6(component.data)) {
      return <AboutUsTemplate6 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate7(component.data)) {
      return <AboutUsTemplate7 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate8(component.data)) {
      return <AboutUsTemplate8 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate9(component.data)) {
      return <AboutUsTemplate9 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate10(component.data)) {
      return (
        <AboutUsTemplate10 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate11(component.data)) {
      return (
        <AboutUsTemplate11 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate12(component.data)) {
      return (
        <AboutUsTemplate12 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate13(component.data)) {
      return (
        <AboutUsTemplate13 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate14(component.data)) {
      return (
        <AboutUsTemplate14 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate15(component.data)) {
      return (
        <AboutUsTemplate15 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate16(component.data)) {
      return (
        <AboutUsTemplate16 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate17(component.data)) {
      return (
        <AboutUsTemplate17 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate18(component.data)) {
      return (
        <AboutUsTemplate18 aboutUsData={component.data} {...commonProps} />
      );
    }
    if (isAboutUsTemplate19(component.data)) {
      return (
        <AboutUsTemplate19 aboutUsData={component.data} {...commonProps} />
      );
    }

    return (
      <div className="p-8 text-center">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        Unknown template: {(component.data as any).template}
      </div>
    );
  };

  return (
    <div className="group relative">
      {/* Simplified delete button for all templates */}
      {isEditable && (
        <>
          <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onReplace?.(component.component_id || component.id.toString())
              }
              className="h-8 w-fit justify-start bg-white px-3"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Replace
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 w-fit justify-start px-3"
              disabled={deleteAboutUsMutation.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteAboutUsMutation.isPending ? "Deleting..." : "Delete"}
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
