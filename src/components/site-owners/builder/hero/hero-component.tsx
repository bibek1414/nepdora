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
  HeroData,
  isHeroTemplate1,
  isHeroTemplate2,
  isHeroTemplate3,
  isHeroTemplate4,
  isHeroTemplate5,
  isHeroTemplate6,
  isHeroTemplate7,
  isHeroTemplate8,
  isHeroTemplate9,
  isHeroTemplate10,
  isHeroTemplate11,
  isHeroTemplate12,
  isHeroTemplate13,
  isHeroTemplate14,
  isHeroTemplate15,
} from "@/types/owner-site/components/hero";
import { HeroTemplate1 } from "./hero-style-1";
import { HeroTemplate2 } from "./hero-style-2";
import { HeroTemplate3 } from "./hero-style-3";

import { HeroTemplate4 } from "./hero-style-4";
import { HeroTemplate5 } from "./hero-style-5";
import { HeroTemplate6 } from "./hero-style-6";
import { HeroTemplate7 } from "./hero-style-7";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { HeroTemplate8 } from "./hero-style-8";
import { HeroTemplate9 } from "./hero-style-9";
import { HeroTemplate10 } from "./hero-style-10";
import { HeroTemplate11 } from "./hero-style-11";
import { HeroTemplate12 } from "./hero-style-12";
import { HeroTemplate13 } from "./hero-style-13";
import { HeroTemplate14 } from "./hero-style-14";
import { HeroTemplate15 } from "./hero-style-15";

interface HeroComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "hero";
  data: HeroData;
  type?: "hero";
  order: number;
  page?: number;
}

interface HeroComponentProps {
  component: HeroComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onReplace?: (componentId: string) => void;
}

export const HeroComponent: React.FC<HeroComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteHeroMutation = useDeleteComponentMutation(pageSlug, "hero");
  const updateHeroMutation = useUpdateComponentMutation(pageSlug, "hero");

  const handleUpdate = (updatedData: Partial<HeroData>) => {
    const componentId = component.component_id || component.id.toString();

    updateHeroMutation.mutate({
      componentId,
      data: updatedData,
    });
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();

    deleteHeroMutation.mutate(componentId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const renderHeroTemplate = () => {
    if (!component.data) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center border border-red-200 bg-red-50 px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              Error: Missing Hero Data
            </h2>
            <p className="mt-2 text-red-500">Component ID: {component.id}</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    // Type-safe template rendering using type guards
    if (isHeroTemplate1(component.data)) {
      return <HeroTemplate1 heroData={component.data} {...commonProps} />;
    }

    if (isHeroTemplate2(component.data)) {
      return <HeroTemplate2 heroData={component.data} {...commonProps} />;
    }

    if (isHeroTemplate3(component.data)) {
      return <HeroTemplate3 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate4(component.data)) {
      return <HeroTemplate4 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate5(component.data)) {
      return <HeroTemplate5 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate6(component.data)) {
      return <HeroTemplate6 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate7(component.data)) {
      return <HeroTemplate7 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate8(component.data)) {
      return <HeroTemplate8 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate9(component.data)) {
      return <HeroTemplate9 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate10(component.data)) {
      return <HeroTemplate10 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate11(component.data)) {
      return <HeroTemplate11 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate12(component.data)) {
      return <HeroTemplate12 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate13(component.data)) {
      return <HeroTemplate13 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate14(component.data)) {
      return <HeroTemplate14 heroData={component.data} {...commonProps} />;
    }
    if (isHeroTemplate15(component.data)) {
      return <HeroTemplate15 heroData={component.data} {...commonProps} />;
    }

    // Fallback for unknown templates (e.g. hero-14)
    const fallbackData = component.data as HeroData;
    return (
      <div className="flex min-h-[60vh] items-center justify-center border border-yellow-200 bg-yellow-50 px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-700">
            Unknown Hero Template: {fallbackData.template}
          </h2>
          <p className="mt-2 text-yellow-600">
            Please select a valid template in settings.
          </p>
        </div>
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
              disabled={deleteHeroMutation.isPending}
              className="h-8 w-fit justify-start px-3"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteHeroMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Hero Section</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this hero section? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteHeroMutation.isPending}
                >
                  {deleteHeroMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {renderHeroTemplate()}
    </div>
  );
};
