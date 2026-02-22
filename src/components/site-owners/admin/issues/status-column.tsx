"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IssueCard } from "./issues-card";
import { Issue, STATUS_OPTIONS } from "@/types/owner-site/admin/issues";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Extract status key type from the centralized STATUS_OPTIONS
type StatusKey = (typeof STATUS_OPTIONS)[number]["value"];

const STATUS_CONFIG: Record<
  StatusKey,
  {
    label: string;
    color: string;
    badgeVariant: "secondary" | "destructive" | "default";
    badgeColor: string;
  }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-50 border-yellow-200",
    badgeVariant: "secondary",
    badgeColor: "bg-yellow-100 text-yellow-800",
  },
  open: {
    label: "Open",
    color: "bg-red-50 border-red-200",
    badgeVariant: "destructive",
    badgeColor: "bg-red-100 text-red-800",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-50 border-blue-200",
    badgeVariant: "default",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  closed: {
    label: "Closed",
    color: "bg-green-50 border-green-200",
    badgeVariant: "secondary",
    badgeColor: "bg-green-100 text-green-800",
  },
};

interface StatusColumnProps {
  status: StatusKey;
  issues: Issue[];
  onAddIssue: (status: StatusKey) => void;
  onEditIssue: (issue: Issue) => void;
  onDeleteIssue: (issue: Issue) => void;
  onStatusChange: (issueId: number, newStatus: StatusKey) => void;
}

export function StatusColumn({
  status,
  issues,
  onAddIssue,
  onEditIssue,
  onDeleteIssue,
  onStatusChange,
}: StatusColumnProps) {
  const config = STATUS_CONFIG[status];
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border bg-gray-50/50 ${config.color} min-h-[600px] w-80 transition-colors duration-200`}
    >
      {/* Column Header */}
      <div className="border-b border-gray-200/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{config.label}</h3>
            <div
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${config.badgeColor} border border-black/5`}
            >
              {issues.length}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0 hover:bg-white/80"
            onClick={() => onAddIssue(status)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 space-y-3 p-4">
        <SortableContext
          items={issues.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {issues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onEdit={onEditIssue}
              onDelete={onDeleteIssue}
              onStatusChange={onStatusChange}
            />
          ))}
        </SortableContext>
        {issues.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200/50 py-12 text-center">
            <p className="text-sm font-medium text-gray-400 italic">
              No tasks here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
