import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { FileText, Edit, Trash2, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlogsTableProps {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (blog: BlogPost) => void;
  onTogglePublish: (blog: BlogPost) => void;
  isLoading: boolean;
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableWrapper,
  TableActionButtons,
  TableUserCell,
} from "@/components/ui/custom-table";

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
      <TableWrapper>
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
          <p className="animate-pulse text-sm text-slate-400">
            Loading blogs...
          </p>
        </div>
      </TableWrapper>
    );
  }

  if (blogs.length === 0) {
    return (
      <TableWrapper>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">No blogs found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first blog post.
          </p>
        </div>
      </TableWrapper>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getInitials = (title: string) => {
    return title.slice(0, 2).toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5">
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Blog Post
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Created
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map(blog => (
            <TableRow
              key={blog.id}
              className="group cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
              onClick={() => onEdit(blog)}
            >
              <TableCell className="px-6 py-4">
                <TableUserCell
                  title={blog.title}
                  subtitle={blog.slug}
                  imageSrc={blog.thumbnail_image}
                  fallback={getInitials(blog.title)}
                />
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <span className="text-xs text-black/40">
                  {formatDate(blog.created_at)}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <TableActionButtons
                  onEdit={() => onEdit(blog)}
                  onDelete={() => onDelete(blog)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogsTable;
