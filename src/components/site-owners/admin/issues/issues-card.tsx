"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2, Calendar, MessageSquare } from "lucide-react";
import {
  Issue,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/types/owner-site/admin/issues";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type StatusKey = (typeof STATUS_OPTIONS)[number]["value"];
type PriorityKey = (typeof PRIORITY_OPTIONS)[number]["value"];

const PRIORITY_CONFIG: Record<
  PriorityKey,
  {
    label: string;
    color: string;
  }
> = {
  high: { label: "High", color: "bg-red-50 text-red-700 border-red-100" },
  medium: {
    label: "Medium",
    color: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
  low: { label: "Low", color: "bg-slate-50 text-slate-700 border-slate-100" },
};

interface IssueCardProps {
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
  onStatusChange: (issueId: number, newStatus: StatusKey) => void;
  isDragging?: boolean;
}

export function IssueCard({
  issue,
  onEdit,
  onDelete,
  onStatusChange,
  isDragging: isOverlay = false,
}: IssueCardProps) {
  const [showActions, setShowActions] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: issue.id,
    data: {
      type: "card",
      status: issue.status,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const priority =
    PRIORITY_CONFIG[issue.priority as PriorityKey] || PRIORITY_CONFIG.low;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex flex-col gap-3 rounded-2xl border bg-white p-4 transition-all duration-300 select-none ${
        isOverlay
          ? "z-50 scale-105 cursor-grabbing border-blue-200 shadow-2xl"
          : "cursor-grab border-gray-100 active:cursor-grabbing"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onEdit(issue)}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${priority.color}`}
        >
          {priority.label}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
          <Calendar className="h-3 w-3" />
          {formatDate(issue.created_at)}
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="line-clamp-2 text-sm leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600">
          {issue.title}
        </h4>
        {issue.description && (
          <p className="line-clamp-2 text-xs leading-relaxed font-medium text-gray-500">
            {issue.description}
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex items-center gap-2">
          {issue.reported_by && (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 text-[10px] font-bold text-blue-600 shadow-sm">
                {issue.reported_by.email.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate text-[10px] font-bold text-gray-500">
                {issue.reported_by.email.split("@")[0]}
              </span>
            </div>
          )}
        </div>

        {issue.issue_category && (
          <Badge
            variant="secondary"
            className="h-5 border-none bg-slate-50 px-2 py-0 text-[9px] font-bold text-slate-600"
          >
            {issue.issue_category.name}
          </Badge>
        )}
      </div>

      {/* Action buttons - visible on hover */}
      {showActions && !isOverlay && (
        <div
          className="pointer-events-auto absolute top-3 right-3 z-50 flex items-center space-x-1 opacity-0 transition-all duration-300 group-hover:opacity-100"
          onClick={e => e.stopPropagation()} // Prevent clicking actions from opening edit form
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-gray-50/80 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete Issue"
            onClick={e => {
              e.stopPropagation();
              onDelete(issue);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
