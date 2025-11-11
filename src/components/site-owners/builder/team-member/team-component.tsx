import React, { useState } from "react";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { TeamCard1 } from "./team-card-1";
import { TeamCard2 } from "./team-card-2";
import { TeamCard3 } from "./team-card-3";
import { TeamCard4 } from "./team-card-4";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2, Users, Plus } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import { TeamMemberDialog } from "../../admin/ourteam/our-team-form";
interface TeamComponentProps {
  component: TeamComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: TeamComponentData) => void;
  onMemberClick?: (memberId: number, order: number) => void;
}

export const TeamComponent: React.FC<TeamComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onMemberClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddMember = () => {
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setDialogOpen(false);
  };

  const {
    page_size = 8,
    title = "Meet Our Team",
    subtitle,
    style = "grid-1",
  } = component.data || {};

  // Use unified mutation hooks
  const deleteTeamComponent = useDeleteComponentMutation(
    pageSlug || "",
    "team"
  );
  const updateTeamComponent = useUpdateComponentMutation(
    pageSlug || "",
    "team"
  );

  // Get team members
  const { data: members = [], isLoading, error } = useTeamMembers();

  const handleMemberClick = (member: TEAM) => {
    if (onMemberClick && component.order !== undefined) {
      onMemberClick(member.id, component.order);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }

    deleteTeamComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updateTeamComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        title: newTitle,
      },
    });

    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updateTeamComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        subtitle: newSubtitle,
      },
    });

    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const renderTeamCard = (member: TEAM) => {
    const cardProps = {
      member,
      onClick: () => handleMemberClick(member),
    };

    const styleKey = style as string;
    switch (styleKey) {
      case "grid-2":
        return <TeamCard2 key={member.id} {...cardProps} />;
      case "list-1":
        return <TeamCard3 key={member.id} {...cardProps} />;
      case "grid-1":
        return <TeamCard1 key={member.id} {...cardProps} />;
      case "card-4":
        return <TeamCard4 key={member.id} {...cardProps} />;
      default:
        return <TeamCard1 key={member.id} {...cardProps} />;
    }
  };

  const getGridClass = () => {
    const styleKey = style as string;
    switch (styleKey) {
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case "list-1":
        return "grid-cols-1 lg:grid-cols-2 gap-8";
      case "grid-1":
      case "card-4":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control */}
        <div className="absolute top-4 right-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              onClick={handleAddMember}
              className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Team Member
            </Button>

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3"
                  disabled={deleteTeamComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteTeamComponent.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Trash2 className="text-destructive h-5 w-5" />
                    Delete Team Component
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this team component? This
                    action cannot be undone and will permanently remove the
                    component from your page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleteTeamComponent.isPending}
                  >
                    {deleteTeamComponent.isPending
                      ? "Deleting..."
                      : "Delete Component"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <TeamMemberDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleDialogSuccess}
        />
        {/* Team Preview */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <EditableText
                value={title}
                onChange={handleTitleChange}
                as="h2"
                className="text-foreground mb-2 text-3xl font-bold tracking-tight"
                isEditable={true}
                placeholder="Enter title..."
              />
              <EditableText
                value={subtitle || ""}
                onChange={handleSubtitleChange}
                as="p"
                className="text-muted-foreground mx-auto max-w-2xl text-lg"
                isEditable={true}
                placeholder="Enter subtitle..."
                multiline={true}
              />
            </div>

            {isLoading && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {Array.from({ length: Math.min(page_size, 8) }).map(
                  (_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton className="h-[250px] w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Team</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load team members. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && members.length > 0 && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {members.map(member => (
                  <div
                    key={member.id}
                    className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                  >
                    <div className="absolute inset-0 z-10 bg-transparent" />
                    {renderTeamCard(member)}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && members.length === 0 && (
              <div className="bg-muted/50 rounded-lg py-12 text-center">
                <Users className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Team Members Found
                </h3>
                <p className="text-muted-foreground">
                  Add team members to display them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Live site rendering
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2
            className="text-foreground mb-4 text-4xl font-bold tracking-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          ></h2>
          {subtitle && (
            <p
              className="text-muted-foreground mx-auto max-w-3xl text-xl"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            ></p>
          )}
        </div>

        {isLoading && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {Array.from({ length: page_size }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-[280px] w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Unable to Load Team</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading our team. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && members.length > 0 && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {members.map(member => renderTeamCard(member))}
          </div>
        )}

        {!isLoading && !error && members.length === 0 && (
          <div className="py-16 text-center">
            <Users className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Team Members
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              Our team page is currently being updated. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
