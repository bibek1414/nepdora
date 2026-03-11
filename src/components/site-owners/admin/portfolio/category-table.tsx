import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableWrapper, TableActionButtons } from "@/components/ui/custom-table";
import { PortfolioCategory } from "@/types/owner-site/admin/portfolio";
import { FolderOpen, RefreshCw } from "lucide-react";

interface CategoryTableProps {
  categories: PortfolioCategory[];
  onEdit: (category: PortfolioCategory) => void;
  onDelete: (category: PortfolioCategory) => void;
  isLoading: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
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
            Loading categories...
          </p>
        </div>
      </TableWrapper>
    );
  }

  if (categories.length === 0) {
    return (
      <TableWrapper>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FolderOpen className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">
            No categories found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first portfolio category.
          </p>
        </div>
      </TableWrapper>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5">
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Category Name
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Slug
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow
              key={category.id}
              className="group cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
              onClick={() => onEdit(category)}
            >
              <TableCell className="px-6 py-4">
                <span className="text-sm font-normal text-black">
                  {category.name}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="text-xs text-black/50">{category.slug}</span>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <TableActionButtons
                  onEdit={() => onEdit(category)}
                  onDelete={() => onDelete(category)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
