"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useSuperAdminBlogs,
  useDeleteSuperAdminBlog,
  useUpdateSuperAdminBlog,
} from "@/hooks/super-admin/use-blogs";
import BlogsTable from "@/components/super-admin/blogs/blog-table";
import BlogsHeader from "@/components/super-admin/blogs/blog-header";
import BlogsSearch from "@/components/super-admin/blogs/blog-search";
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
import { BlogPost, BlogFilters } from "@/types/super-admin/blog";
import { SimplePagination } from "@/components/ui/simple-pagination";

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
  } = useSuperAdminBlogs(queryFilters);

  const deleteBlogMutation = useDeleteSuperAdminBlog();
  const updateBlogMutation = useUpdateSuperAdminBlog();

  const handleCreateNew = () => router.push("/superadmin/blogs/add");
  const handleEditBlog = (blog: BlogPost) =>
    router.push(`/superadmin/blogs/edit/${blog.slug}`);

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

  if (error) {
    toast.error(error.message || "Failed to load blogs");
  }

  const blogs = blogData?.results || [];
  const totalBlogs = blogData?.count || 0;
  const totalPages = Math.ceil(totalBlogs / filters.pageSize);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <BlogsHeader onCreateNew={handleCreateNew} onRefresh={handleRefresh} />

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BlogsSearch onSearch={handleSearch} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/superadmin/blogs/categories")}
              className="h-9 border-black text-gray-900"
            >
              Manage Categories & Tags
            </Button>
            <Button
              onClick={handleCreateNew}
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Blog
            </Button>
          </div>
        </div>

        <BlogsTable
          blogs={blogs}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          onTogglePublish={handleTogglePublish}
          isLoading={isLoadingBlogs}
        />

        {!isLoadingBlogs && (
          <SimplePagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
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
