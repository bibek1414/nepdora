"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2, ChevronDown } from "lucide-react";
import {
  Issue,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/types/owner-site/admin/issues";

type StatusKey = (typeof STATUS_OPTIONS)[number]["value"];
type PriorityKey = (typeof PRIORITY_OPTIONS)[number]["value"];

const PRIORITY_CONFIG: Record<
  PriorityKey,
  {
    variant: "destructive" | "default" | "secondary";
    color: string;
  }
> = {
  high: { variant: "destructive", color: "bg-red-100 text-red-800" },
  medium: { variant: "default", color: "bg-yellow-100 text-yellow-800" },
  low: { variant: "secondary", color: "bg-gray-100 text-gray-800" },
};

// Custom Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-8 w-full items-center justify-between rounded-md border px-2 py-1 text-xs focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center space-x-1">
          <span>{selectedOption?.label || placeholder}</span>
        </span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </button>

      {isOpen && (
        <div className="bg-popover text-popover-foreground absolute top-full z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border p-1">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-xs outline-none select-none"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  isDragging = false,
}: IssueCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority: PriorityKey) => {
    return PRIORITY_CONFIG[priority]?.color || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleStatusChange = (newStatus: string) => {
    if (
      newStatus !== issue.status &&
      STATUS_OPTIONS.some(opt => opt.value === newStatus)
    ) {
      onStatusChange(issue.id, newStatus as StatusKey);
    }
  };

  return (
    <div
      className={`group relative mb-3 cursor-grab rounded-lg border bg-white p-3 transition-all duration-200 ${
        isDragging ? "rotate-2 opacity-50" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onEdit(issue)}
    >
      <div className="mb-2 flex items-start justify-between">
        <h4 className="mr-2 line-clamp-2 flex-1 text-sm font-medium text-gray-900">
          {issue.title}
        </h4>
        <div
          className={`rounded px-2 py-1 text-xs font-medium ${getPriorityColor(issue.priority)}`}
        >
          {PRIORITY_OPTIONS.find(p => p.value === issue.priority)?.label ||
            issue.priority}
        </div>
      </div>

      {issue.description && (
        <p className="mb-2 line-clamp-2 text-xs text-gray-600">
          {issue.description}
        </p>
      )}

      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        {issue.issue_category && (
          <Badge variant="outline" className="text-xs">
            {issue.issue_category.name}
          </Badge>
        )}
        <span>{formatDate(issue.created_at)}</span>
      </div>

      {issue.reported_by && (
        <div className="flex items-center text-xs text-gray-500">
          <User className="mr-1 h-3 w-3" />
          <span className="truncate">{issue.reported_by.email}</span>
        </div>
      )}

      {/* Action buttons - visible on hover */}
      {showActions && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 rounded border bg-white p-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-100"
            onClick={e => {
              e.stopPropagation();
              onEdit(issue);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
            onClick={e => {
              e.stopPropagation();
              onDelete(issue);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
