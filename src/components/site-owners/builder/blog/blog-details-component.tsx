"use client";
import React, { useState } from "react";
import { BlogDetailsData } from "@/types/owner-site/components/blog-details";
import { BlogDetail as Style1 } from "./details-style/blog-details-style-1";
import { BlogDetail2 as Style2 } from "./details-style/blog-details-style-2";
import { BlogDetail3 as Style3 } from "./details-style/blog-details-style-3";
import { useParams } from "next/navigation";
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
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";

interface BlogDetailsComponentProps {
  component: {
    id: string | number;
    component_id: string;
    data: BlogDetailsData;
  };
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  blogSlug?: string;
  onReplace?: (componentId: string) => void;
}

export const BlogDetailsComponent: React.FC<BlogDetailsComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  blogSlug,
  onReplace,
}) => {
  const params = useParams();

  const { data: blogsData } = useBlogs({ page_size: 1 });
  const sampleSlug = blogsData?.results?.[0]?.slug || "sample-blog";

  const slug = React.useMemo(() => {
    if (blogSlug) return blogSlug;
    const paramsSlug = params?.slug as string;
    if (paramsSlug) return paramsSlug;
    return sampleSlug;
  }, [blogSlug, params, sampleSlug]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useDeleteComponentMutation(pageSlug, "blog_details");
  const updateMutation = useUpdateComponentMutation(pageSlug, "blog_details");

  const handleDelete = () => {
    deleteMutation.mutate(component.component_id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const style = component.data?.style || "style-1";

  const renderContent = () => {
    switch (style) {
      case "style-3":
        return <Style3 slug={slug} siteUser={siteUser} />;
      case "style-2":
        return <Style2 slug={slug} siteUser={siteUser} />;
      case "style-1":
      default:
        return <Style1 slug={slug} siteUser={siteUser} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <>
          <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100">
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
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 w-fit justify-start px-3"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Blog Details Section</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this section?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      {renderContent()}
    </div>
  );
};
