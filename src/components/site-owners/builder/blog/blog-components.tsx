import React, { useState } from "react";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { BlogCard1 } from "./blog-card1";
import { BlogCard2 } from "./blog-card2";
import { BlogCard3 } from "./blog-card3";
import { BlogCard4 } from "./blog-card4";
import { BlogCard5 } from "./blog-card5";
import { BlogCard6 } from "./blog-card6";
import { BlogCard7 } from "./blog-card7";
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
import { BlogPost } from "@/types/owner-site/admin/blog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditableText } from "@/components/ui/editable-text";
import { toast } from "sonner";

interface BlogComponentProps {
  component: BlogComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: BlogComponentData) => void;
  onBlogClick?: (blogSlug: string, order: number) => void;
}

export const BlogComponent: React.FC<BlogComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onBlogClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    title = "Latest Blog Posts",
    subtitle,
    style = "grid-1",
  } = component.data || {};

  // Delete and update mutation hooks
  const deleteBlogComponent = useDeleteComponentMutation(
    pageSlug || "",
    "blog"
  );
  const updateBlogComponent = useUpdateComponentMutation(
    pageSlug || "",
    "blog"
  );

  // Calculate page size and get first page for the page_size
  const pageSize = 6;

  const { data, isLoading, error } = useBlogs({
    page: 1,
    page_size: pageSize,
  });

  // Extract blogs from the API response structure
  const blogs = data?.results || [];
  const totalBlogs = data?.count || 0;

  const hasNext = data?.next !== null;
  const hasPrevious = data?.previous !== null;
  const totalPages = Math.ceil(totalBlogs / pageSize);

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    const componentId = component.component_id || component.id?.toString();
    if (!componentId) return;

    updateBlogComponent.mutate(
      {
        componentId,
        data: {
          ...component.data,
          title: newTitle,
        },
      },
      {
        onError: error => {
          toast.error("Failed to update title", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );

    if (onUpdate) {
      onUpdate(componentId, {
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

    const componentId = component.component_id || component.id?.toString();
    if (!componentId) return;

    updateBlogComponent.mutate(
      {
        componentId,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      },
      {
        onError: error => {
          toast.error("Failed to update subtitle", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );

    if (onUpdate) {
      onUpdate(componentId, {
        ...component,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

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

    const componentId = component.component_id || component.id?.toString();
    if (componentId) {
      deleteBlogComponent.mutate(componentId);
    }
    setIsDeleteDialogOpen(false);
  };

  const renderBlogCard = (blog: BlogPost) => {
    const cardProps = {
      blog,
      siteUser: isEditable ? undefined : siteUser,
      onClick: () => handleBlogClick(blog),
    };

    switch (style) {
      case "blog-2":
        return <BlogCard2 {...cardProps} />;
      case "blog-3":
        return <BlogCard3 {...cardProps} />;
      case "blog-4":
        return <BlogCard4 {...cardProps} />;
      case "blog-5":
        return <BlogCard5 {...cardProps} />;
      case "blog-7":
        return <BlogCard7 {...cardProps} isFeatured={false} />;
      case "blog-1":
      default:
        return <BlogCard1 {...cardProps} />;
    }
  };

  const getGridClass = () => {
    switch (style) {
      case "blog-2":
        return "grid-cols-1 sm:grid-cols-4";
      case "blog-3":
        return "grid-cols-1 gap-6";
      case "blog-4":
        return "grid-cols-1 sm:grid-cols-2 gap-6";
      case "blog-5":
        return "grid-cols-1 sm:grid-cols-4 gap-6";
      case "blog-6":
        return "grid-cols-1";
      case "blog-1":
      default:
        return "grid-cols-1 sm:grid-cols-4";
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control with AlertDialog */}
        <div className="absolute -right-5 z-30 flex translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <div className="flex items-center gap-2">
              <Link href="/admin/blogs/" target="_blank" rel="noopener">
                <Button size="sm" variant="outline">
                  Manage Blogs
                </Button>
              </Link>
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
            </div>
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

        {/* Blogs Preview */}
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
                {Array.from({ length: Math.min(pageSize, 3) }).map(
                  (_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton className="h-[200px] w-full rounded-xl" />
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
                <AlertTitle>Error Loading Blog Posts</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load blog posts. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading &&
              !error &&
              blogs.length > 0 &&
              (style === "blog-6" ? (
                <div className="relative cursor-default">
                  {/* Overlay to prevent clicks in builder mode */}
                  <div className="absolute inset-0 z-10 bg-transparent" />
                  <BlogCard6
                    blogs={blogs.slice(0, Math.min(pageSize, 6))}
                    siteUser={undefined}
                    onPostClick={handleBlogClick}
                  />
                </div>
              ) : style === "blog-7" ? (
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
                  {/* Left Column - Featured Post */}
                  {blogs[0] && (
                    <div className="relative cursor-default">
                      <div className="absolute inset-0 z-10 bg-transparent" />
                      <BlogCard7
                        blog={blogs[0]}
                        siteUser={undefined}
                        onClick={() => handleBlogClick(blogs[0])}
                        isFeatured={true}
                      />
                    </div>
                  )}

                  {/* Right Column - List of Posts */}
                  <div className="flex flex-col gap-10">
                    {blogs[1] && (
                      <div className="relative h-full cursor-default">
                        <div className="absolute inset-0 z-10 bg-transparent" />
                        <BlogCard7
                          blog={blogs[1]}
                          siteUser={undefined}
                          onClick={() => handleBlogClick(blogs[1])}
                          isFeatured={false}
                        />
                      </div>
                    )}
                    {blogs[2] && (
                      <div className="relative h-full cursor-default border-t border-gray-100 pt-10 lg:border-t-0 lg:pt-0">
                        <div className="absolute inset-0 z-10 bg-transparent" />
                        <BlogCard7
                          blog={blogs[2]}
                          siteUser={undefined}
                          onClick={() => handleBlogClick(blogs[2])}
                          isFeatured={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`grid ${getGridClass()} gap-6`}>
                  {blogs.slice(0, Math.min(pageSize, 6)).map(blog => (
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
              ))}

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
        {(title || subtitle) && style !== "blog-6" && (
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
        )}

        {isLoading && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {Array.from({ length: pageSize }).map((_, index) => (
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

        {!isLoading &&
          !error &&
          blogs.length > 0 &&
          (style === "blog-6" ? (
            <BlogCard6
              blogs={blogs.slice(0, pageSize)}
              siteUser={siteUser}
              onPostClick={handleBlogClick}
            />
          ) : style === "blog-7" ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
              {/* Left Column - Featured Post */}
              {blogs[0] && (
                <BlogCard7
                  blog={blogs[0]}
                  siteUser={siteUser}
                  onClick={() => handleBlogClick(blogs[0])}
                  isFeatured={true}
                />
              )}

              {/* Right Column - List of Posts */}
              <div className="flex flex-col gap-10">
                {blogs[1] && (
                  <div className="h-full">
                    <BlogCard7
                      blog={blogs[1]}
                      siteUser={siteUser}
                      onClick={() => handleBlogClick(blogs[1])}
                      isFeatured={false}
                    />
                  </div>
                )}
                {blogs[2] && (
                  <div className="h-full border-t border-gray-100 pt-10 lg:border-t-0 lg:pt-0">
                    <BlogCard7
                      blog={blogs[2]}
                      siteUser={siteUser}
                      onClick={() => handleBlogClick(blogs[2])}
                      isFeatured={false}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`grid ${getGridClass()} gap-8`}>
              {blogs.slice(0, pageSize).map(blog => (
                <div key={blog.id} className="flex-shrink-0">
                  {renderBlogCard(blog)}
                </div>
              ))}
            </div>
          ))}

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
        {!isLoading && !error && totalBlogs > pageSize && (
          <div className="bg-muted/30 mt-12 rounded-lg p-4 text-center">
            <p className="text-muted-foreground">
              Showing {Math.min(pageSize, blogs.length)} of {totalBlogs} blog
              posts
              {totalPages > 1 && ` (Page 1 of ${totalPages})`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
