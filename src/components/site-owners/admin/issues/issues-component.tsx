"use client";

import React from "react";
import { StatusColumn } from "./status-column";
import { Issue, STATUS_OPTIONS } from "@/types/owner-site/issues";

type StatusKey = (typeof STATUS_OPTIONS)[number]["value"];

interface IssuesComponentProps {
  issuesByStatus: Record<StatusKey, Issue[]>;
  onAddIssue: (status: StatusKey) => void;
  onEditIssue: (issue: Issue) => void;
  onDeleteIssue: (issue: Issue) => void;
  onStatusChange: (issueId: number, newStatus: StatusKey) => void;
  onDrop: (issueId: number, newStatus: StatusKey) => void;
}

export function IssuesComponent({
  issuesByStatus,
  onAddIssue,
  onEditIssue,
  onDeleteIssue,
  onStatusChange,
  onDrop,
}: IssuesComponentProps) {
  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {STATUS_OPTIONS.map(({ value: statusKey }) => (
        <StatusColumn
          key={statusKey}
          status={statusKey}
          issues={issuesByStatus[statusKey] || []}
          onAddIssue={onAddIssue}
          onEditIssue={onEditIssue}
          onDeleteIssue={onDeleteIssue}
          onStatusChange={onStatusChange}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}
