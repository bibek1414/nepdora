import React, { useState } from "react";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { useBlogs } from "@/hooks/owner-site/use-blogs";
import { useDeleteBlogComponentMutation } from "@/hooks/owner-site/components/use-blog";
import { BlogCard1 } from "./blog-card1";
import { BlogCard2 } from "./blog-card2";
import { BlogCard3 } from "./blog-card3";
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
import { AlertCircle, Trash2, Rss } from "lucide-react";
import { BlogPost } from "@/types/owner-site/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogComponentProps {
  component: BlogComponentData;
  isEditable?: boolean;
  siteId?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: BlogComponentData) => void;
  onBlogClick?: (blogSlug: string, order: number) => void;
}

export const BlogComponent: React.FC<BlogComponentProps> = ({
  component,
  isEditable = false,
  siteId,
  pageSlug,
  onUpdate,
  onBlogClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    limit = 6,
    title = "Latest Blog Posts",
    subtitle,
    style = "grid-1",
    showAuthor = true,
    showDate = true,
    showTags = true,
    showReadTime = true,
    itemsPerRow = 3,
  } = component.data || {};

  // Delete mutation hook
  const deleteBlogComponent = useDeleteBlogComponentMutation();

  // Calculate page size and get first page for the limit
  const pageSize = Math.min(limit, 50);

  // Fix: Use page_size instead of limit in the BlogFilters
  const { data, isLoading, error } = useBlogs({
    page: 1,
    page_size: pageSize,
  });

  // Extract blogs from the API response structure
  const blogs = data?.results || [];
  const totalBlogs = data?.count || 0;

  // Fix: Access pagination info from the response structure
  const hasNext = data?.next !== null;
  const hasPrevious = data?.previous !== null;
  const totalPages = Math.ceil(totalBlogs / pageSize);

  const handleBlogClick = (blog: BlogPost) => {
    if (onBlogClick && component.order !== undefined) {
      onBlogClick(blog.slug, component.order);
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

    deleteBlogComponent.mutate({
      componentId: component.component_id,
      pageSlug,
    });
    setIsDeleteDialogOpen(false);
  };

  const renderBlogCard = (blog: BlogPost) => {
    const cardProps = {
      blog,
      siteId: isEditable ? undefined : siteId,
      showAuthor,
      showDate,
      showTags,
      showReadTime,
      onClick: () => handleBlogClick(blog),
    };

    switch (style) {
      case "grid-2":
        return <BlogCard2 {...cardProps} />;
      case "list-1":
        return <BlogCard3 {...cardProps} />;
      case "grid-1":
      default:
        return <BlogCard1 {...cardProps} />;
    }
  };

  const getGridClass = () => {
    switch (style) {
      case "grid-2":
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(itemsPerRow, 3)}`;
      case "list-1":
        return "grid-cols-1 gap-6";
      case "grid-1":
      default:
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(itemsPerRow, 4)}`;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control with AlertDialog */}
        <div className="absolute top-4 right-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
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
                disabled={deleteBlogComponent.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {deleteBlogComponent.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Blog Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this blog component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteBlogComponent.isPending}
                >
                  {deleteBlogComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Style Info Header */}
        <div className="bg-muted border-border mb-6 rounded-lg border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <Rss className="h-4 w-4" />
              Blog Section Configuration
            </h3>
            <Badge variant="outline" className="text-xs">
              {style}
            </Badge>
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
            <span>Limit: {limit}</span>
            <span>Items per row: {itemsPerRow}</span>
            <span>Show author: {showAuthor ? "Yes" : "No"}</span>
            <span>Show date: {showDate ? "Yes" : "No"}</span>
            {totalBlogs > 0 && <span>Total available: {totalBlogs}</span>}
          </div>
        </div>

        {/* Blogs Preview */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-foreground mb-2 text-3xl font-bold tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                  {subtitle}
                </p>
              )}
            </div>

            {isLoading && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {Array.from({ length: Math.min(limit, 3) }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Blog Posts</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load blog posts. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && blogs.length > 0 && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {blogs.slice(0, Math.min(limit, 6)).map(blog => (
                  <div
                    key={blog.id}
                    className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                  >
                    {/* Overlay to prevent clicks in builder mode */}
                    <div className="absolute inset-0 z-10 bg-transparent" />
                    {renderBlogCard(blog)}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && blogs.length === 0 && (
              <div className="bg-muted/50 rounded-lg py-12 text-center">
                <Rss className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Blog Posts Found
                </h3>
                <p className="text-muted-foreground">
                  Add some blog posts to your site to display them here.
                </p>
              </div>
            )}

            {!isLoading && !error && blogs.length > 6 && (
              <div className="bg-muted/50 mt-6 rounded-md p-3 text-center">
                <p className="text-muted-foreground text-sm">
                  Showing 6 of {blogs.length} blog posts in builder preview
                  {totalBlogs > 0 && ` (${totalBlogs} total available)`}
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
          <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              {subtitle}
            </p>
          )}
        </div>

        {isLoading && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {Array.from({ length: limit }).map((_, index) => (
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
            <AlertTitle>Unable to Load Blog Posts</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading our blog posts. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && blogs.length > 0 && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {blogs.slice(0, limit).map(blog => (
              <div key={blog.id} className="flex-shrink-0">
                {renderBlogCard(blog)}
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && blogs.length === 0 && (
          <div className="py-16 text-center">
            <Rss className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Blog Posts Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              We&apos;re currently working on new content. Please check back
              soon for new blog posts.
            </p>
          </div>
        )}

        {/* Pagination info */}
        {!isLoading && !error && totalBlogs > limit && (
          <div className="bg-muted/30 mt-12 rounded-lg p-4 text-center">
            <p className="text-muted-foreground">
              Showing {Math.min(limit, blogs.length)} of {totalBlogs} blog posts
              {totalPages > 1 && ` (Page 1 of ${totalPages})`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
