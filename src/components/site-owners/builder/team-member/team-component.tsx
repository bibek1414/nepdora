"use client";
import React, { useState } from "react";
import { TeamComponentData } from "@/types/owner-site/components/team";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
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
import { Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TeamStyle1 } from "./team-member-style/team-style-1";
import { TeamStyle2 } from "./team-member-style/team-style-2";
import { TeamStyle3 } from "./team-member-style/team-style-3";
import { TeamStyle4 } from "./team-member-style/team-style-4";
import { TeamStyle5 } from "./team-member-style/team-style-5";
import { TeamStyle6 } from "./team-member-style/team-style-6";
import { TeamStyle7 } from "./team-member-style/team-style-7";
import { TeamStyle8 } from "./team-member-style/team-style-8";

interface TeamComponentProps {
  component: TeamComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: TeamComponentData) => void;
  onMemberClick?: (memberId: number, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const TeamComponent: React.FC<TeamComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onMemberClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteTeamComponent = useDeleteComponentMutation(
    pageSlug || "",
    "team"
  );
  const updateTeamComponent = useUpdateComponentMutation(
    pageSlug || "",
    "team"
  );

  const handleUpdate = (updatedData: Partial<TeamComponentData["data"]>) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateTeamComponent.mutate({
      componentId,
      data: newData,
    });

    if (onUpdate) {
      onUpdate(componentId, {
        ...component,
        data: newData,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) return;
    deleteTeamComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderTeamStyle = () => {
    const style = component.data?.style || "team-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
      onMemberClick: (memberId: number) => {
        if (onMemberClick && component.order !== undefined) {
          onMemberClick(memberId, component.order);
        }
      },
    };

    switch (style) {
      case "team-2":
        return <TeamStyle2 {...commonProps} />;
      case "team-3":
        return <TeamStyle3 {...commonProps} />;
      case "team-4":
        return <TeamStyle4 {...commonProps} />;
      case "team-5":
        return <TeamStyle5 {...commonProps} />;
      case "team-6":
        return <TeamStyle6 {...commonProps} />;
      case "team-7":
        return <TeamStyle7 {...commonProps} />;
      case "team-8":
        return <TeamStyle8 {...commonProps} />;
      case "team-1":
      default:
        return <TeamStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/ourteam/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Team
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onReplace?.(component.component_id)}
            className="h-8 w-fit justify-start bg-white px-3"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Replace
          </Button>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              size="sm"
              className="h-8 w-fit justify-start px-3"
              disabled={deleteTeamComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteTeamComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Team Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this team component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteTeamComponent.isPending}
                >
                  {deleteTeamComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderTeamStyle()}
    </div>
  );
};
