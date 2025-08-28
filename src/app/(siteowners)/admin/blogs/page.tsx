"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useBlogs,
  useDeleteBlog,
  useUpdateBlog,
} from "@/hooks/owner-site/use-blogs";
import BlogsTable from "@/components/site-owners/blogs/blog-table";
import BlogsHeader from "@/components/site-owners/blogs/blog-header";
import BlogsSearch from "@/components/site-owners/blogs/blog-search";
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
import { BlogPost, BlogFilters } from "@/types/owner-site/blog";
import Pagination from "@/components/ui/pagination";

const BlogsManagement = () => {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    blog: BlogPost | null;
  }>({ isOpen: false, blog: null });

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    status: "",
    pageSize: 10,
  });

  const queryFilters = useMemo(() => {
    const qf: BlogFilters = {
      page: filters.page,
      search: filters.search,
      page_size: filters.pageSize,
    };
    if (filters.status) qf.is_published = filters.status === "published";
    return qf;
  }, [filters]);

  const {
    data: blogData,
    isLoading: isLoadingBlogs,
    error,
    refetch,
  } = useBlogs(queryFilters);

  const deleteBlogMutation = useDeleteBlog();
  const updateBlogMutation = useUpdateBlog();

  const handleCreateNew = () => router.push("/admin/blogs/add");
  const handleEditBlog = (blog: BlogPost) =>
    router.push(`/admin/blogs/edit/${blog.slug}`);

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteBlog = (blog: BlogPost) => {
    setDeleteDialog({ isOpen: true, blog });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.blog) return;

    deleteBlogMutation.mutate(
      { slug: deleteDialog.blog.slug },
      {
        onSuccess: () => {
          toast.success("Blog deleted successfully!");
          setDeleteDialog({ isOpen: false, blog: null });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to delete blog");
          setDeleteDialog({ isOpen: false, blog: null });
        },
      }
    );
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, blog: null });
  };

  const handleTogglePublish = (blog: BlogPost) => {
    const updatedData = { is_published: !blog.is_published };
    updateBlogMutation.mutate(
      { slug: blog.slug, blogData: updatedData },
      {
        onSuccess: () => {
          toast.success(
            `Blog ${blog.is_published ? "unpublished" : "published"} successfully!`
          );
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update blog status");
        },
      }
    );
  };

  const handleSearch = (term: string) =>
    setFilters(prev => ({ ...prev, search: term, page: 1 }));

  const handlePageChange = (page: number) =>
    setFilters(prev => ({ ...prev, page }));

  const handlePageSizeChange = (pageSize: number) =>
    setFilters(prev => ({ ...prev, pageSize, page: 1 }));

  if (error) {
    toast.error(error.message || "Failed to load blogs");
  }

  const blogs = blogData?.results || [];
  const totalBlogs = blogData?.count || 0;
  const totalPages = Math.ceil(totalBlogs / filters.pageSize);
  const hasNext = !!blogData?.next;
  const hasPrevious = !!blogData?.previous;

  return (
    <div className="bg-gray-50 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <BlogsHeader
          onCreateNew={handleCreateNew}
          onRefresh={handleRefresh}
          blogsCount={totalBlogs}
        />
        <BlogsSearch onSearch={handleSearch} />
        <BlogsTable
          blogs={blogs}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          onTogglePublish={handleTogglePublish}
          isLoading={isLoadingBlogs}
        />

        {totalPages > 1 && (
          <Pagination
            count={totalBlogs}
            pageSize={filters.pageSize}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageSizeChange={handlePageSizeChange}
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={7}
          />
        )}
      </div>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={open => !open && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.blog?.title}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogsManagement;
