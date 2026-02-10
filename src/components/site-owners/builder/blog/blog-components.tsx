"use client";
import React, { useState } from "react";
import { BlogComponentData } from "@/types/owner-site/components/blog";
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
import { BlogStyle1 } from "./blog-style/blog-style-1";
import { BlogStyle2 } from "./blog-style/blog-style-2";
import { BlogStyle3 } from "./blog-style/blog-style-3";
import { BlogStyle4 } from "./blog-style/blog-style-4";
import { BlogStyle5 } from "./blog-style/blog-style-5";
import { BlogStyle6 } from "./blog-style/blog-style-6";
import { BlogStyle7 } from "./blog-style/blog-style-7";

interface BlogComponentProps {
  component: BlogComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: BlogComponentData) => void;
  onBlogClick?: (blogSlug: string, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const BlogComponent: React.FC<BlogComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onBlogClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteBlogComponent = useDeleteComponentMutation(
    pageSlug || "",
    "blog"
  );
  const updateBlogComponent = useUpdateComponentMutation(
    pageSlug || "",
    "blog"
  );

  const handleUpdate = (updatedData: Partial<BlogComponentData["data"]>) => {
    if (!pageSlug) return;
    const componentId = component.component_id || component.id?.toString();
    if (!componentId) return;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateBlogComponent.mutate({
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
    const componentId = component.component_id || component.id?.toString();
    if (componentId) {
      deleteBlogComponent.mutate(componentId);
    }
    setIsDeleteDialogOpen(false);
  };

  const renderBlogStyle = () => {
    const style = component.data?.style || "blog-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
      onBlogClick: (slug: string) => {
        if (onBlogClick && component.order !== undefined) {
          onBlogClick(slug, component.order);
        }
      },
    };

    switch (style) {
      case "blog-2":
        return <BlogStyle2 {...commonProps} />;
      case "blog-3":
        return <BlogStyle3 {...commonProps} />;
      case "blog-4":
        return <BlogStyle4 {...commonProps} />;
      case "blog-5":
        return <BlogStyle5 {...commonProps} />;
      case "blog-6":
        return <BlogStyle6 {...commonProps} />;
      case "blog-7":
        return <BlogStyle7 {...commonProps} />;
      case "blog-1":
      default:
        return <BlogStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <>
          <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Link href="/admin/blogs/" target="_blank" rel="noopener">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                Manage Blogs
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
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              size="sm"
              className="h-8 w-fit justify-start px-3"
              disabled={deleteBlogComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteBlogComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Blog Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this blog component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteBlogComponent.isPending}
                >
                  {deleteBlogComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {renderBlogStyle()}
    </div>
  );
};
