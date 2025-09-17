// components/admin/blogs/BlogsTable.tsx
import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { FileText, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface BlogsTableProps {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (blog: BlogPost) => void;
  onTogglePublish: (blog: BlogPost) => void;
  isLoading: boolean;
}

const BlogsTable: React.FC<BlogsTableProps> = ({
  blogs,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <>
        <div className="hidden rounded-lg border sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-3 sm:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white p-4">
              <div className="mb-3 flex items-center gap-3">
                <Skeleton className="h-12 w-12 flex-shrink-0 rounded-md" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="mb-2 h-5 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white text-center">
        <FileText className="h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No blogs found
        </h3>
        <p className="mt-1 px-4 text-sm text-gray-500">
          Get started by creating your first blog post.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="min-w-[100px]">Created</TableHead>
              <TableHead className="min-w-[100px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map(blog => (
              <TableRow key={blog.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={blog.thumbnail_image || "/images/fallback.png"}
                        alt={blog.thumbnail_image_alt_description || blog.title}
                        fill
                        sizes="40px"
                        className="rounded-md object-cover"
                      />
                    </div>
                    <Link href={`/admin/blogs/edit/${blog.slug}`}>
                      <span className="line-clamp-2 font-medium text-gray-900">
                        {blog.title}
                      </span>
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(blog.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onDelete(blog)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 sm:hidden">
        {blogs.map(blog => (
          <div key={blog.id} className="rounded-lg border bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={blog.thumbnail_image || "/images/fallback.png"}
                  alt={blog.thumbnail_image_alt_description || blog.title}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 line-clamp-2 text-sm leading-tight font-medium text-gray-900">
                  {blog.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-500">
                {new Date(blog.created_at).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(blog)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                  onClick={() => onDelete(blog)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogsTable;
