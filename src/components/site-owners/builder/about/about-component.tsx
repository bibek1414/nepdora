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
} from "@/types/owner-site/components/about";
import { AboutUsTemplate1 } from "./about-style-1";
import { AboutUsTemplate2 } from "./about-style-2";
import { AboutUsTemplate3 } from "./about-style-3";
import { AboutUsTemplate4 } from "./about-style-4";
import { AboutUsTemplate5 } from "./about-style-5";
import { AboutUsTemplate6 } from "./about-style-6";
import { AboutUsTemplate7 } from "./about-style-7";
import { AboutUsTemplate8 } from "./about-style-8";
import { AboutUsTemplate9 } from "./about-style-9";
import { AboutUsTemplate10 } from "./about-style-10";
import { AboutUsTemplate11 } from "./about-style-11";
import { AboutUsTemplate12 } from "./about-style-12";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";

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
    deleteAboutUsMutation.mutate(componentId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleUpdate = (updatedData: Partial<AboutUsData>) => {
    const componentId = component.component_id || component.id.toString();

    updateAboutUsMutation.mutate({
      componentId,
      data: updatedData as UpdateAboutUsRequest["data"],
    });
  };

  const renderTemplate = () => {
    if (!component.data) {
      return (
        <div className="p-8 text-center text-red-500 border border-red-200 bg-red-50 rounded-lg">
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
      return <AboutUsTemplate10 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate11(component.data)) {
      return <AboutUsTemplate11 aboutUsData={component.data} {...commonProps} />;
    }
    if (isAboutUsTemplate12(component.data)) {
      return <AboutUsTemplate12 aboutUsData={component.data} {...commonProps} />;
    }

    return (
      <div className="p-8 text-center border border-yellow-200 bg-yellow-50 rounded-lg">
        Unknown template: {(component.data as any).template}
      </div>
    );
  };

  return (
    <div className="group relative">
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
                  This action cannot be undone. Are you sure you want to delete this section?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteAboutUsMutation.isPending}
                >
                  {deleteAboutUsMutation.isPending ? "Deleting..." : "Delete"}
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
