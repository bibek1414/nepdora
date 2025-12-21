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
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-black/20" />
        <p className="text-xs text-black/40">Loading services...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
          <FileText className="h-6 w-6 text-black/20" />
        </div>
        <h3 className="text-sm font-medium text-black">No services found</h3>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5">
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Service Info
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
          {services.map(service => (
            <TableRow
              key={service.id}
              className="group border-b border-black/5 transition-colors hover:bg-black/2"
            >
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-md border border-black/5">
                    <img
                      src={service.thumbnail_image || ""}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-normal text-black">
                      {service.title}
                    </span>
                    <span className="text-xs text-black/40">
                      /{service.slug}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-black/40">
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
    </div>
  );
};

export default ServicesTable;
