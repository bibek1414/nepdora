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
import { ServicesPost } from "@/types/owner-site/admin/services";
import { FileText, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface ServicesTableProps {
  services: ServicesPost[];
  onEdit: (service: ServicesPost) => void;
  onDelete: (service: ServicesPost) => void;
  isLoading: boolean;
}

import {
  TableWrapper,
  TableActionButtons,
  TableUserCell,
} from "@/components/ui/custom-table";
import { RefreshCw } from "lucide-react";

interface ServicesTableProps {
  services: ServicesPost[];
  onEdit: (service: ServicesPost) => void;
  onDelete: (service: ServicesPost) => void;
  isLoading: boolean;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
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
            Loading services...
          </p>
        </div>
      </TableWrapper>
    );
  }

  if (services.length === 0) {
    return (
      <TableWrapper>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">
            No services found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first service.
          </p>
        </div>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-100 hover:bg-transparent">
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Service Info
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Created
            </TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map(service => (
            <TableRow
              key={service.id}
              className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
            >
              <TableCell className="px-6 py-4">
                <TableUserCell
                  imageSrc={service.thumbnail_image || undefined}
                  fallback={service.title.substring(0, 2).toUpperCase()}
                  title={service.title}
                  subtitle={service.slug}
                />
              </TableCell>
              <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                {new Date(service.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <TableActionButtons
                  onEdit={() => onEdit(service)}
                  onDelete={() => onDelete(service)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default ServicesTable;
