"use client";

import React, { useId } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  PencilIcon,
  Trash2Icon,
  ArchiveIcon,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Wrapper for the table to give it the specific rounded/border styling
export function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {children}
      </div>
    </div>
  );
}

// Reusable Cell for User/Product info (Avatar + Title + Subtitle)
interface TableUserCellProps {
  imageSrc?: string | null;
  fallback: string;
  title: string;
  subtitle?: string;
}

export function TableUserCell({
  imageSrc,
  fallback,
  title,
  subtitle,
}: TableUserCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        {imageSrc && <AvatarImage src={imageSrc} className="object-cover" />}
        <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-600">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-slate-900">{title}</div>
        {subtitle && (
          <span className="text-muted-foreground mt-0.5 block truncate text-xs">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

// Reusable Action Buttons
interface TableActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void; // Optional, maybe not used for appointments but good for generic
  onView?: () => void;
}

export function TableActionButtons({
  onEdit,
  onDelete,
  onView,
}: TableActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          title="Edit"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      )}
      {onView && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-900"
          onClick={e => {
            e.stopPropagation();
            onView();
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
