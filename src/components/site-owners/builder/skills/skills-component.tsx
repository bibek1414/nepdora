import React, { useState } from "react";
import { SkillsComponentData } from "@/types/owner-site/components/skills";
import SkillsStyle1 from "./skills-style/skills-style-1";
import SkillsStyle2 from "./skills-style/skills-style-2";
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

interface SkillsComponentProps {
  component: SkillsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onReplace?: (componentId: string) => void;
}

const SkillsComponent: React.FC<SkillsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteSkillsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "skills"
  );
  const updateSkillsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "skills"
  );

  const handleUpdate = (updatedData: Partial<SkillsComponentData["data"]>) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateSkillsComponent.mutate({
      componentId,
      data: newData,
    });
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) return;
    deleteSkillsComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderSkillsStyle = () => {
    const data = component?.data || {
      title: "My skills",
      resume_link: "#",
      resume_text: "Browse resume",
      style: "skills-style-1",
    };
    const style = data.style || "skills-style-1";

    const commonProps = {
      data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "skills-style-1":
        return <SkillsStyle1 {...commonProps} />;
      case "skills-style-2":
        return <SkillsStyle2 {...commonProps} />;
      default:
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/portfolio/skills" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start whitespace-nowrap"
            >
              Manage Skills
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
              disabled={deleteSkillsComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteSkillsComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Skills Section</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this skills section? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteSkillsComponent.isPending}
                >
                  {deleteSkillsComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderSkillsStyle()}
    </div>
  );
};

export default SkillsComponent;
